import { supabase } from '../config/db.js';

const getStatusId = async (table, statusName) => {
    const { data } = await supabase.from(table).select('*').eq('status_name', statusName).single();
    return data?.vehicle_status_id || data?.maintenance_status_id;
};

export const getMaintenanceLogs = async (req, res) => {
    try {
        const { data, error } = await supabase.from('maintenance_records')
            .select('*, vehicles(registration_number), maintenance_types(type_name), maintenance_statuses(status_name)')
            .order('created_at', { ascending: false });
        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createMaintenanceLog = async (req, res) => {
    try {
        const { vehicle_id, maintenance_type_id, problem_description, estimated_cost, start_date, expected_completion_date } = req.body;
        
        const inProgressStatusId = await getStatusId('maintenance_statuses', 'IN_PROGRESS');
        const inShopVehicleStatusId = await getStatusId('vehicle_statuses', 'IN_SHOP');

        const { data: record, error } = await supabase.from('maintenance_records').insert([{
            vehicle_id, maintenance_type_id, problem_description, estimated_cost, start_date, expected_completion_date,
            maintenance_status_id: inProgressStatusId,
            reported_by: req.user.user_id
        }]).select().single();
        if (error) throw error;

        await supabase.from('vehicles').update({ vehicle_status_id: inShopVehicleStatusId }).eq('vehicle_id', vehicle_id);

        res.status(201).json(record);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const closeMaintenanceLog = async (req, res) => {
    try {
        const { id } = req.params;
        const { actual_cost, actual_completion_date } = req.body;
        
        const completedStatusId = await getStatusId('maintenance_statuses', 'COMPLETED');
        const availableVehicleStatusId = await getStatusId('vehicle_statuses', 'AVAILABLE');

        const { data: record, error: recordErr } = await supabase.from('maintenance_records')
            .update({ maintenance_status_id: completedStatusId, actual_cost, actual_completion_date })
            .eq('maintenance_id', id).select().single();
        if (recordErr) throw recordErr;

        const { data: vehicle } = await supabase.from('vehicles').select('*, vehicle_statuses(status_name)').eq('vehicle_id', record.vehicle_id).single();
        
        if (vehicle.vehicle_statuses.status_name !== 'RETIRED') {
            await supabase.from('vehicles').update({ vehicle_status_id: availableVehicleStatusId }).eq('vehicle_id', record.vehicle_id);
        }

        res.status(200).json(record);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getMaintenanceTypes = async (req, res) => {
    try {
        const { data, error } = await supabase.from('maintenance_types').select('*');
        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getMaintenanceLogById = async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase.from('maintenance_records')
            .select('*, vehicles(*), maintenance_types(*), maintenance_statuses(*), users:reported_by(full_name)')
            .eq('maintenance_id', id)
            .single();
        if (error) throw error;
        if (!data) return res.status(404).json({ error: 'Maintenance record not found.' });
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};