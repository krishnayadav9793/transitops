import { supabase } from '../config/supabase.js';

// GET /api/expenses/meta
export const getExpenseMetadata = async (req, res, next) => {
  try {
    const [categories, vehicles, trips, maintenance] = await Promise.all([
      supabase.from('expense_categories').select('*').order('category_name'),
      supabase.from('vehicles').select('vehicle_id, registration_number, vehicle_name').eq('is_active', true).order('vehicle_name'),
      supabase.from('trips').select('trip_id, trip_number').order('created_at', { ascending: false }),
      supabase.from('maintenance_records').select('maintenance_id, problem_description').order('created_at', { ascending: false }),
    ]);

    if (categories.error) throw categories.error;
    if (vehicles.error) throw vehicles.error;
    if (trips.error) throw trips.error;
    if (maintenance.error) throw maintenance.error;

    return res.status(200).json({
      categories: categories.data || [],
      vehicles: vehicles.data || [],
      trips: trips.data || [],
      maintenance: maintenance.data || []
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/expenses
export const getExpenses = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('expenses')
      .select(`
        *,
        expense_categories(category_name, description),
        vehicles(registration_number, vehicle_name),
        trips(trip_number),
        users:created_by(full_name)
      `)
      .order('expense_date', { ascending: false });

    if (error) throw error;
    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

// POST /api/expenses
export const createExpense = async (req, res, next) => {
  try {
    const {
      expense_category_id,
      vehicle_id,
      trip_id,
      maintenance_id,
      expense_date,
      amount,
      description,
      receipt_url
    } = req.body;

    if (!expense_category_id) {
      return res.status(400).json({ error: 'Expense category is required.' });
    }
    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ error: 'Valid amount greater than 0 is required.' });
    }

    const { data, error } = await supabase
      .from('expenses')
      .insert([
        {
          expense_category_id: Number(expense_category_id),
          vehicle_id: vehicle_id ? Number(vehicle_id) : null,
          trip_id: trip_id ? Number(trip_id) : null,
          maintenance_id: maintenance_id ? Number(maintenance_id) : null,
          expense_date: expense_date || new Date().toISOString().split('T')[0],
          amount: Number(amount),
          description: description ? description.trim() : null,
          receipt_url: receipt_url ? receipt_url.trim() : null,
          created_by: req.user.user_id,
        },
      ])
      .select(`
        *,
        expense_categories(category_name, description),
        vehicles(registration_number, vehicle_name),
        trips(trip_number)
      `)
      .single();

    if (error) throw error;
    return res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

// GET /api/expenses/fuel
export const getFuelLogs = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('fuel_logs')
      .select(`
        *,
        vehicles(registration_number, vehicle_name),
        trips(trip_number),
        drivers(full_name),
        users:recorded_by(full_name)
      `)
      .order('fuel_date', { ascending: false });

    if (error) throw error;
    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

// POST /api/expenses/fuel
export const createFuelLog = async (req, res, next) => {
  try {
    const {
      vehicle_id,
      trip_id,
      driver_id,
      fuel_date,
      fuel_quantity_liters,
      price_per_liter,
      odometer_reading,
      fuel_station,
      receipt_url
    } = req.body;

    if (!vehicle_id) {
      return res.status(400).json({ error: 'Vehicle is required.' });
    }
    if (!fuel_quantity_liters || Number(fuel_quantity_liters) <= 0) {
      return res.status(400).json({ error: 'Valid fuel quantity in liters is required.' });
    }
    if (!price_per_liter || Number(price_per_liter) <= 0) {
      return res.status(400).json({ error: 'Valid price per liter is required.' });
    }
    if (odometer_reading === undefined || Number(odometer_reading) < 0) {
      return res.status(400).json({ error: 'Odometer reading cannot be negative.' });
    }

    // Insert Fuel Log record
    const { data: fuelLog, error: fuelErr } = await supabase
      .from('fuel_logs')
      .insert([
        {
          vehicle_id: Number(vehicle_id),
          trip_id: trip_id ? Number(trip_id) : null,
          driver_id: driver_id ? Number(driver_id) : null,
          recorded_by: req.user.user_id,
          fuel_date: fuel_date || new Date().toISOString(),
          fuel_quantity_liters: Number(fuel_quantity_liters),
          price_per_liter: Number(price_per_liter),
          odometer_reading: Number(odometer_reading),
          fuel_station: fuel_station ? fuel_station.trim() : null,
          receipt_url: receipt_url ? receipt_url.trim() : null,
        },
      ])
      .select(`
        *,
        vehicles(registration_number, vehicle_name),
        trips(trip_number),
        drivers(full_name)
      `)
      .single();

    if (fuelErr) throw fuelErr;

    // Automatically create a corresponding Fuel Expense log in the ledger
    const { data: category } = await supabase
      .from('expense_categories')
      .select('expense_category_id')
      .eq('category_name', 'FUEL')
      .single();

    if (category) {
      const fuelCost = Number(fuel_quantity_liters) * Number(price_per_liter);
      await supabase.from('expenses').insert([
        {
          expense_category_id: category.expense_category_id,
          vehicle_id: Number(vehicle_id),
          trip_id: trip_id ? Number(trip_id) : null,
          amount: fuelCost,
          description: `Fuel refill at ${fuel_station || 'Station'} (${fuel_quantity_liters}L @ $${price_per_liter}/L)`,
          receipt_url: receipt_url || null,
          created_by: req.user.user_id,
          expense_date: fuel_date ? fuel_date.split('T')[0] : new Date().toISOString().split('T')[0]
        },
      ]);
    }

    return res.status(201).json(fuelLog);
  } catch (error) {
    next(error);
  }
};
