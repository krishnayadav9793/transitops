import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from '../../store/authStore';
import { apiClient } from '../../services/apiClient';
import { toast } from 'react-hot-toast';

export default function Signup() {
    const navigate = useNavigate();
    const loginAction = useAuthStore((s) => s.login);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phone: "",
        role: "",
        password: "",
        confirmPassword: "",
    });

    useEffect(() => {
        const title = document.title;
        document.title = "Create Employee | TransitOps";

        return () => {
            document.title = title;
        };
    }, []);

    const handleChange = (e) => {
        setForm(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
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

            // Auto login on successful signup
            loginAction(data.user, data.token);

            toast.success('Account created successfully! Logging you in...', { id: loadToast });
            
            setTimeout(() => {
                navigate('/dashboard', { replace: true });
            }, 1000);
        } catch (err) {
            toast.error(err.message || 'Failed to create user account.', { id: loadToast });
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            <main className="flex w-full min-h-screen">
                <section className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                    <div className="login-illustration w-full h-full transform transition-transform duration-1000 hover:scale-105" />
                    <div className="absolute inset-0 emerald-overlay flex flex-col justify-end p-2xl">
                        <div className="max-w-md">
                            <h2 className="font-display-lg text-display-lg text-primary mb-sm">TransitOps</h2>
                            <p className="font-body-lg text-body-lg text-on-surface-variant/80">
                                The next generation of enterprise logistics. Streamlined fleet management, real-time analytics, and optimized routing at scale.
                            </p>
                        </div>
                    </div>
                    <div className="absolute top-12 left-12 p-md bg-white/20 backdrop-blur-md rounded-xl border border-white/30">
                        <span className="material-symbols-outlined text-primary text-[32px]">local_shipping</span>
                    </div>
                    <div className="absolute top-48 right-12 p-md bg-white/20 backdrop-blur-md rounded-xl border border-white/30 animate-pulse">
                        <span className="material-symbols-outlined text-primary text-[32px]">analytics</span>
                    </div>
                </section>

                <section className="w-full lg:w-1/2 flex items-center justify-center p-gutter bg-surface">
                    <div className="glass-card w-full max-w-[480px] rounded-3xl p-xl flex flex-col items-center">
                        <div className="mb-xl text-center">
                            <div className="w-16 h-16 bg-primary-container rounded-2xl flex items-center justify-center mb-md mx-auto shadow-sm">
                                <span className="material-symbols-outlined text-white text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }}>person_add</span>
                            </div>
                            <h1 className="font-headline-md text-headline-md text-on-surface mb-xs">Create Employee</h1>
                            <p className="font-body-sm text-body-sm text-on-surface-variant">Register a new user in the TransitOps system</p>
                        </div>

                        <form className="w-full space-y-lg" onSubmit={handleSubmit}>
                            <div className="space-y-sm">
                                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase" htmlFor="fullName">Full Name</label>
                                <div className="relative group">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[20px] transition-colors group-focus-within:text-primary">badge</span>
                                    <input
                                        className="w-full pl-12 pr-4 py-4 bg-white/50 border border-outline-variant rounded-xl font-body-sm text-on-surface transition-all placeholder:text-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                                        id="fullName"
                                        name="fullName"
                                        placeholder="Johnathan Doe"
                                        required
                                        type="text"
                                        value={form.fullName}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-sm">
                                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase" htmlFor="email">Corporate Email</label>
                                <div className="relative group">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[20px] transition-colors group-focus-within:text-primary">mail</span>
                                    <input
                                        className="w-full pl-12 pr-4 py-4 bg-white/50 border border-outline-variant rounded-xl font-body-sm text-on-surface transition-all placeholder:text-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                                        id="email"
                                        name="email"
                                        placeholder="name@transitops.com"
                                        required
                                        type="email"
                                        value={form.email}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-sm">
                                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase" htmlFor="phone">Phone</label>
                                <div className="relative group">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[20px] transition-colors group-focus-within:text-primary">call</span>
                                    <input
                                        className="w-full pl-12 pr-4 py-4 bg-white/50 border border-outline-variant rounded-xl font-body-sm text-on-surface transition-all placeholder:text-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                                        id="phone"
                                        name="phone"
                                        placeholder="+1 (555) 000-0000"
                                        required
                                        type="tel"
                                        value={form.phone}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-sm">
                                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase" htmlFor="role">Role</label>
                                <div className="relative group">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[20px] transition-colors group-focus-within:text-primary">badge</span>
                                    <select
                                        className="w-full pl-12 pr-10 py-4 bg-white/50 border border-outline-variant rounded-xl font-body-sm text-on-surface transition-all focus:border-primary focus:ring-1 focus:ring-primary outline-none appearance-none cursor-pointer"
                                        id="role"
                                        name="role"
                                        required
                                        value={form.role}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select Account Type</option>
                                        <option value="USER">User (Request Trips)</option>
                                        <option value="VEHICLE_OWNER">Vehicle Owner (Register Fleet)</option>
                                        <option value="DRIVER">Driver (Accept & Deliver Trips)</option>
                                    </select>
                                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[20px]">expand_more</span>
                                </div>
                            </div>

                            <div className="space-y-sm">
                                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase" htmlFor="password">Password</label>
                                <div className="relative group">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[20px] transition-colors group-focus-within:text-primary">lock</span>
                                    <input
                                        className="w-full pl-12 pr-4 py-4 bg-white/50 border border-outline-variant rounded-xl font-body-sm text-on-surface transition-all placeholder:text-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                                        id="password"
                                        name="password"
                                        placeholder="••••••••"
                                        required
                                        type="password"
                                        value={form.password}
                                        onChange={handleChange}
                                    />
                                    <button className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors" type="button">
                                        <span className="material-symbols-outlined text-[20px]">visibility</span>
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-sm">
                                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase" htmlFor="confirmPassword">Confirm Password</label>
                                <div className="relative group">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[20px] transition-colors group-focus-within:text-primary">lock</span>
                                    <input
                                        className="w-full pl-12 pr-4 py-4 bg-white/50 border border-outline-variant rounded-xl font-body-sm text-on-surface transition-all placeholder:text-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        placeholder="••••••••"
                                        required
                                        type="password"
                                        value={form.confirmPassword}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <button
                                className="w-full bg-primary-container text-white font-headline-md py-4 rounded-xl flex items-center justify-center space-x-sm hover:bg-primary transition-all active:scale-[0.98] shadow-md hover:shadow-lg"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span>Creating...</span>
                                ) : (
                                    <>
                                        <span>Create Account</span>
                                        <span className="material-symbols-outlined text-[20px]">how_to_reg</span>
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-xl pt-xl border-t border-white/40 w-full">
                            <p className="font-body-sm text-body-sm text-on-surface-variant text-center">
                                Already have an account?{" "}
                                <Link to="/login" className="font-semibold text-primary hover:text-primary-container transition-colors">
                                    Sign In
                                </Link>
                            </p>
                        </div>

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

                        <div className="mt-lg">
                            <p className="font-label-caps text-label-caps text-on-surface-variant/40">
                                © <span className="font-data-mono">2026</span> TransitOps Logistics SA. All rights reserved.
                            </p>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}
