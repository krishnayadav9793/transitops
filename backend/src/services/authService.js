import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabase.js';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_dev_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const roleFromUser = (user) =>
  user.user_roles?.[0]?.roles?.role_name || 'Unknown';

export const authService = {
  async login(email, password) {
    const { data: user, error } = await supabase
      .from('users')
      .select('*, user_roles(roles(role_name))')
      .eq('email', email)
      .single();

    // ==========================
    // DEBUG LOGS
    // ==========================
    console.log('\n========== LOGIN DEBUG ==========');
    console.log('Email entered:', email);
    console.log('Supabase error:', error);
    console.log('User returned:', user);

    if (user) {
      console.log('Stored hash:', user.password_hash);

      const valid = await bcrypt.compare(password, user.password_hash);

      console.log('Entered password:', password);
      console.log('Password match:', valid);

      if (!valid) {
        const err = new Error('Invalid email or password');
        err.status = 401;
        throw err;
      }
    } else {
      const err = new Error('Invalid email or password');
      err.status = 401;
      throw err;
    }

    if (user.is_active === false) {
      const err = new Error('Account has been deactivated.');
      err.status = 403;
      throw err;
    }

    const role = roleFromUser(user);

    console.log('Resolved role:', role);
    console.log('===============================\n');

    const token = jwt.sign(
      {
        user_id: user.user_id,
        email: user.email,
        role_name: role,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return {
      user: {
        id: user.user_id,
        email: user.email,
        name: user.full_name,
        role,
      },
      token,
    };
  },

  async signup(full_name, email, password, phone, role_name) {
    // 1. Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('user_id')
      .eq('email', email)
      .maybeSingle();

    if (existingUser) {
      const err = new Error('A user with this email address already exists.');
      err.status = 409;
      throw err;
    }

    // 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // 3. Create user entry
    const { data: user, error: userErr } = await supabase
      .from('users')
      .insert([{
        full_name: full_name.trim(),
        email: email.trim().toLowerCase(),
        password_hash,
        phone: phone ? phone.trim() : null,
        is_active: true
      }])
      .select()
      .single();

    if (userErr || !user) throw userErr || new Error('Failed to create user account.');

    // 4. Resolve role ID (default to FLEET_MANAGER)
    const activeRole = role_name || 'FLEET_MANAGER';
    const { data: roleData } = await supabase
      .from('roles')
      .select('role_id')
      .eq('role_name', activeRole)
      .single();

    const finalRoleId = roleData?.role_id || 2; // Default fallback to FLEET_MANAGER (id 2)

    // 5. Insert user role
    await supabase
      .from('user_roles')
      .insert([{
        user_id: user.user_id,
        role_id: finalRoleId
      }]);

    // 6. Generate JWT token
    const token = jwt.sign(
      {
        user_id: user.user_id,
        email: user.email,
        role_name: activeRole,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return {
      user: {
        id: user.user_id,
        email: user.email,
        name: user.full_name,
        role: activeRole,
      },
      token,
    };
  },

  async getUserById(userId) {
    const { data: user, error } = await supabase
      .from('users')
      .select('*, user_roles(roles(role_name))')
      .eq('user_id', userId)
      .single();

    if (error || !user) {
      const err = new Error('User not found');
      err.status = 404;
      throw err;
    }

    return {
      id: user.user_id,
      email: user.email,
      name: user.full_name,
      role: roleFromUser(user),
    };
  },
};