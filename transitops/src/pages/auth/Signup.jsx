import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { apiClient } from '../../services/apiClient';

export const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    roleName: 'Fleet Manager',
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  useEffect(() => {
    const originalTitle = document.title;
    document.title = 'Create Account | TransitOps Enterprise Logistics';
    document.body.classList.add('min-h-screen', 'flex', 'overflow-hidden');
    return () => {
      document.title = originalTitle;
      document.body.classList.remove('min-h-screen', 'flex', 'overflow-hidden');
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        full_name: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || null,
        role_name: formData.roleName,
      };

      const data = await apiClient.post('/auth/signup', payload);

      // Auto login on successful signup
      login(data.user, data.token);

      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Failed to create user account.');
    } finally {
      setLoading(false);
    }
  };

  const labelClass = 'font-label-caps text-label-caps text-on-surface-variant uppercase block mb-1';
  const inputClass = 'w-full pl-12 pr-4 py-3 bg-white/50 border border-outline-variant rounded-xl font-body-sm text-on-surface transition-all placeholder:text-outline-variant outline-none focus:border-primary';
  const selectClass = 'w-full px-4 py-3 bg-white/50 border border-outline-variant rounded-xl font-body-sm text-on-surface transition-all outline-none focus:border-primary cursor-pointer';

  return (
    <>
      <main className="flex w-full min-h-screen">
        {/* Left Side: Branding Panel */}
        <section className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          <div className="login-illustration w-full h-full transform transition-transform duration-1000 hover:scale-105" />
          <div className="absolute inset-0 emerald-overlay flex flex-col justify-end p-2xl">
            <div className="max-w-md">
              <h2 className="font-display-lg text-display-lg text-primary mb-sm">TransitOps</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant/80">
                Join the network. Get access to state-of-the-art telemetry tracking, scheduling, and logistics tools.
              </p>
            </div>
          </div>
          <div className="absolute top-12 left-12 p-md bg-white/20 backdrop-blur-md rounded-xl border border-white/30">
            <span className="material-symbols-outlined text-primary text-[32px]">assignment_ind</span>
          </div>
        </section>

        {/* Right Side: Signup Form */}
        <section className="w-full lg:w-1/2 flex items-center justify-center p-gutter bg-surface overflow-y-auto">
          <div className="glass-card w-full max-w-[480px] rounded-3xl p-xl flex flex-col items-center my-8">
            
            {/* Heading */}
            <div className="mb-lg text-center">
              <div className="w-14 h-14 bg-primary-container rounded-2xl flex items-center justify-center mb-md mx-auto shadow-sm">
                <span className="material-symbols-outlined text-white text-[32px]">person_add</span>
              </div>
              <h1 className="font-headline-md text-headline-md text-on-surface mb-xs">Create Corporate Account</h1>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Register to start managing your fleet operations</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="w-full space-y-md">
              {error && (
                <div className="rounded-xl bg-error-container/30 px-md py-sm font-body-sm text-on-error-container text-center">
                  {error}
                </div>
              )}

              {/* Full Name */}
              <div className="space-y-xs">
                <label className={labelClass} htmlFor="fullName">Full Name</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[20px]">badge</span>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="e.g. Alexander Pierce"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-xs">
                <label className={labelClass} htmlFor="email">Corporate Email</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[20px]">mail</span>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@transitops.com"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-xs">
                <label className={labelClass} htmlFor="password">Password</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[20px]">lock</span>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Phone (Optional) */}
              <div className="space-y-xs">
                <label className={labelClass} htmlFor="phone">Phone Number (Optional)</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[20px]">call</span>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+1 (555) 019-2834"
                    value={formData.phone}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div className="space-y-xs">
                <label className={labelClass} htmlFor="roleName">Select Departmental Role</label>
                <select
                  id="roleName"
                  name="roleName"
                  value={formData.roleName}
                  onChange={handleChange}
                  className={selectClass}
                >
                  <option value="Fleet Manager">Fleet Manager (Full Admin Controls)</option>
                  <option value="Dispatcher">Dispatcher (Trips and Schedules)</option>
                  <option value="Safety Officer">Safety Officer (Driver Audits & Status)</option>
                  <option value="Financial Analyst">Financial Analyst (Ledgers & Refills)</option>
                  <option value="Admin">System Administrator</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-container text-white font-headline-md py-4 rounded-xl flex items-center justify-center space-x-sm hover:bg-primary transition-all active:scale-[0.98] shadow-md hover:shadow-lg mt-lg cursor-pointer"
              >
                {loading ? (
                  <span>Registering Account...</span>
                ) : (
                  <>
                    <span>Create Free Account</span>
                    <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-md text-center">
              <span className="font-body-sm text-body-sm text-on-surface-variant mr-xs">Already have an account?</span>
              <Link to="/login" className="font-body-sm text-body-sm text-primary font-bold hover:underline transition-all">Log in here</Link>
            </div>

            {/* Footer */}
            <div className="mt-lg border-t border-white/40 pt-md w-full text-center">
              <p className="font-label-caps text-label-caps text-on-surface-variant/40">
                © <span className="font-data-mono">2026</span> TransitOps Logistics SA. All rights reserved.
              </p>
            </div>

          </div>
        </section>
      </main>
    </>
  );
};

export default Signup;
