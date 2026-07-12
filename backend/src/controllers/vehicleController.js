// Vehicle Controller - Developer 2
// Works against the live (normalized) Supabase schema:
// vehicles(vehicle_id, registration_number, vehicle_name, model,
//          vehicle_type_id -> vehicle_types, capacity_kg, current_odometer_km,
//          purchase_cost, purchase_date, region_id -> regions,
//          vehicle_status_id -> vehicle_statuses, is_active, created_at, updated_at)

import { supabase } from '../config/supabase.js';
import { vehicleStatuses } from '../utils/lookups.js';

// Postgres error codes
const UNIQUE_VIOLATION = '23505';
const FK_VIOLATION = '23503';

const VEHICLE_SELECT = `
  *,
  vehicle_statuses(status_name),
  vehicle_types(type_name),
  regions(region_name)
`;

export const getVehicles = async (req, res, next) => {
  try {
    const { status, type_id, region_id, search, include_inactive } = req.query;

    let query = supabase
      .from('vehicles')
      .select(VEHICLE_SELECT)
      .order('vehicle_id', { ascending: true });

    if (!include_inactive) query = query.eq('is_active', true);
    if (type_id) query = query.eq('vehicle_type_id', type_id);
    if (region_id) query = query.eq('region_id', region_id);
    if (status) {
      const { byName } = await vehicleStatuses();
      const statusId = byName[status.toUpperCase().replace(/ /g, '_')];
      if (statusId) query = query.eq('vehicle_status_id', statusId);
    }
    if (search) {
      query = query.or(
        `registration_number.ilike.%${search}%,vehicle_name.ilike.%${search}%,model.ilike.%${search}%`
      );
    }

    const { data, error } = await query;
    if (error) throw error;

    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const createVehicle = async (req, res, next) => {
  try {
    const {
      registration_number,
      vehicle_name,
      model,
      vehicle_type_id,
      capacity_kg,
      current_odometer_km,
      purchase_cost,
      purchase_date,
      region_id,
    } = req.body;

    if (!registration_number || !vehicle_name || !vehicle_type_id || capacity_kg == null || purchase_cost == null || !region_id) {
      return res.status(400).json({
        error: 'registration_number, vehicle_name, vehicle_type_id, capacity_kg, purchase_cost and region_id are required.'
      });
    }

    if (Number(capacity_kg) <= 0) {
      return res.status(400).json({ error: 'Capacity (kg) must be greater than 0.' });
    }

    const { byName } = await vehicleStatuses();

    const { data, error } = await supabase
      .from('vehicles')
      .insert([{
        registration_number: registration_number.trim(),
        vehicle_name: vehicle_name.trim(),
        model: model?.trim() || vehicle_name.trim(),
        vehicle_type_id: Number(vehicle_type_id),
        capacity_kg: Number(capacity_kg),
        current_odometer_km: Number(current_odometer_km) || 0,
        purchase_cost: Number(purchase_cost),
        purchase_date: purchase_date || null,
        region_id: Number(region_id),
        vehicle_status_id: byName['AVAILABLE'],
        is_active: true,
      }])
      .select(VEHICLE_SELECT)
      .single();

    if (error) {
      if (error.code === UNIQUE_VIOLATION) {
        return res.status(409).json({ error: `A vehicle with registration number '${registration_number}' already exists.` });
      }
      throw error;
    }

    return res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

export const updateVehicle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      registration_number,
      vehicle_name,
      model,
      vehicle_type_id,
      capacity_kg,
      current_odometer_km,
      purchase_cost,
      purchase_date,
      region_id,
      status,
    } = req.body;

    if (capacity_kg != null && Number(capacity_kg) <= 0) {
      return res.status(400).json({ error: 'Capacity (kg) must be greater than 0.' });
    }

    const updates = {};
    if (registration_number !== undefined) updates.registration_number = registration_number.trim();
    if (vehicle_name !== undefined) updates.vehicle_name = vehicle_name.trim();
    if (model !== undefined) updates.model = model?.trim();
    if (vehicle_type_id !== undefined) updates.vehicle_type_id = Number(vehicle_type_id);
    if (capacity_kg !== undefined) updates.capacity_kg = Number(capacity_kg);
    if (current_odometer_km !== undefined) updates.current_odometer_km = Number(current_odometer_km);
    if (purchase_cost !== undefined) updates.purchase_cost = Number(purchase_cost);
    if (purchase_date !== undefined) updates.purchase_date = purchase_date;
    if (region_id !== undefined) updates.region_id = Number(region_id);

    if (status !== undefined) {
      const { byName } = await vehicleStatuses();
      const statusId = byName[status.toUpperCase().replace(/ /g, '_')];
      if (!statusId) {
        return res.status(400).json({ error: `Unknown vehicle status '${status}'.` });
      }
      updates.vehicle_status_id = statusId;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No fields provided to update.' });
    }
    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('vehicles')
      .update(updates)
      .eq('vehicle_id', id)
      .select(VEHICLE_SELECT);

    if (error) {
      if (error.code === UNIQUE_VIOLATION) {
        return res.status(409).json({ error: `A vehicle with registration number '${registration_number}' already exists.` });
      }
      throw error;
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Vehicle not found.' });
    }

    return res.status(200).json(data[0]);
  } catch (error) {
    next(error);
  }
};

export const deleteVehicle = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Soft delete: the schema carries is_active for exactly this purpose,
    // and trips reference vehicles so hard deletes would break history.
    const { data, error } = await supabase
      .from('vehicles')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('vehicle_id', id)
      .select();

    if (error) {
      if (error.code === FK_VIOLATION) {
        return res.status(409).json({
          error: 'This vehicle has linked records and cannot be removed. Mark it as Retired instead.'
        });
      }
      throw error;
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Vehicle not found.' });
    }

    return res.status(200).json({ message: 'Vehicle removed from the registry.', vehicle: data[0] });
  } catch (error) {
    next(error);
  }
};
