// Maintenance Controller - Developer 2
// Works against the live (normalized) Supabase schema:
// maintenance_records(maintenance_id, vehicle_id -> vehicles,
//                     maintenance_type_id -> maintenance_types, start_date,
//                     estimated_cost, actual_cost,
//                     maintenance_status_id -> maintenance_statuses,
//                     created_at, updated_at)
// Status flow: IN_PROGRESS (open) -> COMPLETED (closed).

import { supabase } from '../config/supabase.js';
import { vehicleStatuses, maintenanceStatuses } from '../utils/lookups.js';

const RECORD_SELECT = `
  *,
  maintenance_types(type_name),
  maintenance_statuses(status_name),
  vehicles(vehicle_id, registration_number, vehicle_name, model)
`;

export const getMaintenanceLogs = async (req, res, next) => {
  try {
    const { vehicle_id, status } = req.query;

    let query = supabase
      .from('maintenance_records')
      .select(RECORD_SELECT)
      .order('maintenance_id', { ascending: false });

    if (vehicle_id) query = query.eq('vehicle_id', vehicle_id);
    if (status) {
      const { byName } = await maintenanceStatuses();
      const statusId = byName[status.toUpperCase().replace(/ /g, '_')];
      if (statusId) query = query.eq('maintenance_status_id', statusId);
    }

    const { data, error } = await query;
    if (error) throw error;

    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const createMaintenanceRecord = async (req, res, next) => {
  try {
    const { vehicle_id, maintenance_type_id, start_date, estimated_cost, description, expected_completion_date } = req.body;

    if (!vehicle_id || !maintenance_type_id || !start_date) {
      return res.status(400).json({ error: 'vehicle_id, maintenance_type_id and start_date are required.' });
    }

    const vStatuses = await vehicleStatuses();
    const mStatuses = await maintenanceStatuses();

    // Business rule: only an Available vehicle can enter the shop
    const { data: vehicle, error: vehicleError } = await supabase
      .from('vehicles')
      .select('vehicle_id, registration_number, vehicle_status_id, is_active')
      .eq('vehicle_id', vehicle_id)
      .single();

    if (vehicleError || !vehicle || !vehicle.is_active) {
      return res.status(404).json({ error: 'Vehicle not found.' });
    }

    const currentStatus = vStatuses.byId[vehicle.vehicle_status_id];
    if (currentStatus === 'ON_TRIP') {
      return res.status(400).json({ error: `Vehicle '${vehicle.registration_number}' is currently on a trip and cannot enter maintenance.` });
    }
    if (currentStatus === 'IN_SHOP') {
      return res.status(400).json({ error: `Vehicle '${vehicle.registration_number}' is already in the shop.` });
    }
    if (currentStatus === 'RETIRED') {
      return res.status(400).json({ error: `Vehicle '${vehicle.registration_number}' is retired and cannot enter maintenance.` });
    }

    const { data: record, error: recordError } = await supabase
      .from('maintenance_records')
      .insert([{
        vehicle_id: Number(vehicle_id),
        maintenance_type_id: Number(maintenance_type_id),
        start_date,
        estimated_cost: estimated_cost != null ? Number(estimated_cost) : null,
        maintenance_status_id: mStatuses.byName['IN_PROGRESS'],
        reported_by: req.user?.id ?? null, // NOT NULL column; set from the authenticated user
        problem_description: description?.trim() || 'Scheduled maintenance', // NOT NULL column
        expected_completion_date: expected_completion_date || null,
      }])
      .select(RECORD_SELECT)
      .single();

    if (recordError) throw recordError;

    // Rule 1: an open maintenance record puts the vehicle In Shop,
    // removing it from the dispatch selection pool
    const { error: statusError } = await supabase
      .from('vehicles')
      .update({ vehicle_status_id: vStatuses.byName['IN_SHOP'], updated_at: new Date().toISOString() })
      .eq('vehicle_id', vehicle_id);

    if (statusError) throw statusError;

    return res.status(201).json(record);
  } catch (error) {
    next(error);
  }
};

export const closeMaintenanceRecord = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { actual_cost } = req.body ?? {};

    const vStatuses = await vehicleStatuses();
    const mStatuses = await maintenanceStatuses();

    const { data: record, error: recordError } = await supabase
      .from('maintenance_records')
      .select('*')
      .eq('maintenance_id', id)
      .single();

    if (recordError || !record) {
      return res.status(404).json({ error: 'Maintenance record not found.' });
    }

    const recordStatus = mStatuses.byId[record.maintenance_status_id];
    if (recordStatus === 'COMPLETED' || recordStatus === 'CANCELLED') {
      return res.status(400).json({ error: `This maintenance record is already ${recordStatus.toLowerCase()}.` });
    }

    const { data: updatedRecord, error: updateError } = await supabase
      .from('maintenance_records')
      .update({
        maintenance_status_id: mStatuses.byName['COMPLETED'],
        actual_cost: actual_cost != null ? Number(actual_cost) : record.estimated_cost,
        actual_completion_date: new Date().toISOString().slice(0, 10),
        updated_at: new Date().toISOString(),
      })
      .eq('maintenance_id', id)
      .select(RECORD_SELECT)
      .single();

    if (updateError) throw updateError;

    // Rule 2: closing maintenance restores the vehicle to Available,
    // unless it has been Retired in the meantime
    const { data: vehicle } = await supabase
      .from('vehicles')
      .select('vehicle_id, vehicle_status_id')
      .eq('vehicle_id', record.vehicle_id)
      .single();

    if (vehicle && vStatuses.byId[vehicle.vehicle_status_id] !== 'RETIRED') {
      const { error: statusError } = await supabase
        .from('vehicles')
        .update({ vehicle_status_id: vStatuses.byName['AVAILABLE'], updated_at: new Date().toISOString() })
        .eq('vehicle_id', vehicle.vehicle_id);

      if (statusError) throw statusError;
    }

    return res.status(200).json(updatedRecord);
  } catch (error) {
    next(error);
  }
};
