// Lookup-table helpers - Developer 2
// The live Supabase schema is normalized: statuses/types/regions live in
// lookup tables and rows reference them by id. These helpers resolve
// name <-> id with a simple in-memory cache (lookup values never change
// during a run).

import { supabase } from '../config/supabase.js';

const cache = {};

const load = async (table, idCol, nameCol) => {
  if (!cache[table]) {
    const { data, error } = await supabase.from(table).select('*');
    if (error) throw error;
    const byName = {};
    const byId = {};
    for (const row of data) {
      byName[row[nameCol]] = row[idCol];
      byId[row[idCol]] = row[nameCol];
    }
    cache[table] = { byName, byId };
  }
  return cache[table];
};

export const vehicleStatuses = () => load('vehicle_statuses', 'vehicle_status_id', 'status_name');
export const maintenanceStatuses = () => load('maintenance_statuses', 'maintenance_status_id', 'status_name');
export const vehicleTypes = () => load('vehicle_types', 'vehicle_type_id', 'type_name');
export const regions = () => load('regions', 'region_id', 'region_name');
