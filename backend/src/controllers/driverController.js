import { supabase } from '../config/supabase.js';

// GET /api/drivers
export const getDrivers = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('drivers')
      .select(`
        *,
        driver_statuses(status_name),
        license_categories(category_code, category_name),
        trip_assignments(
          is_active,
          vehicles(registration_number, vehicle_name)
        )
      `)
      .order('full_name');

    if (error) throw error;
    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

// GET /api/drivers/meta
export const getDriverMetadata = async (req, res, next) => {
  try {
    const [categories, statuses] = await Promise.all([
      supabase.from('license_categories').select('*').order('category_name'),
      supabase.from('driver_statuses').select('*').order('status_name'),
    ]);

    if (categories.error) throw categories.error;
    if (statuses.error) throw statuses.error;

    return res.status(200).json({
      categories: categories.data || [],
      statuses: statuses.data || []
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/drivers/:id
export const getDriverById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('drivers')
      .select(`
        *,
        driver_statuses(status_name),
        license_categories(category_code, category_name),
        trip_assignments(
          is_active,
          vehicles(registration_number, vehicle_name)
        )
      `)
      .eq('driver_id', id)
      .single();


    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Driver profile not found.' });
      }
      throw error;
    }
    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

// POST /api/drivers
export const createDriver = async (req, res, next) => {
  try {
    const {
      full_name,
      phone,
      email,
      license_number,
      license_expiry_date,
      license_category_id,
      driver_status_id,
      safety_score,
      joining_date
    } = req.body;

    if (!full_name || !full_name.trim()) {
      return res.status(400).json({ error: 'Full name is required.' });
    }
    if (!phone || !phone.trim()) {
      return res.status(400).json({ error: 'Phone number is required.' });
    }
    if (!license_number || !license_number.trim()) {
      return res.status(400).json({ error: 'License number is required.' });
    }
    if (!license_expiry_date) {
      return res.status(400).json({ error: 'License expiry date is required.' });
    }
    if (!license_category_id) {
      return res.status(400).json({ error: 'License category is required.' });
    }
    if (!driver_status_id) {
      return res.status(400).json({ error: 'Driver status is required.' });
    }

    const { data, error } = await supabase
      .from('drivers')
      .insert([
        {
          full_name: full_name.trim(),
          phone: phone.trim(),
          email: email ? email.trim() : null,
          license_number: license_number.trim(),
          license_expiry_date,
          license_category_id: Number(license_category_id),
          driver_status_id: Number(driver_status_id),
          safety_score: safety_score !== undefined ? Number(safety_score) : 100,
          joining_date: joining_date || null
        },
      ])
      .select('*, driver_statuses(status_name), license_categories(category_code, category_name)')
      .single();

    if (error) {
      if (error.code === '23505') {
        if (error.message && error.message.includes('phone')) {
          return res.status(409).json({ error: 'A driver with this phone number already exists.' });
        }
        return res.status(409).json({ error: 'A driver with this license number already exists.' });
      }
      throw error;
    }

    return res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

// PUT /api/drivers/:id
export const updateDriver = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      full_name,
      phone,
      email,
      license_number,
      license_expiry_date,
      license_category_id,
      driver_status_id,
      safety_score,
      joining_date,
      is_active
    } = req.body;

    const payload = {};
    if (full_name !== undefined) {
      if (!full_name.trim()) return res.status(400).json({ error: 'Full name cannot be empty.' });
      payload.full_name = full_name.trim();
    }
    if (phone !== undefined) {
      if (!phone.trim()) return res.status(400).json({ error: 'Phone number cannot be empty.' });
      payload.phone = phone.trim();
    }
    if (email !== undefined) {
      payload.email = email ? email.trim() : null;
    }
    if (license_number !== undefined) {
      if (!license_number.trim()) return res.status(400).json({ error: 'License number cannot be empty.' });
      payload.license_number = license_number.trim();
    }
    if (license_expiry_date !== undefined) payload.license_expiry_date = license_expiry_date;
    if (license_category_id !== undefined) payload.license_category_id = Number(license_category_id);
    if (driver_status_id !== undefined) payload.driver_status_id = Number(driver_status_id);
    if (safety_score !== undefined) {
      const score = Number(safety_score);
      if (isNaN(score) || score < 0 || score > 100) {
        return res.status(400).json({ error: 'Safety score must be between 0 and 100.' });
      }
      payload.safety_score = score;
    }
    if (joining_date !== undefined) payload.joining_date = joining_date || null;
    if (is_active !== undefined) payload.is_active = Boolean(is_active);

    const { data, error } = await supabase
      .from('drivers')
      .update(payload)
      .eq('driver_id', id)
      .select('*, driver_statuses(status_name), license_categories(category_code, category_name)')
      .single();

    if (error) {
      if (error.code === '23505') {
        if (error.message && error.message.includes('phone')) {
          return res.status(409).json({ error: 'A driver with this phone number already exists.' });
        }
        return res.status(409).json({ error: 'A driver with this license number already exists.' });
      }
      throw error;
    }

    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/drivers/:id
export const deleteDriver = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('drivers')
      .delete()
      .eq('driver_id', id);

    if (error) throw error;
    return res.status(200).json({ message: 'Driver successfully deleted.' });
  } catch (error) {
    next(error);
  }
};
