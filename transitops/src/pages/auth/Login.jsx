import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { apiClient } from '../../services/apiClient';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  useEffect(() => {
    const originalTitle = document.title;
    document.title = 'Login | TransitOps Enterprise Logistics';
    document.body.classList.add('min-h-screen', 'flex', 'overflow-hidden');
    return () => {
      document.title = originalTitle;
      document.body.classList.remove('min-h-screen', 'flex', 'overflow-hidden');
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await apiClient.post('/auth/login', { email, password });

      login(data.user, data.token);

      if (remember) {
        localStorage.setItem('remembered_email', email);
      } else {
        localStorage.removeItem('remembered_email');
      }

      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Split Layout Container */}
      <main className="flex w-full min-h-screen">
        {/* Left Side: Feature Illustration */}
        <section className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          <div className="login-illustration w-full h-full transform transition-transform duration-1000 hover:scale-105" />
          {/* Subtle Branding Overlay */}
          <div className="absolute inset-0 emerald-overlay flex flex-col justify-end p-2xl">
            <div className="max-w-md">
              <h2 className="font-display-lg text-display-lg text-primary mb-sm">TransitOps</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant/80">
                The next generation of enterprise logistics. Streamlined fleet management, real-time analytics, and optimized routing at scale.
              </p>
            </div>
          </div>
          {/* Floating Decorative Elements (Micro-interactions) */}
          <div className="absolute top-12 left-12 p-md bg-white/20 backdrop-blur-md rounded-xl border border-white/30">
            <span className="material-symbols-outlined text-primary text-[32px]">local_shipping</span>
          </div>
          <div className="absolute top-48 right-12 p-md bg-white/20 backdrop-blur-md rounded-xl border border-white/30 animate-pulse">
            <span className="material-symbols-outlined text-primary text-[32px]">analytics</span>
          </div>
        </section>

        {/* Right Side: Login Form */}
        <section className="w-full lg:w-1/2 flex items-center justify-center p-gutter bg-surface">
          {/* Glassmorphism Card */}
          <div className="glass-card w-full max-w-[480px] rounded-3xl p-xl flex flex-col items-center">
            {/* Logo & Heading */}
            <div className="mb-xl text-center">
              <div className="w-16 h-16 bg-primary-container rounded-2xl flex items-center justify-center mb-md mx-auto shadow-sm">
                <span className="material-symbols-outlined text-white text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }}>dataset</span>
              </div>
              <h1 className="font-headline-md text-headline-md text-on-surface mb-xs">Welcome Back</h1>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Access your TransitOps Logistics Portal</p>
            </div>

            {/* Form */}
            <form className="w-full space-y-lg" onSubmit={handleSubmit}>
              {error && (
                <div className="rounded-xl bg-error-container/30 px-md py-sm font-body-sm text-on-error-container">
                  {error}
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-sm">
                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase" htmlFor="email">Corporate Email</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[20px] transition-colors group-focus-within:text-primary">mail</span>
                  <input
                    className="w-full pl-12 pr-4 py-4 bg-white/50 border border-outline-variant rounded-xl font-body-sm text-on-surface transition-all placeholder:text-outline-variant"
                    id="email"
                    name="email"
                    placeholder="name@transitops.com"
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={(e) => {
                      const icon = e.target.parentElement.querySelector('.material-symbols-outlined');
                      if (icon) icon.style.transform = 'translateY(-50%) scale(1.1)';
                    }}
                    onBlur={(e) => {
                      const icon = e.target.parentElement.querySelector('.material-symbols-outlined');
                      if (icon) icon.style.transform = 'translateY(-50%) scale(1)';
                    }}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-sm">
                <div className="flex justify-between items-center">
                  <label className="font-label-caps text-label-caps text-on-surface-variant uppercase" htmlFor="password">Password</label>
                  <a className="font-label-caps text-label-caps text-primary hover:text-primary-container transition-colors" href="#">Forgot Password?</a>
                </div>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[20px] transition-colors group-focus-within:text-primary">lock</span>
                  <input
                    className="w-full pl-12 pr-4 py-4 bg-white/50 border border-outline-variant rounded-xl font-body-sm text-on-surface transition-all placeholder:text-outline-variant"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    required
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={(e) => {
                      const icon = e.target.parentElement.querySelector('.material-symbols-outlined');
                      if (icon) icon.style.transform = 'translateY(-50%) scale(1.1)';
                    }}
                    onBlur={(e) => {
                      const icon = e.target.parentElement.querySelector('.material-symbols-outlined');
                      if (icon) icon.style.transform = 'translateY(-50%) scale(1)';
                    }}
                  />
                  <button className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors" type="button">
                    <span className="material-symbols-outlined text-[20px]">visibility</span>
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center space-x-sm">
                <input
                  className="w-4 h-4 text-primary bg-white border-outline-variant rounded focus:ring-primary/20"
                  id="remember"
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <label className="font-body-sm text-body-sm text-on-surface-variant select-none cursor-pointer" htmlFor="remember">Stay logged in for 30 days</label>
              </div>

              {/* Submit Button */}
              <button
                className="w-full bg-primary-container text-white font-headline-md py-4 rounded-xl flex items-center justify-center space-x-sm hover:bg-primary transition-all active:scale-[0.98] shadow-md hover:shadow-lg"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <span>Signing in...</span>
                ) : (
                  <>
                    <span>Login to Dashboard</span>
                    <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                  </>
                )}
              </button>
            </form>

            {/* Additional Security Info */}
            <div className="mt-xl pt-xl border-t border-white/40 w-full">
              <div className="flex items-center justify-center space-x-md opacity-60 grayscale hover:grayscale-0 transition-all">
                <div className="flex items-center space-x-xs">
                  <span className="material-symbols-outlined text-[16px]">verified_user</span>
                  <span className="font-label-caps text-[10px]">ISO 27001 SECURE</span>
                </div>
                <div className="flex items-center space-x-xs">
                  <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
                  <span className="font-label-caps text-[10px]">MFA ENFORCED</span>
                </div>
              </div>
            </div>

            {/* Footer Copyright */}
            <div className="mt-lg">
              <p className="font-label-caps text-label-caps text-on-surface-variant/40">
                © <span className="font-data-mono">2026</span> TransitOps Logistics SA. All rights reserved.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Micro-interaction Scripts */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
        // Simple ripple-like effect on button click (visual flourish)
        const btn = document.querySelector('button[type="submit"]');
        btn.addEventListener('click', (e) => {
            console.log('Login attempt initiated...');
        });

        // Add focus state management for inputs to animate icons
        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.querySelector('.material-symbols-outlined').style.transform = 'translateY(-50%) scale(1.1)';
            });
            input.addEventListener('blur', () => {
                input.parentElement.querySelector('.material-symbols-outlined').style.transform = 'translateY(-50%) scale(1)';
            });
        });
          `
        }}
      />
    </>
  );
};

export default Login;
