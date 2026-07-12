import { supabase } from '../config/supabase.js';

export const getVehicleROI = async (req, res) => {
    try {
        const { data: vehicles } = await supabase.from('vehicles').select('*');
        const { data: trips } = await supabase.from('trips').select('trip_id, actual_revenue, trip_assignments(vehicle_id)');
        const { data: maintenance } = await supabase.from('maintenance_records').select('vehicle_id, actual_cost');
        const { data: fuel } = await supabase.from('fuel_logs').select('vehicle_id, fuel_quantity_liters, price_per_liter');
        
        const roiData = vehicles.map(vehicle => {
            const vTrips = trips.filter(t => t.trip_assignments.some(a => a.vehicle_id === vehicle.vehicle_id));
            const vMaint = maintenance.filter(m => m.vehicle_id === vehicle.vehicle_id);
            const vFuel = fuel.filter(f => f.vehicle_id === vehicle.vehicle_id);
            
            const totalRevenue = vTrips.reduce((sum, t) => sum + (Number(t.actual_revenue) || 0), 0);
            const totalFuelCost = vFuel.reduce((sum, f) => sum + ((Number(f.fuel_quantity_liters) * Number(f.price_per_liter)) || 0), 0);
            const totalMaintenance = vMaint.reduce((sum, m) => sum + (Number(m.actual_cost) || 0), 0);
            
            const totalCosts = totalFuelCost + totalMaintenance;
            const acquisition = Number(vehicle.purchase_cost) || 100000;
            
            return {
                registration: vehicle.registration_number,
                revenue: totalRevenue,
                costs: totalCosts,
                acquisition: acquisition,
                roi: (((totalRevenue - totalCosts) / acquisition) * 100).toFixed(2)
            };
        });
        
        res.status(200).json(roiData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};