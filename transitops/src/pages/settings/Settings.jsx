import React, { useState } from 'react';

export const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [firstName, setFirstName] = useState('Marcus');
  const [lastName, setLastName] = useState('Sterling');
  const [email, setEmail] = useState('m.sterling@transitops.io');
  const [phone, setPhone] = useState('+1 (555) 012-3456');
  const [timezone, setTimezone] = useState('New York (GMT-5)');

  return (
    <div className="space-y-lg">
      {/* Page Header */}
      <div>
        <h2 className="font-headline-lg text-headline-lg text-on-surface">System Settings</h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant mt-xs">Manage your personal preferences, team access, and organizational parameters.</p>
      </div>

      {/* Tabs */}
      <nav className="flex gap-xl border-b border-outline-variant">
        {[
          { id: 'profile', icon: 'person_outline', label: 'Profile' },
          { id: 'notifications', icon: 'notifications_active', label: 'Notifications' },
          { id: 'roles', icon: 'admin_panel_settings', label: 'Roles & Permissions' },
          { id: 'appearance', icon: 'palette', label: 'Appearance' },
          { id: 'password', icon: 'lock_open', label: 'Password' },
          { id: 'system', icon: 'settings_input_component', label: 'System Preferences' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-md px-base transition-colors flex items-center gap-sm ${
              activeTab === tab.id
                ? 'text-primary font-bold border-b-2 border-primary'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
            <span className="font-body-md">{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Settings Content */}
      <div className="grid grid-cols-12 gap-xl">
        {/* Left Column */}
        <div className="col-span-12 lg:col-span-8 space-y-xl">
          <section className="bg-surface-container-lowest rounded-xl p-xl shadow-sm border border-outline-variant/30">
            <div className="flex items-center justify-between mb-xl">
              <div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">Personal Information</h3>
                <p className="font-body-sm text-on-surface-variant">Update your photo and personal details.</p>
              </div>
              <button className="bg-primary-container text-on-primary-container px-lg py-sm rounded-lg font-body-md font-semibold hover:brightness-110 transition-all flex items-center gap-sm shadow-sm">
                <span className="material-symbols-outlined text-[18px]">save</span>
                Save Changes
              </button>
            </div>
            <div className="grid grid-cols-2 gap-xl">
              <div className="col-span-2 flex items-center gap-xl mb-md">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full bg-surface-container flex items-center justify-center border-2 border-primary-fixed shadow-md overflow-hidden">
                    <span className="material-symbols-outlined text-4xl text-on-surface-variant">person</span>
                  </div>
                  <button className="absolute bottom-0 right-0 bg-white shadow-md border border-outline-variant p-xs rounded-full hover:bg-surface-container-low transition-colors">
                    <span className="material-symbols-outlined text-primary text-sm">edit</span>
                  </button>
                </div>
                <div>
                  <h4 className="font-body-md font-semibold text-on-surface">Profile Picture</h4>
                  <p className="font-body-sm text-on-surface-variant mb-sm">PNG, JPG or GIF. Max 2MB.</p>
                  <div className="flex gap-sm">
                    <button className="px-md py-xs border border-outline-variant rounded-md font-body-sm hover:bg-surface-container-low transition-colors">Upload New</button>
                    <button className="px-md py-xs text-error font-body-sm hover:bg-error-container/20 rounded-md transition-colors">Remove</button>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-xs">
                <label className="font-body-sm font-semibold text-on-surface-variant">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="rounded-lg border-outline-variant bg-surface-container-low px-md py-sm focus:border-primary focus:ring-primary font-body-md text-on-surface"
                />
              </div>
              <div className="flex flex-col gap-xs">
                <label className="font-body-sm font-semibold text-on-surface-variant">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="rounded-lg border-outline-variant bg-surface-container-low px-md py-sm focus:border-primary focus:ring-primary font-body-md text-on-surface"
                />
              </div>
              <div className="col-span-2 flex flex-col gap-xs">
                <label className="font-body-sm font-semibold text-on-surface-variant">Email Address</label>
                <div className="relative">
                  <span className="absolute left-md top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-[18px]">mail</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-3xl rounded-lg border-outline-variant bg-surface-container-low px-md py-sm focus:border-primary focus:ring-primary font-body-md text-on-surface"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-xs">
                <label className="font-body-sm font-semibold text-on-surface-variant">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="rounded-lg border-outline-variant bg-surface-container-low px-md py-sm focus:border-primary focus:ring-primary font-body-md text-on-surface"
                />
              </div>
              <div className="flex flex-col gap-xs">
                <label className="font-body-sm font-semibold text-on-surface-variant">Location / Timezone</label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="rounded-lg border-outline-variant bg-surface-container-low px-md py-sm focus:border-primary focus:ring-primary font-body-md text-on-surface"
                >
                  <option>New York (GMT-5)</option>
                  <option>London (GMT+0)</option>
                  <option>Tokyo (GMT+9)</option>
                </select>
              </div>
            </div>
          </section>

          {/* Role Overview */}
          <section className="bg-surface-container-lowest rounded-xl p-xl shadow-sm border border-outline-variant/30">
            <div className="flex items-center justify-between mb-xl">
              <div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">Role Overview</h3>
                <p className="font-body-sm text-on-surface-variant">Assigned roles and their associated system permissions.</p>
              </div>
              <a className="text-primary font-body-sm font-semibold hover:underline" href="#">View Permissions Matrix</a>
            </div>
            <div className="overflow-hidden border border-outline-variant rounded-lg">
              <table className="w-full text-left border-collapse">
                <thead className="bg-surface-container-low font-label-caps text-label-caps text-on-surface-variant">
                  <tr>
                    <th className="px-md py-sm">MODULE</th>
                    <th className="px-md py-sm">ACCESS LEVEL</th>
                    <th className="px-md py-sm">STATUS</th>
                    <th className="px-md py-sm text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {[
                    { module: 'Fleet Management', level: 'Administrative', status: 'Active' },
                    { module: 'Financial Reports', level: 'View Only', status: 'Active' },
                    { module: 'HR & Driver Logs', level: 'Full Edit', status: 'Active' },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-surface-bright transition-colors group">
                      <td className="px-md py-md font-body-md font-medium text-on-surface">{row.module}</td>
                      <td className="px-md py-md">
                        <span className="font-body-sm text-on-surface">{row.level}</span>
                      </td>
                      <td className="px-md py-md">
                        <span className="inline-flex items-center px-sm py-xs rounded-full text-[11px] font-bold bg-primary-fixed text-on-primary-fixed-variant uppercase">{row.status}</span>
                      </td>
                      <td className="px-md py-md text-right">
                        <button className="text-on-surface-variant hover:text-primary"><span className="material-symbols-outlined">more_vert</span></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="col-span-12 lg:col-span-4 space-y-xl">
          {/* Appearance Card */}
          <section className="bg-surface-container-lowest rounded-xl p-xl shadow-sm border border-outline-variant/30">
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-md">Appearance</h3>
            <div className="space-y-lg">
              <div>
                <p className="font-body-sm font-semibold text-on-surface-variant mb-sm uppercase tracking-wider">Theme Mode</p>
                <div className="grid grid-cols-3 gap-sm">
                  <button className="flex flex-col items-center gap-sm p-sm rounded-lg border-2 border-primary bg-primary-fixed/10 transition-all">
                    <div className="w-full aspect-video bg-white rounded border border-outline-variant p-xs flex flex-col gap-xs">
                      <div className="h-1 w-full bg-primary-fixed rounded"></div>
                      <div className="h-3 w-3/4 bg-surface-container rounded"></div>
                    </div>
                    <span className="font-body-sm font-medium">Light</span>
                  </button>
                  <button className="flex flex-col items-center gap-sm p-sm rounded-lg border border-outline-variant hover:bg-surface-container-low transition-all">
                    <div className="w-full aspect-video bg-inverse-surface rounded border border-outline-variant p-xs flex flex-col gap-xs">
                      <div className="h-1 w-full bg-primary-container rounded"></div>
                      <div className="h-3 w-3/4 bg-surface-variant/20 rounded"></div>
                    </div>
                    <span className="font-body-sm font-medium">Dark</span>
                  </button>
                  <button className="flex flex-col items-center gap-sm p-sm rounded-lg border border-outline-variant hover:bg-surface-container-low transition-all">
                    <div className="w-full aspect-video bg-gradient-to-br from-white to-inverse-surface rounded border border-outline-variant flex items-center justify-center">
                      <span className="material-symbols-outlined text-[14px]">brightness_auto</span>
                    </div>
                    <span className="font-body-sm font-medium">System</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Security Alert Card */}
          <section className="bg-primary-container text-on-primary-container rounded-xl p-xl shadow-lg relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex items-center gap-md mb-md">
                <div className="p-sm bg-white/20 rounded-lg">
                  <span className="material-symbols-outlined text-white">verified_user</span>
                </div>
                <h4 className="font-body-md font-bold text-white">Security Checklist</h4>
              </div>
              <p className="font-body-sm text-primary-fixed mb-xl">Your account security is currently at 85%. Enable Two-Factor Authentication to reach 100%.</p>
              <button className="w-full bg-white text-primary-container py-sm rounded-lg font-body-md font-bold hover:bg-primary-fixed transition-colors">Complete Setup</button>
            </div>
            <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <span className="material-symbols-outlined text-[160px] text-white">security</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Settings;