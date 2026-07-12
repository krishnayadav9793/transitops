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

export const updateTripStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status_name, odometer_reading, fuel_quantity_liters } = req.body;
        
        const { data: trip } = await supabase.from('trips').select(`*, trip_statuses(status_name)`).eq('trip_id', id).single();
        if (!trip) return res.status(404).json({ error: 'Trip not found' });

        const targetStatusId = await getStatusId('trip_statuses', status_name);
        const { data: assignment } = await supabase.from('trip_assignments').select('*').eq('trip_id', id).eq('is_active', true).single();

        if (status_name === 'DISPATCHED' && trip.trip_statuses.status_name === 'DRAFT') {
            const { data: vehicle } = await supabase.from('vehicles').select(`*, vehicle_statuses(status_name)`).eq('vehicle_id', assignment.vehicle_id).single();
            const { data: driver } = await supabase.from('drivers').select(`*, driver_statuses(status_name)`).eq('driver_id', assignment.driver_id).single();

            if (vehicle.vehicle_statuses.status_name !== 'AVAILABLE') return res.status(400).json({ error: 'Vehicle not available' });
            if (driver.driver_statuses.status_name !== 'AVAILABLE') return res.status(400).json({ error: 'Driver not available' });
            if (new Date(driver.license_expiry_date) < new Date()) return res.status(400).json({ error: 'Driver license expired' });

            const vehicleOnTripStatusId = await getStatusId('vehicle_statuses', 'ON_TRIP');
            const driverOnTripStatusId = await getStatusId('driver_statuses', 'ON_TRIP');

            await supabase.from('vehicles').update({ vehicle_status_id: vehicleOnTripStatusId }).eq('vehicle_id', assignment.vehicle_id);
            await supabase.from('drivers').update({ driver_status_id: driverOnTripStatusId }).eq('driver_id', assignment.driver_id);
        }

        if (status_name === 'COMPLETED' || status_name === 'CANCELLED') {
             const vehicleAvailStatusId = await getStatusId('vehicle_statuses', 'AVAILABLE');
             const driverAvailStatusId = await getStatusId('driver_statuses', 'AVAILABLE');
             await supabase.from('vehicles').update({ vehicle_status_id: vehicleAvailStatusId }).eq('vehicle_id', assignment.vehicle_id);
             await supabase.from('drivers').update({ driver_status_id: driverAvailStatusId }).eq('driver_id', assignment.driver_id);
             await supabase.from('trip_assignments').update({ is_active: false, unassigned_at: new Date() }).eq('trip_assignment_id', assignment.trip_assignment_id);
        }

        const updateData = { trip_status_id: targetStatusId };
        if (status_name === 'DISPATCHED') updateData.actual_start_time = new Date();
        if (status_name === 'COMPLETED') {
             updateData.actual_end_time = new Date();
             if (odometer_reading) updateData.actual_distance_km = odometer_reading; 
        }

        const { data: updatedTrip, error } = await supabase.from('trips').update(updateData).eq('trip_id', id).select();
        if (error) throw error;
        
        await supabase.from('trip_status_history').insert([{ trip_id: id, trip_status_id: targetStatusId, changed_by: req.user.user_id }]);

        if (status_name === 'COMPLETED' && fuel_quantity_liters) {
             await supabase.from('fuel_logs').insert([{
                 vehicle_id: assignment.vehicle_id, trip_id: id, driver_id: assignment.driver_id,
                 recorded_by: req.user.user_id, fuel_quantity_liters, price_per_liter: 1.5, odometer_reading
             }]);
             await supabase.from('vehicles').update({ current_odometer_km: odometer_reading }).eq('vehicle_id', assignment.vehicle_id);
        }

        res.status(200).json(updatedTrip[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getEligibleResources = async (req, res) => {
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
                    trip_assignment_id, vehicle_id, driver_id, is_active,
                    vehicles(*),
                    drivers(*)
                )
            `)
            .eq('trip_id', id)
            .single();
        if (error) throw error;
        if (!data) return res.status(404).json({ error: 'Trip not found.' });
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};