import { supabase } from '../config/supabase.js';

const getStatusId = async (table, statusName) => {
    const { data } = await supabase.from(table).select('*').eq('status_name', statusName).single();
    return data?.trip_status_id || data?.vehicle_status_id || data?.driver_status_id;
};

export const getTrips = async (req, res) => {
    try {
        const { data, error } = await supabase.from('trips')
            .select(`
                *,
                trip_statuses(status_name),
                trip_assignments(
                    vehicle_id, driver_id,
                    vehicles(registration_number),
                    drivers(full_name)
                )
            `)
            .order('created_at', { ascending: false });
        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createTrip = async (req, res) => {
    try {
        const { source, destination, cargo_weight_kg, estimated_distance_km, vehicle_id, driver_id } = req.body;
        const draftStatusId = await getStatusId('trip_statuses', 'DRAFT');
        const tripNumber = `TRP-${Date.now()}`;
        
        const { data: trip, error: tripErr } = await supabase.from('trips').insert([{
            trip_number: tripNumber,
            source, destination, cargo_weight_kg, estimated_distance_km,
            trip_status_id: draftStatusId,
            created_by: req.user.user_id
        }]).select().single();
        if (tripErr) throw tripErr;

        if (vehicle_id && driver_id) {
            await supabase.from('trip_assignments').insert([{
                trip_id: trip.trip_id,
                vehicle_id, driver_id,
                assigned_by: req.user.user_id
            }]);
        }

        res.status(201).json(trip);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const dispatchTrip = async (req, res) => {
    try {
        const { id } = req.params;

        const { data: trip } = await supabase.from('trips')
            .select('*, trip_statuses(status_name)')
            .eq('trip_id', id).single();
        if (!trip) return res.status(404).json({ error: 'Trip not found' });
        if (trip.trip_statuses.status_name !== 'DRAFT') return res.status(400).json({ error: 'Only DRAFT trips can be dispatched' });

        const { data: assignment } = await supabase.from('trip_assignments')
            .select('*').eq('trip_id', id).eq('is_active', true).single();
        if (!assignment) return res.status(400).json({ error: 'No active assignment found for this trip' });

        const { data: vehicle } = await supabase.from('vehicles')
            .select('*, vehicle_statuses(status_name)').eq('vehicle_id', assignment.vehicle_id).single();
        const { data: driver } = await supabase.from('drivers')
            .select('*, driver_statuses(status_name)').eq('driver_id', assignment.driver_id).single();

        if (vehicle.vehicle_statuses.status_name !== 'AVAILABLE') return res.status(400).json({ error: 'Vehicle is not available' });
        if (driver.driver_statuses.status_name !== 'AVAILABLE') return res.status(400).json({ error: 'Driver is not available' });
        if (new Date(driver.license_expiry_date) < new Date()) return res.status(400).json({ error: 'Driver license is expired' });

        const dispatchedStatusId = await getStatusId('trip_statuses', 'DISPATCHED');
        const vehicleOnTripStatusId = await getStatusId('vehicle_statuses', 'ON_TRIP');
        const driverOnTripStatusId = await getStatusId('driver_statuses', 'ON_TRIP');

        await supabase.from('vehicles').update({ vehicle_status_id: vehicleOnTripStatusId }).eq('vehicle_id', assignment.vehicle_id);
        await supabase.from('drivers').update({ driver_status_id: driverOnTripStatusId }).eq('driver_id', assignment.driver_id);

        const { data: updatedTrip, error } = await supabase.from('trips')
            .update({ trip_status_id: dispatchedStatusId, actual_start_time: new Date() })
            .eq('trip_id', id).select().single();
        if (error) throw error;

        await supabase.from('trip_status_history').insert([{ trip_id: id, trip_status_id: dispatchedStatusId, changed_by: req.user.user_id }]);

        res.status(200).json(updatedTrip);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const completeTrip = async (req, res) => {
    try {
        const { id } = req.params;
        const { odometer_reading, fuel_quantity_liters } = req.body;

        const { data: trip } = await supabase.from('trips')
            .select('*, trip_statuses(status_name)')
            .eq('trip_id', id).single();
        if (!trip) return res.status(404).json({ error: 'Trip not found' });

        const { data: assignment } = await supabase.from('trip_assignments')
            .select('*').eq('trip_id', id).eq('is_active', true).single();

        const completedStatusId = await getStatusId('trip_statuses', 'COMPLETED');
        const vehicleAvailStatusId = await getStatusId('vehicle_statuses', 'AVAILABLE');
        const driverAvailStatusId = await getStatusId('driver_statuses', 'AVAILABLE');

        await supabase.from('vehicles').update({ vehicle_status_id: vehicleAvailStatusId }).eq('vehicle_id', assignment.vehicle_id);
        await supabase.from('drivers').update({ driver_status_id: driverAvailStatusId }).eq('driver_id', assignment.driver_id);
        await supabase.from('trip_assignments').update({ is_active: false, unassigned_at: new Date() }).eq('trip_assignment_id', assignment.trip_assignment_id);

        const { data: updatedTrip, error } = await supabase.from('trips')
            .update({ trip_status_id: completedStatusId, actual_end_time: new Date(), actual_distance_km: odometer_reading })
            .eq('trip_id', id).select().single();
        if (error) throw error;

        await supabase.from('trip_status_history').insert([{ trip_id: id, trip_status_id: completedStatusId, changed_by: req.user.user_id }]);

        if (fuel_quantity_liters) {
            await supabase.from('fuel_logs').insert([{
                vehicle_id: assignment.vehicle_id, trip_id: id, driver_id: assignment.driver_id,
                recorded_by: req.user.user_id, fuel_quantity_liters, price_per_liter: 1.5, odometer_reading
            }]);
            await supabase.from('vehicles').update({ current_odometer_km: odometer_reading }).eq('vehicle_id', assignment.vehicle_id);
        }

        res.status(200).json(updatedTrip);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const cancelTrip = async (req, res) => {
    try {
        const { id } = req.params;

        const { data: trip } = await supabase.from('trips')
            .select('*, trip_statuses(status_name)')
            .eq('trip_id', id).single();
        if (!trip) return res.status(404).json({ error: 'Trip not found' });

        const currentStatus = trip.trip_statuses.status_name;
        if (!['DRAFT', 'DISPATCHED'].includes(currentStatus)) {
            return res.status(400).json({ error: 'Only DRAFT or DISPATCHED trips can be cancelled' });
        }

        const cancelledStatusId = await getStatusId('trip_statuses', 'CANCELLED');

        const { data: assignment } = await supabase.from('trip_assignments')
            .select('*').eq('trip_id', id).eq('is_active', true).maybeSingle();

        if (assignment) {
            const vehicleAvailStatusId = await getStatusId('vehicle_statuses', 'AVAILABLE');
            const driverAvailStatusId = await getStatusId('driver_statuses', 'AVAILABLE');
            await supabase.from('vehicles').update({ vehicle_status_id: vehicleAvailStatusId }).eq('vehicle_id', assignment.vehicle_id);
            await supabase.from('drivers').update({ driver_status_id: driverAvailStatusId }).eq('driver_id', assignment.driver_id);
            await supabase.from('trip_assignments').update({ is_active: false, unassigned_at: new Date() }).eq('trip_assignment_id', assignment.trip_assignment_id);
        }

        const { data: updatedTrip, error } = await supabase.from('trips')
            .update({ trip_status_id: cancelledStatusId })
            .eq('trip_id', id).select().single();
        if (error) throw error;

        await supabase.from('trip_status_history').insert([{ trip_id: id, trip_status_id: cancelledStatusId, changed_by: req.user.user_id }]);

        res.status(200).json(updatedTrip);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getResources = async (req, res) => {
    try {
        const vehicleAvailStatusId = await getStatusId('vehicle_statuses', 'AVAILABLE');
        const driverAvailStatusId = await getStatusId('driver_statuses', 'AVAILABLE');

        const { data: vehicles } = await supabase.from('vehicles').select('*').eq('vehicle_status_id', vehicleAvailStatusId);
        const { data: drivers } = await supabase.from('drivers').select('*').eq('driver_status_id', driverAvailStatusId).gte('license_expiry_date', new Date().toISOString());
        
        res.status(200).json({ vehicles, drivers });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getTripById = async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase.from('trips')
            .select(`
                *,
                trip_statuses(status_name),
                trip_assignments(
                    vehicles(registration_number, vehicle_name),
                    drivers(full_name, email)
                )
            `)
            .eq('trip_id', id)
            .single();
            
        if (error) throw error;
        if (!data) return res.status(404).json({ error: 'Trip not found' });
        
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};