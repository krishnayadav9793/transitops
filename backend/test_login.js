import { authService } from './src/services/authService.js';
import { getDashboardStats } from './src/controllers/dashboardController.js';

async function test() {
  try {
    const email = `driver${Date.now()}@test.com`;
    const signupRes = await authService.signup('Test Driver', email, 'password123', '1234567890', 'DRIVER');
    const token = signupRes.token;

    console.log('Testing dashboard stats with driver token...');
    // We mock req and res to test the controller
    const req = {
      user: {
        user_id: signupRes.user.id,
        email: email,
        role_name: 'Driver'
      }
    };

    const res = {
      status: function(code) {
        this.statusCode = code;
        return this;
      },
      json: function(data) {
        console.log('Dashboard stats returned:', this.statusCode);
      }
    };

    const next = (err) => {
      console.error('Dashboard stats error:', err);
    };

    await getDashboardStats(req, res, next);
    
  } catch (err) {
    console.error('Test failed:', err);
  }
}

test();
