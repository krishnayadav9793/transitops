import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from '../../store/authStore';
import { apiClient } from '../../services/apiClient';
import { toast } from 'react-hot-toast';

/* ─── Password strength meter ─── */
const PasswordStrength = ({ password }) => {
  const getStrength = (pw) => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^a-zA-Z0-9]/.test(pw)) score++;
    return score;
  };
  const score = getStrength(password);
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['', '#ba1a1a', '#f59e0b', '#2d9966', '#0f5238'];
  if (!password) return null;
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: 'flex', gap: 4 }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{
            flex: 1,
            height: 4,
            borderRadius: 99,
            background: i <= score ? colors[score] : '#e5e7eb',
            transition: 'background 0.3s',
          }} />
        ))}
      </div>
      <p style={{ fontSize: 11, color: colors[score], marginTop: 4, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
        {labels[score]}
      </p>
    </div>
  );
};

/* ─── Role option card ─── */
const RoleCard = ({ value, icon, title, description, selected, onChange }) => (
  <label
    htmlFor={`role-${value}`}
    style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12,
      padding: '12px 14px',
      borderRadius: 14,
      border: `2px solid ${selected ? '#0f5238' : '#e5e7eb'}`,
      background: selected ? 'rgba(15,82,56,0.06)' : 'rgba(255,255,255,0.6)',
      cursor: 'pointer',
      transition: 'all 0.2s',
      flex: '1 1 0',
      minWidth: 0,
    }}
  >
    <input
      id={`role-${value}`}
      type="radio"
      name="role"
      value={value}
      checked={selected}
      onChange={onChange}
      style={{ display: 'none' }}
    />
    <span
      className="material-symbols-outlined"
      style={{
        fontSize: 22,
        color: selected ? '#0f5238' : '#9ca3af',
        fontVariationSettings: "'FILL' 1",
        flexShrink: 0,
        marginTop: 1,
        transition: 'color 0.2s',
      }}
    >
      {icon}
    </span>
    <div>
      <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: selected ? '#0f5238' : '#374151', fontFamily: "'Sora', sans-serif" }}>{title}</p>
      <p style={{ margin: '2px 0 0', fontSize: 11, color: '#9ca3af', lineHeight: 1.4 }}>{description}</p>
    </div>
  </label>
);

export default function Signup() {
  const navigate = useNavigate();
  const loginAction = useAuthStore((s) => s.login);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1); // 1 = personal info, 2 = credentials

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    document.title = "Create Employee | TransitOps";
    requestAnimationFrame(() => setMounted(true));
    return () => { document.title = "TransitOps"; };
  }, []);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    const loadToast = toast.loading("Creating your corporate profile...");
    try {
      const payload = {
        full_name: form.fullName,
        email: form.email,
        password: form.password,
        phone: form.phone || null,
        role_name: form.role,
      };
      const data = await apiClient.post('/auth/signup', payload);
      loginAction(data.user, data.token);
      toast.success('Account created successfully! Logging you in...', { id: loadToast });
      setTimeout(() => {
        const dest = (data.user.role === 'Driver' || data.user.role === 'User') ? '/trips' : '/dashboard';
        navigate(dest, { replace: true });
      }, 1000);
    } catch (err) {
      toast.error(err.message || 'Failed to create user account.', { id: loadToast });
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { value: 'USER', icon: 'person', title: 'User', description: 'Request trips & track deliveries' },
    { value: 'VEHICLE_OWNER', icon: 'directions_car', title: 'Vehicle Owner', description: 'Register & manage fleet' },
    { value: 'DRIVER', icon: 'local_shipping', title: 'Driver', description: 'Accept & deliver trips' },
  ];

  // Progress dots
  const totalSteps = 2;

  return (
    <>
      <style>{`
        /* ── Signup page layout ── */
        .signup-page {
          display: flex;
          min-height: 100svh;
          width: 100%;
          background: #f8faf6;
          font-family: 'Inter', sans-serif;
        }

        /* ── Left panel ── */
        .signup-panel {
          display: none;
          position: relative;
          overflow: hidden;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          padding: 48px;
          background: linear-gradient(145deg, #0a3d26 0%, #0f5238 40%, #1a7a50 70%, #2d9966 100%);
        }
        @media (min-width: 1024px) {
          .signup-panel { display: flex; width: 50%; }
        }

        /* Blobs */
        .sp-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(70px);
          opacity: 0.20;
          animation: spBlob 10s ease-in-out infinite alternate;
        }
        .sp-blob-1 { width: 420px; height: 420px; background: #a8e7c5; top: -100px; right: -100px; animation-delay: 0s; }
        .sp-blob-2 { width: 300px; height: 300px; background: #fdb96c; bottom: -60px; left: -60px; animation-delay: -5s; }
        .sp-blob-3 { width: 200px; height: 200px; background: #95d4b3; top: 40%; left: 40%; animation-delay: -2.5s; }
        @keyframes spBlob {
          from { transform: scale(1); }
          to   { transform: scale(1.2) rotate(15deg); }
        }

        .sp-dot-grid {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(255,255,255,0.10) 1px, transparent 1px);
          background-size: 28px 28px;
        }

        /* Feature list */
        .sp-features {
          position: relative;
          z-index: 5;
          list-style: none;
          padding: 0;
          margin: 32px 0 0;
        }
        .sp-feature-item {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 20px;
          opacity: 0;
          transform: translateX(-20px);
          animation: slideInLeft 0.6s ease forwards;
        }
        .sp-feature-item:nth-child(1) { animation-delay: 0.1s; }
        .sp-feature-item:nth-child(2) { animation-delay: 0.25s; }
        .sp-feature-item:nth-child(3) { animation-delay: 0.4s; }
        .sp-feature-item:nth-child(4) { animation-delay: 0.55s; }
        @keyframes slideInLeft {
          to { opacity: 1; transform: translateX(0); }
        }
        .sp-feature-icon-wrap {
          width: 40px; height: 40px;
          background: rgba(255,255,255,0.14);
          border: 1px solid rgba(255,255,255,0.22);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .sp-feature-icon-wrap .material-symbols-outlined {
          font-size: 20px;
          color: #a8e7c5;
          font-variation-settings: 'FILL' 1;
        }
        .sp-feature-text p {
          margin: 0;
          font-size: 14px;
          color: #ffffff;
          font-weight: 600;
          font-family: 'Sora', sans-serif;
        }
        .sp-feature-text span {
          font-size: 12px;
          color: rgba(255,255,255,0.65);
        }

        .sp-brand {
          position: relative;
          z-index: 5;
        }
        .sp-badge {
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
          margin-bottom: 16px;
          font-family: 'Inter', sans-serif;
        }
        .sp-brand h2 {
          font-family: 'Sora', sans-serif;
          font-size: 42px;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.02em;
          margin: 0 0 10px;
          line-height: 1.1;
        }
        .sp-brand p {
          font-size: 15px;
          color: rgba(255,255,255,0.70);
          line-height: 1.6;
          max-width: 360px;
          margin: 0;
        }

        /* ── Right form section ── */
        .signup-form-section {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 32px 24px;
          background: #f8faf6;
          min-height: 100svh;
        }
        @media (min-width: 1024px) { .signup-form-section { width: 50%; } }

        /* Card */
        .signup-card {
          width: 100%;
          max-width: 480px;
          background: rgba(255,255,255,0.78);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.65);
          border-radius: 28px;
          padding: 40px 40px 32px;
          box-shadow: 0 20px 60px rgba(15,82,56,0.10), 0 4px 16px rgba(0,0,0,0.06);
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.55s ease, transform 0.55s ease;
        }
        .signup-card.mounted {
          opacity: 1;
          transform: translateY(0);
        }
        @media (max-width: 520px) {
          .signup-card { padding: 28px 18px 24px; border-radius: 20px; }
        }

        /* Logo */
        .su-logo {
          width: 56px; height: 56px;
          background: linear-gradient(135deg, #0f5238, #2d9966);
          border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 18px;
          box-shadow: 0 8px 24px rgba(15,82,56,0.28);
        }
        .su-logo .material-symbols-outlined {
          font-size: 28px; color: #fff;
          font-variation-settings: 'FILL' 1;
        }

        .su-title {
          font-family: 'Sora', sans-serif;
          font-size: 22px; font-weight: 700;
          color: #191c1a; text-align: center;
          margin: 0 0 4px; letter-spacing: -0.01em;
        }
        .su-subtitle {
          font-size: 13px; color: #6b7280;
          text-align: center; margin: 0 0 28px;
        }

        /* Steps progress */
        .steps-bar {
          display: flex;
          gap: 6px;
          margin-bottom: 28px;
        }
        .step-seg {
          flex: 1;
          height: 4px;
          border-radius: 99px;
          background: #e5e7eb;
          transition: background 0.35s;
        }
        .step-seg.active { background: #0f5238; }

        .steps-label {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          color: #9ca3af;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          font-weight: 600;
          margin-bottom: 20px;
        }
        .steps-label span.cur { color: #0f5238; }

        /* Field */
        .su-field-group { margin-bottom: 18px; }
        .su-field-label {
          display: block;
          font-size: 11px; font-weight: 600;
          letter-spacing: 0.06em; text-transform: uppercase;
          color: #404943; margin-bottom: 7px;
        }
        .su-field-wrap { position: relative; }
        .su-field-icon {
          position: absolute;
          left: 13px; top: 50%;
          transform: translateY(-50%);
          font-size: 19px; color: #9ca3af;
          pointer-events: none;
          transition: color 0.2s;
          font-variation-settings: 'FILL' 0;
        }
        .su-field-input {
          width: 100%;
          padding: 13px 14px 13px 42px;
          background: rgba(255,255,255,0.65);
          border: 1.5px solid #d1d5db;
          border-radius: 13px;
          font-size: 14px;
          color: #191c1a;
          font-family: 'Inter', sans-serif;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          outline: none;
          box-sizing: border-box;
        }
        .su-field-input::placeholder { color: #c4c9c5; }
        .su-field-input:focus {
          border-color: #0f5238;
          box-shadow: 0 0 0 3px rgba(15,82,56,0.10);
          background: #fff;
        }
        .su-field-wrap:focus-within .su-field-icon {
          color: #0f5238;
          font-variation-settings: 'FILL' 1;
        }
        .su-field-action {
          position: absolute; right: 12px; top: 50%;
          transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          color: #9ca3af; padding: 4px;
          display: flex; align-items: center;
          transition: color 0.2s;
        }
        .su-field-action:hover { color: #0f5238; }

        /* Role selector grid */
        .role-grid {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 20px;
        }

        /* Two column row */
        .su-two-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }
        @media (max-width: 400px) {
          .su-two-col { grid-template-columns: 1fr; }
        }

        /* Navigation buttons */
        .su-nav-row {
          display: flex;
          gap: 12px;
          margin-top: 8px;
        }
        .su-back-btn {
          flex: 0 0 auto;
          padding: 14px 20px;
          background: transparent;
          border: 1.5px solid #d1d5db;
          border-radius: 13px;
          font-size: 14px;
          font-weight: 600;
          color: #6b7280;
          cursor: pointer;
          display: flex; align-items: center; gap: 6px;
          transition: border-color 0.2s, color 0.2s;
          font-family: 'Inter', sans-serif;
        }
        .su-back-btn:hover { border-color: #0f5238; color: #0f5238; }

        /* Submit / next button */
        .su-submit-btn {
          flex: 1;
          padding: 14px;
          background: linear-gradient(135deg, #0f5238 0%, #2d9966 100%);
          color: #ffffff;
          border: none;
          border-radius: 13px;
          font-size: 15px;
          font-weight: 600;
          font-family: 'Sora', sans-serif;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 4px 18px rgba(15,82,56,0.30);
          transition: transform 0.15s, box-shadow 0.2s, opacity 0.2s;
          position: relative; overflow: hidden;
        }
        .su-submit-btn::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 100%);
        }
        .su-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 26px rgba(15,82,56,0.38);
        }
        .su-submit-btn:active:not(:disabled) { transform: scale(0.98); }
        .su-submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        .spinner {
          width: 18px; height: 18px;
          border: 2.5px solid rgba(255,255,255,0.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .su-login-prompt {
          text-align: center;
          font-size: 14px; color: #6b7280;
          margin-top: 20px;
        }
        .su-login-prompt a {
          color: #0f5238; font-weight: 700;
          text-decoration: none; margin-left: 4px;
          transition: opacity 0.2s;
        }
        .su-login-prompt a:hover { opacity: 0.75; }

        .su-trust-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 18px;
          margin-top: 20px;
          padding-top: 18px;
          border-top: 1px solid rgba(0,0,0,0.07);
        }
        .su-trust-badge {
          display: flex; align-items: center; gap: 5px;
          font-size: 10px;
          letter-spacing: 0.06em; text-transform: uppercase;
          color: #9ca3af; font-weight: 600;
          transition: color 0.2s;
        }
        .su-trust-badge .material-symbols-outlined { font-size: 14px; font-variation-settings: 'FILL' 1; }
        .su-trust-row:hover .su-trust-badge { color: #0f5238; }

        .su-copyright {
          text-align: center;
          font-size: 11px; color: #c4c9c5;
          margin-top: 14px; letter-spacing: 0.02em;
        }

        /* Slide animation between steps */
        .step-panel {
          animation: fadeSlide 0.35s ease;
        }
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>

      <main className="signup-page">
        {/* ── Left Decorative Panel ── */}
        <section className="signup-panel">
          <div className="sp-blob sp-blob-1" />
          <div className="sp-blob sp-blob-2" />
          <div className="sp-blob sp-blob-3" />
          <div className="sp-dot-grid" />

          <div className="sp-brand">
            <span className="sp-badge">
              <span className="material-symbols-outlined" style={{ fontSize: 12 }}>add_circle</span>
              New Account Registration
            </span>
            <h2>Join TransitOps</h2>
            <p>
              Register your account and gain access to the most powerful enterprise logistics platform in the industry.
            </p>
          </div>

          <ul className="sp-features">
            {[
              { icon: 'route', title: 'Smart Route Optimization', desc: 'AI-powered routing for maximum efficiency' },
              { icon: 'analytics', title: 'Real-time Analytics', desc: 'Live fleet dashboards and KPI tracking' },
              { icon: 'verified_user', title: 'Compliance & Safety', desc: 'Built-in regulatory compliance tools' },
              { icon: 'hub', title: 'Fleet Network', desc: 'Manage 1000s of vehicles seamlessly' },
            ].map(({ icon, title, desc }) => (
              <li className="sp-feature-item" key={title}>
                <div className="sp-feature-icon-wrap">
                  <span className="material-symbols-outlined">{icon}</span>
                </div>
                <div className="sp-feature-text">
                  <p>{title}</p>
                  <span>{desc}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Right Form Section ── */}
        <section className="signup-form-section">
          <div className={`signup-card${mounted ? ' mounted' : ''}`}>
            {/* Logo */}
            <div className="su-logo">
              <span className="material-symbols-outlined">person_add</span>
            </div>

            <h1 className="su-title">Create Employee Account</h1>
            <p className="su-subtitle">Register a new user in the TransitOps system</p>

            {/* Step progress */}
            <div className="steps-bar">
              {[1, 2].map(i => (
                <div key={i} className={`step-seg${step >= i ? ' active' : ''}`} />
              ))}
            </div>
            <div className="steps-label">
              <span className={step === 1 ? 'cur' : ''}>Step 1: Personal Info</span>
              <span className={step === 2 ? 'cur' : ''}>Step 2: Credentials</span>
            </div>

            <form onSubmit={handleSubmit}>
              {/* ── STEP 1: Personal info + role ── */}
              {step === 1 && (
                <div className="step-panel">
                  {/* Two col: Full name + Phone */}
                  <div className="su-two-col">
                    <div className="su-field-group">
                      <label className="su-field-label" htmlFor="fullName">Full Name</label>
                      <div className="su-field-wrap">
                        <span className="su-field-icon material-symbols-outlined">badge</span>
                        <input
                          className="su-field-input"
                          id="fullName"
                          name="fullName"
                          type="text"
                          placeholder="Johnathan Doe"
                          required
                          value={form.fullName}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="su-field-group">
                      <label className="su-field-label" htmlFor="phone">Phone</label>
                      <div className="su-field-wrap">
                        <span className="su-field-icon material-symbols-outlined">call</span>
                        <input
                          className="su-field-input"
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="+1 555 000"
                          required
                          value={form.phone}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="su-field-group">
                    <label className="su-field-label" htmlFor="email">Corporate Email</label>
                    <div className="su-field-wrap">
                      <span className="su-field-icon material-symbols-outlined">mail</span>
                      <input
                        className="su-field-input"
                        id="email"
                        name="email"
                        type="email"
                        placeholder="name@transitops.com"
                        required
                        value={form.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Role cards */}
                  <div className="su-field-group">
                    <label className="su-field-label">Account Type</label>
                    <div className="role-grid">
                      {roles.map(r => (
                        <RoleCard
                          key={r.value}
                          {...r}
                          selected={form.role === r.value}
                          onChange={handleChange}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="su-nav-row">
                    <button
                      type="button"
                      className="su-submit-btn"
                      id="signup-next-btn"
                      onClick={() => {
                        if (!form.fullName || !form.email || !form.role) {
                          toast.error('Please fill in all required fields');
                          return;
                        }
                        setStep(2);
                      }}
                    >
                      Continue
                      <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_forward</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ── STEP 2: Password ── */}
              {step === 2 && (
                <div className="step-panel">
                  {/* Password */}
                  <div className="su-field-group">
                    <label className="su-field-label" htmlFor="password">Password</label>
                    <div className="su-field-wrap">
                      <span className="su-field-icon material-symbols-outlined">lock</span>
                      <input
                        className="su-field-input"
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        required
                        value={form.password}
                        onChange={handleChange}
                        style={{ paddingRight: '44px' }}
                      />
                      <button
                        type="button"
                        className="su-field-action"
                        onClick={() => setShowPassword(v => !v)}
                        tabIndex={-1}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 19 }}>
                          {showPassword ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                    <PasswordStrength password={form.password} />
                  </div>

                  {/* Confirm Password */}
                  <div className="su-field-group">
                    <label className="su-field-label" htmlFor="confirmPassword">Confirm Password</label>
                    <div className="su-field-wrap">
                      <span className="su-field-icon material-symbols-outlined">lock_open</span>
                      <input
                        className="su-field-input"
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        required
                        value={form.confirmPassword}
                        onChange={handleChange}
                        style={{
                          paddingRight: '44px',
                          borderColor: form.confirmPassword && form.password !== form.confirmPassword ? '#ba1a1a' : undefined,
                        }}
                      />
                      <button
                        type="button"
                        className="su-field-action"
                        onClick={() => setShowConfirmPassword(v => !v)}
                        tabIndex={-1}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 19 }}>
                          {showConfirmPassword ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                    {form.confirmPassword && form.password !== form.confirmPassword && (
                      <p style={{ fontSize: 12, color: '#ba1a1a', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 14, fontVariationSettings: "'FILL' 1" }}>cancel</span>
                        Passwords do not match
                      </p>
                    )}
                    {form.confirmPassword && form.password === form.confirmPassword && (
                      <p style={{ fontSize: 12, color: '#0f5238', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 14, fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                        Passwords match
                      </p>
                    )}
                  </div>

                  {/* Summary chip */}
                  <div style={{
                    padding: '12px 16px',
                    background: 'rgba(15,82,56,0.06)',
                    border: '1px solid rgba(15,82,56,0.15)',
                    borderRadius: 12,
                    marginBottom: 20,
                    display: 'flex',
                    gap: 12,
                    alignItems: 'center',
                  }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#0f5238', fontVariationSettings: "'FILL' 1" }}>person</span>
                    <div>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#191c1a' }}>{form.fullName}</p>
                      <p style={{ margin: 0, fontSize: 12, color: '#6b7280' }}>{form.email} · {roles.find(r => r.value === form.role)?.title}</p>
                    </div>
                    <button type="button" onClick={() => setStep(1)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#0f5238', fontSize: 12, fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>
                      Edit
                    </button>
                  </div>

                  <div className="su-nav-row">
                    <button
                      type="button"
                      className="su-back-btn"
                      onClick={() => setStep(1)}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_back</span>
                      Back
                    </button>
                    <button
                      className="su-submit-btn"
                      type="submit"
                      disabled={loading}
                      id="signup-submit-btn"
                    >
                      {loading ? (
                        <><div className="spinner" /> Creating...</>
                      ) : (
                        <>
                          Create Account
                          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>how_to_reg</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>

            <p className="su-login-prompt">
              Already have an account?
              <Link to="/login">Sign In</Link>
            </p>

            {/* Trust badges */}
            <div className="su-trust-row">
              <div className="su-trust-badge">
                <span className="material-symbols-outlined">verified_user</span>
                ISO 27001
              </div>
              <div className="su-trust-badge">
                <span className="material-symbols-outlined">admin_panel_settings</span>
                MFA Enforced
              </div>
              <div className="su-trust-badge">
                <span className="material-symbols-outlined">lock</span>
                256-bit SSL
              </div>
            </div>

            <p className="su-copyright">© 2026 TransitOps Logistics SA. All rights reserved.</p>
          </div>
        </section>
      </main>
    </>
  );
}
