import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { apiClient } from '../../services/apiClient';
import { toast } from 'react-hot-toast';

/* ─── Animated stat card that floats on the left panel ─── */
const FloatCard = ({ icon, label, value, color, delay, top, left, right }) => (
  <div
    className="float-card"
    style={{
      top,
      left,
      right,
      animationDelay: delay,
    }}
  >
    <span
      className="float-card-icon material-symbols-outlined"
      style={{ color }}
    >
      {icon}
    </span>
    <div>
      <p className="float-card-value">{value}</p>
      <p className="float-card-label">{label}</p>
    </div>
  </div>
);

/* ─── Animated SVG route line ─── */
const RouteSVG = () => (
  <svg
    className="route-svg"
    viewBox="0 0 400 500"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Main route path */}
    <path
      d="M 80 80 Q 200 140 160 220 Q 120 300 240 340 Q 320 370 280 440"
      stroke="rgba(255,255,255,0.25)"
      strokeWidth="2"
      strokeDasharray="8 6"
      fill="none"
    />
    {/* Animated truck along the path */}
    <circle r="8" fill="#a8e7c5" opacity="0.9">
      <animateMotion
        dur="6s"
        repeatCount="indefinite"
        path="M 80 80 Q 200 140 160 220 Q 120 300 240 340 Q 320 370 280 440"
      />
    </circle>
    {/* Waypoint dots */}
    <circle cx="80" cy="80" r="5" fill="rgba(255,255,255,0.4)" />
    <circle cx="160" cy="220" r="5" fill="rgba(255,255,255,0.4)" />
    <circle cx="240" cy="340" r="5" fill="rgba(255,255,255,0.4)" />
    <circle cx="280" cy="440" r="5" fill="rgba(255,255,255,0.4)" />
  </svg>
);

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const emailRef = useRef(null);

  useEffect(() => {
    document.title = 'Login | TransitOps Enterprise Logistics';
    const remembered = localStorage.getItem('remembered_email');
    if (remembered) setEmail(remembered);
    // Trigger entrance animation
    requestAnimationFrame(() => setMounted(true));
    return () => { document.title = 'TransitOps'; };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const loadToast = toast.loading('Signing into TransitOps portal...');

    try {
      const data = await apiClient.post('/auth/login', { email, password });
      login(data.user, data.token);
      if (remember) {
        localStorage.setItem('remembered_email', email);
      } else {
        localStorage.removeItem('remembered_email');
      }
      toast.success('Successfully logged in!', { id: loadToast });
      setTimeout(() => {
        const dest = (data.user.role === 'Driver' || data.user.role === 'User') ? '/trips' : '/dashboard';
        navigate(dest, { replace: true });
      }, 500);
    } catch (err) {
      setError(err.message || 'Invalid email or password');
      toast.error(err.message || 'Invalid email or password', { id: loadToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        /* ── Page layout ── */
        .auth-page {
          display: flex;
          min-height: 100svh;
          width: 100%;
          background: #f8faf6;
          font-family: 'Inter', sans-serif;
        }

        /* ── Left decorative panel ── */
        .auth-panel {
          display: none;
          position: relative;
          overflow: hidden;
          flex-direction: column;
          justify-content: flex-end;
          padding: 48px;
          background: linear-gradient(145deg, #0a3d26 0%, #0f5238 40%, #1a7a50 70%, #2d9966 100%);
        }
        @media (min-width: 1024px) {
          .auth-panel { display: flex; width: 50%; }
        }

        /* Animated blobs */
        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          opacity: 0.25;
          animation: blobPulse 8s ease-in-out infinite alternate;
        }
        .blob-1 {
          width: 380px; height: 380px;
          background: #a8e7c5;
          top: -80px; left: -80px;
          animation-delay: 0s;
        }
        .blob-2 {
          width: 300px; height: 300px;
          background: #fdb96c;
          top: 30%; right: -60px;
          animation-delay: -3s;
        }
        .blob-3 {
          width: 250px; height: 250px;
          background: #95d4b3;
          bottom: 60px; left: 30%;
          animation-delay: -6s;
        }
        @keyframes blobPulse {
          from { transform: scale(1) translate(0, 0); }
          to   { transform: scale(1.15) translate(20px, -20px); }
        }

        /* Grid dots pattern */
        .dot-grid {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(255,255,255,0.12) 1px, transparent 1px);
          background-size: 28px 28px;
        }

        /* Route SVG overlay */
        .route-svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          opacity: 0.6;
        }

        /* Floating stat cards */
        .float-card {
          position: absolute;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          background: rgba(255,255,255,0.12);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.22);
          border-radius: 16px;
          animation: floatY 5s ease-in-out infinite alternate;
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
          min-width: 160px;
        }
        .float-card-icon {
          font-size: 28px;
          font-variation-settings: 'FILL' 1;
        }
        .float-card-value {
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: #ffffff;
          margin: 0;
          line-height: 1;
        }
        .float-card-label {
          font-size: 11px;
          color: rgba(255,255,255,0.7);
          margin: 2px 0 0;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        @keyframes floatY {
          from { transform: translateY(0px); }
          to   { transform: translateY(-12px); }
        }

        /* Panel branding text */
        .panel-brand h2 {
          font-family: 'Sora', sans-serif;
          font-size: 42px;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.02em;
          margin: 0 0 12px;
          line-height: 1.1;
        }
        .panel-brand p {
          font-size: 15px;
          color: rgba(255,255,255,0.72);
          line-height: 1.6;
          max-width: 360px;
          margin: 0;
        }
        .panel-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.25);
          border-radius: 999px;
          font-size: 11px;
          color: rgba(255,255,255,0.85);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 20px;
          font-family: 'Inter', sans-serif;
        }

        /* ── Right form section ── */
        .auth-form-section {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 32px 24px;
          background: #f8faf6;
          min-height: 100svh;
        }
        @media (min-width: 1024px) {
          .auth-form-section { width: 50%; }
        }

        /* Glass card */
        .auth-card {
          width: 100%;
          max-width: 460px;
          background: rgba(255,255,255,0.75);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.6);
          border-radius: 28px;
          padding: 40px 40px 32px;
          box-shadow: 0 20px 60px rgba(15,82,56,0.10), 0 4px 16px rgba(0,0,0,0.06);
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.55s ease, transform 0.55s ease;
        }
        .auth-card.mounted {
          opacity: 1;
          transform: translateY(0);
        }
        @media (max-width: 480px) {
          .auth-card { padding: 28px 20px 24px; border-radius: 20px; }
        }

        /* Logo icon */
        .auth-logo {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #0f5238, #2d9966);
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          box-shadow: 0 8px 24px rgba(15,82,56,0.30);
        }
        .auth-logo .material-symbols-outlined {
          font-size: 30px;
          color: #ffffff;
          font-variation-settings: 'FILL' 1;
        }

        .auth-title {
          font-family: 'Sora', sans-serif;
          font-size: 24px;
          font-weight: 700;
          color: #191c1a;
          text-align: center;
          margin: 0 0 6px;
          letter-spacing: -0.01em;
        }
        .auth-subtitle {
          font-size: 14px;
          color: #6b7280;
          text-align: center;
          margin: 0 0 32px;
        }

        /* Form fields */
        .field-group { margin-bottom: 20px; }
        .field-label {
          display: block;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #404943;
          margin-bottom: 8px;
        }
        .field-wrap {
          position: relative;
        }
        .field-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 20px;
          color: #9ca3af;
          pointer-events: none;
          transition: color 0.2s;
          font-variation-settings: 'FILL' 0;
        }
        .field-input {
          width: 100%;
          padding: 14px 16px 14px 44px;
          background: rgba(255,255,255,0.65);
          border: 1.5px solid #d1d5db;
          border-radius: 14px;
          font-size: 14px;
          color: #191c1a;
          font-family: 'Inter', sans-serif;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          outline: none;
          box-sizing: border-box;
        }
        .field-input::placeholder { color: #c4c9c5; }
        .field-input:focus {
          border-color: #0f5238;
          box-shadow: 0 0 0 4px rgba(15,82,56,0.10);
          background: #ffffff;
        }
        .field-wrap:focus-within .field-icon {
          color: #0f5238;
          font-variation-settings: 'FILL' 1;
        }
        .field-action {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #9ca3af;
          padding: 4px;
          display: flex;
          align-items: center;
          transition: color 0.2s;
        }
        .field-action:hover { color: #0f5238; }

        /* Field row for password label + forgot link */
        .field-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        .forgot-link {
          font-size: 12px;
          color: #0f5238;
          text-decoration: none;
          font-weight: 600;
          transition: opacity 0.2s;
        }
        .forgot-link:hover { opacity: 0.75; }

        /* Remember me */
        .remember-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 24px;
        }
        .remember-checkbox {
          width: 16px;
          height: 16px;
          accent-color: #0f5238;
          cursor: pointer;
        }
        .remember-label {
          font-size: 13px;
          color: #6b7280;
          cursor: pointer;
          user-select: none;
        }

        /* Error box */
        .error-box {
          background: rgba(186,26,26,0.08);
          border: 1px solid rgba(186,26,26,0.2);
          border-radius: 12px;
          padding: 12px 16px;
          font-size: 13px;
          color: #93000a;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* Submit button */
        .submit-btn {
          width: 100%;
          padding: 15px;
          background: linear-gradient(135deg, #0f5238 0%, #2d9966 100%);
          color: #ffffff;
          border: none;
          border-radius: 14px;
          font-size: 15px;
          font-weight: 600;
          font-family: 'Sora', sans-serif;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 4px 20px rgba(15,82,56,0.35);
          transition: transform 0.15s, box-shadow 0.2s, opacity 0.2s;
          position: relative;
          overflow: hidden;
        }
        .submit-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 100%);
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(15,82,56,0.40);
        }
        .submit-btn:active:not(:disabled) { transform: scale(0.98); }
        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        /* Spinner */
        .spinner {
          width: 18px;
          height: 18px;
          border: 2.5px solid rgba(255,255,255,0.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Divider */
        .auth-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 28px 0;
        }
        .auth-divider::before, .auth-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(0,0,0,0.08);
        }
        .auth-divider span {
          font-size: 12px;
          color: #9ca3af;
        }

        /* Sign-up link */
        .signup-prompt {
          text-align: center;
          font-size: 14px;
          color: #6b7280;
          margin-top: 8px;
        }
        .signup-prompt a {
          color: #0f5238;
          font-weight: 700;
          text-decoration: none;
          margin-left: 4px;
          transition: opacity 0.2s;
        }
        .signup-prompt a:hover { opacity: 0.75; }

        /* Trust badges */
        .trust-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          margin-top: 24px;
          padding-top: 20px;
          border-top: 1px solid rgba(0,0,0,0.07);
        }
        .trust-badge {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 10px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #9ca3af;
          font-weight: 600;
          transition: color 0.2s;
        }
        .trust-badge .material-symbols-outlined {
          font-size: 15px;
          font-variation-settings: 'FILL' 1;
        }
        .trust-row:hover .trust-badge { color: #0f5238; }

        /* Copyright */
        .auth-copyright {
          text-align: center;
          font-size: 11px;
          color: #c4c9c5;
          margin-top: 16px;
          letter-spacing: 0.02em;
        }
      `}</style>

      <main className="auth-page">
        {/* ── Left Decorative Panel ── */}
        <section className="auth-panel">
          {/* Animated background blobs */}
          <div className="blob blob-1" />
          <div className="blob blob-2" />
          <div className="blob blob-3" />

          {/* Dot grid pattern */}
          <div className="dot-grid" />

          {/* Animated SVG route */}
          <RouteSVG />

          {/* Floating stat cards */}
          <FloatCard
            icon="local_shipping"
            label="Active Fleet"
            value="1,248"
            color="#a8e7c5"
            delay="0s"
            top="12%"
            left="8%"
          />
          <FloatCard
            icon="analytics"
            label="On-Time Rate"
            value="97.4%"
            color="#fdb96c"
            delay="-2s"
            top="30%"
            right="6%"
          />
          <FloatCard
            icon="route"
            label="Routes Active"
            value="342"
            color="#95d4b3"
            delay="-4s"
            top="55%"
            left="10%"
          />

          {/* Bottom branding */}
          <div className="panel-brand" style={{ position: 'relative', zIndex: 10 }}>
            <span className="panel-badge">
              <span className="material-symbols-outlined" style={{ fontSize: 12 }}>verified</span>
              Enterprise Logistics Platform
            </span>
            <h2>TransitOps</h2>
            <p>
              The next generation of enterprise logistics. Streamlined fleet management, real-time analytics, and optimized routing at scale.
            </p>
          </div>
        </section>

        {/* ── Right Form Section ── */}
        <section className="auth-form-section">
          <div className={`auth-card${mounted ? ' mounted' : ''}`}>
            {/* Logo */}
            <div className="auth-logo">
              <span className="material-symbols-outlined">local_shipping</span>
            </div>

            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">Access your TransitOps Logistics Portal</p>

            {/* Error */}
            {error && (
              <div className="error-box">
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>error</span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div className="field-group">
                <label className="field-label" htmlFor="email">Corporate Email</label>
                <div className="field-wrap">
                  <span className="field-icon material-symbols-outlined">mail</span>
                  <input
                    className="field-input"
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@transitops.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="field-group">
                <div className="field-row">
                  <label className="field-label" style={{ marginBottom: 0 }} htmlFor="password">Password</label>
                  <a className="forgot-link" href="#">Forgot Password?</a>
                </div>
                <div className="field-wrap">
                  <span className="field-icon material-symbols-outlined">lock</span>
                  <input
                    className="field-input"
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ paddingRight: '44px' }}
                  />
                  <button
                    type="button"
                    className="field-action"
                    onClick={() => setShowPassword(v => !v)}
                    tabIndex={-1}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <div className="remember-row">
                <input
                  className="remember-checkbox"
                  id="remember"
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <label className="remember-label" htmlFor="remember">Stay logged in for 30 days</label>
              </div>

              {/* Submit */}
              <button className="submit-btn" type="submit" disabled={loading} id="login-submit-btn">
                {loading ? (
                  <>
                    <div className="spinner" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Login to Dashboard
                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_forward</span>
                  </>
                )}
              </button>
            </form>

            {/* Sign up link */}
            <p className="signup-prompt">
              Don't have an account?
              <Link to="/signup">Sign up now</Link>
            </p>

            {/* Trust badges */}
            <div className="trust-row">
              <div className="trust-badge">
                <span className="material-symbols-outlined">verified_user</span>
                ISO 27001 Secure
              </div>
              <div className="trust-badge">
                <span className="material-symbols-outlined">admin_panel_settings</span>
                MFA Enforced
              </div>
              <div className="trust-badge">
                <span className="material-symbols-outlined">lock</span>
                256-bit SSL
              </div>
            </div>

            <p className="auth-copyright">© 2026 TransitOps Logistics SA. All rights reserved.</p>
          </div>
        </section>
      </main>
    </>
  );
};

export default Login;
