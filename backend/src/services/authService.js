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