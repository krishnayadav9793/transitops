import { supabase } from '../config/supabase.js';

const getStatusId = async (table, statusName) => {
    const { data } = await supabase.from(table).select('*').eq('status_name', statusName).single();
    return data?.vehicle_status_id || data?.document_type_id;
};

export const getVehicles = async (req, res) => {
    try {
        const { data, error } = await supabase.from('vehicles')
            .select('*, vehicle_statuses(status_name), vehicle_types(type_name)')
            .order('created_at', { ascending: false });
        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createVehicle = async (req, res) => {
    try {
        const { registration_number, vehicle_name, model, vehicle_type_id, capacity_kg, current_odometer_km, purchase_cost } = req.body;
        
        const { data: existing } = await supabase.from('vehicles').select('*').eq('registration_number', registration_number).single();
        if (existing) return res.status(400).json({ error: 'Registration number must be unique' });

        const availableStatusId = await getStatusId('vehicle_statuses', 'AVAILABLE');

        const { data, error } = await supabase.from('vehicles').insert([{
            registration_number, vehicle_name, model, vehicle_type_id, capacity_kg, current_odometer_km, purchase_cost,
            vehicle_status_id: availableStatusId
        }]).select();
        if (error) throw error;
        res.status(201).json(data[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateVehicle = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const { data, error } = await supabase.from('vehicles').update(updates).eq('vehicle_id', id).select();
        if (error) throw error;
        res.status(200).json(data[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteVehicle = async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = await supabase.from('vehicles').delete().eq('vehicle_id', id);
        if (error) throw error;
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getVehicleTypes = async (req, res) => {
    try {
        const { data, error } = await supabase.from('vehicle_types').select('*');
        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getDocumentTypes = async (req, res) => {
    try {
        const { data, error } = await supabase.from('document_types').select('*');
        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const uploadDocument = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
        const { vehicle_id, document_type_id } = req.body;
        const file_url = `/uploads/${req.file.filename}`;
        
        const { data, error } = await supabase.from('vehicle_documents').insert([{
            vehicle_id, document_type_id, file_url
        }]).select();
        if (error) throw error;
        res.status(201).json(data[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getVehicleById = async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase.from('vehicles')
            .select('*, vehicle_statuses(status_name), vehicle_types(type_name)')
            .eq('vehicle_id', id)
            .single();
        
        if (error) throw error;
        if (!data) return res.status(404).json({ error: 'Vehicle not found' });
        
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};