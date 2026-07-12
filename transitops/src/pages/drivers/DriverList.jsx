import React, { useState, useMemo } from 'react';
import './driverDashboard.css';

// Rich Mock Telemetry Data Matching Screen Designs Exactly
const INITIAL_DRIVERS = [
  {
    id: 1,
    name: 'Elena Rodriguez',
    employeeId: 'TO-77492',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    driverId: 'TR-8842',
    status: 'ON TRIP', // 'ACTIVE', 'OFF DUTY', 'SUSPENDED'
    assignedVehicle: 'Volvo FH Electric',
    vehiclePlate: 'TX-992-K',
    licenseExpiry: '2025-10-24',
    safetyScore: 98,
    efficiency: 92,
    email: 'e.rodriguez@transitops.com',
    phone: '+1 (555) 342-9012',
    location: 'Chicago, IL Hub',
    hireDate: 'Oct 12, 2019',
    contractType: 'Full-Time',
    dob: 'Aug 24, 1982',
    emergencyContact: 'Sarah Sterling',
    internalNotes: 'Consistently receives high feedback for efficiency and vehicle maintenance. Recommended for senior trainer role next quarter.',
    certs: [
      { name: "Commercial Driver's License (CDL)", type: 'Class A', number: '#IL92834710', expiry: '2026-12-01', status: 'valid' },
      { name: "Medical Examiner's Certificate", type: 'DOT Compliance', number: 'Current', expiry: '2024-01-15', status: 'expired' },
      { name: "Hazmat Endorsement", type: 'Specialty Transport', number: 'Current', expiry: '2025-05-18', status: 'valid' },
      { name: "Eco-Driving Certification", type: 'Sustainability Module', number: 'Current', expiry: '2026-07-01', status: 'expiring' }
    ],
    vehicleHistory: [
      { model: 'Freightliner Cascadia 2023', unit: 'ECO-442', plate: 'TRK-990', dateRange: 'Jan 2023 - Present', current: true },
      { model: 'Volvo VNL 860', unit: 'HV-102', plate: 'RRT-112', dateRange: 'June 2020 - Dec 2022', current: false },
      { model: 'Kenworth T680', unit: 'STD-08', plate: 'MKL-445', dateRange: 'Oct 2019 - May 2020', current: false }
    ],
    recentTrips: [
      { id: 'TR-9021', route: 'Chicago Hub ➔ Detroit DC', details: 'Interstate 94 Corridor', date: 'Oct 24, 2023', fuel: '7.8 MPG', status: 'COMPLETED' },
      { id: 'TR-8994', route: 'Chicago Hub ➔ Milwaukee', details: 'Short Haul Logistics', date: 'Oct 22, 2023', fuel: '7.2 MPG', status: 'COMPLETED' },
      { id: 'TR-8950', route: 'St. Louis ➔ Chicago Hub', details: 'Regional Return', date: 'Oct 20, 2023', fuel: '7.4 MPG', status: 'COMPLETED' },
      { id: 'TR-8812', route: 'Chicago Hub ➔ Indianapolis', details: 'Express Freight', date: 'Oct 18, 2023', fuel: '6.1 MPG', status: 'REVIEW' }
    ]
  },
  {
    id: 2,
    name: 'David Miller',
    employeeId: 'TO-12844',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200',
    driverId: 'TR-9104',
    status: 'OFF DUTY',
    assignedVehicle: 'Not Assigned',
    vehiclePlate: 'N/A',
    licenseExpiry: '2024-08-12',
    safetyScore: 84,
    efficiency: 78,
    email: 'd.miller@transitops.com',
    phone: '+1 (555) 901-2345',
    location: 'Chicago, IL Hub',
    hireDate: 'May 15, 2021',
    contractType: 'Full-Time',
    dob: 'Nov 12, 1988',
    emergencyContact: 'Ann Miller',
    internalNotes: 'Dependable driver with good communication. Needs a refresher on city navigation speed compliance.',
    certs: [
      { name: "Commercial Driver's License (CDL)", type: 'Class B', number: '#IL4431980', expiry: '2024-08-12', status: 'expired' },
      { name: "Medical Examiner's Certificate", type: 'DOT Compliance', number: 'Current', expiry: '2025-06-15', status: 'valid' }
    ],
    vehicleHistory: [
      { model: 'Volvo VNL 860', unit: 'HV-102', plate: 'RRT-112', dateRange: 'May 2021 - Present', current: true }
    ],
    recentTrips: [
      { id: 'TR-7721', route: 'Chicago Hub ➔ Columbus', details: 'Interstate 70 East', date: 'Aug 10, 2024', fuel: '6.8 MPG', status: 'COMPLETED' }
    ]
  },
  {
    id: 3,
    name: 'Suki Tanaka',
    employeeId: 'TO-88912',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    driverId: 'TR-7721',
    status: 'ACTIVE',
    assignedVehicle: 'Scania R450',
    vehiclePlate: 'KY-110-M',
    licenseExpiry: '2026-01-30',
    safetyScore: 96,
    efficiency: 95,
    email: 's.tanaka@transitops.com',
    phone: '+1 (555) 890-1234',
    location: 'Seattle, WA Hub',
    hireDate: 'Jan 10, 2020',
    contractType: 'Full-Time',
    dob: 'Mar 05, 1990',
    emergencyContact: 'Kenji Tanaka',
    internalNotes: 'Excellent record in extreme weather conditions. High safety compliance score.',
    certs: [
      { name: "Commercial Driver's License (CDL)", type: 'Class A', number: '#WA9871134', expiry: '2026-01-30', status: 'valid' },
      { name: "Medical Examiner's Certificate", type: 'DOT Compliance', number: 'Current', expiry: '2025-12-15', status: 'valid' }
    ],
    vehicleHistory: [
      { model: 'Scania R450', unit: 'SCA-909', plate: 'KY-110-M', dateRange: 'Jan 2020 - Present', current: true }
    ],
    recentTrips: [
      { id: 'TR-8121', route: 'Seattle Hub ➔ Portland', details: 'I-5 Corridor Short Haul', date: 'Jan 28, 2026', fuel: '8.1 MPG', status: 'COMPLETED' }
    ]
  },
  {
    id: 4,
    name: 'Jordan Smyth',
    employeeId: 'TO-00449',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    driverId: 'TR-0051',
    status: 'SUSPENDED',
    assignedVehicle: 'Grounded',
    vehiclePlate: 'N/A',
    licenseExpiry: '2024-12-05',
    safetyScore: 42,
    efficiency: 15,
    email: 'j.smyth@transitops.com',
    phone: '+1 (555) 789-0123',
    location: 'Miami, FL Hub',
    hireDate: 'Nov 01, 2022',
    contractType: 'Contract',
    dob: 'Sep 10, 1995',
    emergencyContact: 'Robert Smyth',
    internalNotes: 'Under safety review. Multiple speeding triggers logged in the visual telemetry reports.',
    certs: [
      { name: "Commercial Driver's License (CDL)", type: 'Class A', number: '#FL112098', expiry: '2024-12-05', status: 'expired' },
      { name: "Medical Examiner's Certificate", type: 'DOT Compliance', number: 'Current', expiry: '2023-11-30', status: 'expired' }
    ],
    vehicleHistory: [
      { model: 'Kenworth T680', unit: 'STD-08', plate: 'MKL-445', dateRange: 'Nov 2022 - Dec 2024', current: false }
    ],
    recentTrips: [
      { id: 'TR-5512', route: 'Miami Hub ➔ Orlando', details: 'Florida Turnpike Route', date: 'Dec 01, 2024', fuel: '5.5 MPG', status: 'REVIEW' }
    ]
  }
];

export const DriverList = () => {
  const [drivers, setDrivers] = useState(INITIAL_DRIVERS);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');

  // License alert check helper
  const isLicenseExpired = (expiryStr) => {
    return new Date(expiryStr) < new Date();
  };

  // KPI Calculations
  const stats = useMemo(() => {
    const total = drivers.length;
    const active = drivers.filter(d => d.status === 'ON TRIP' || d.status === 'ACTIVE').length;
    const suspended = drivers.filter(d => d.status === 'SUSPENDED').length;
    
    const expiredLicenseCount = drivers.filter(d => isLicenseExpired(d.licenseExpiry)).length;
    
    const safetyAvg = parseFloat((drivers.reduce((acc, curr) => acc + curr.safetyScore, 0) / total).toFixed(1));
    const utilizationRate = Math.round((active / total) * 100);

    return {
      total,
      active,
      suspended,
      expiredLicenseCount,
      safetyAvg,
      utilizationRate
    };
  }, [drivers]);

  // Tab Filtering & Search Filtering
  const filteredDrivers = useMemo(() => {
    return drivers.filter(driver => {
      const matchesSearch = 
        driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver.driverId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver.assignedVehicle.toLowerCase().includes(searchQuery.toLowerCase());

      if (activeTab === 'ALL') return matchesSearch;
      if (activeTab === 'AVAILABLE') return matchesSearch && (driver.status === 'ACTIVE' || driver.status === 'Available');
      if (activeTab === 'SUSPENDED') return matchesSearch && driver.status === 'SUSPENDED';
      if (activeTab === 'EXPIRED') return matchesSearch && isLicenseExpired(driver.licenseExpiry);

      return matchesSearch;
    });
  }, [drivers, activeTab, searchQuery]);

  // Action methods
  const toggleSuspendStatus = (id) => {
    setDrivers(prev => prev.map(d => {
      if (d.id === id) {
        const nextStatus = d.status === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED';
        const nextScore = d.status === 'SUSPENDED' ? 85 : 42; // Mock safety reset
        const updated = { ...d, status: nextStatus, safetyScore: nextScore };
        // If we are currently viewing this driver, update the active select
        if (selectedDriver && selectedDriver.id === id) {
          setSelectedDriver(updated);
        }
        return updated;
      }
      return d;
    }));
  };

  const getScoreClass = (score) => {
    if (score >= 90) return 'high';
    if (score >= 70) return 'mid';
    return 'low';
  };

  return (
    <div className="driver-dashboard-container">
      {selectedDriver ? (
        /* ======================================================== */
        /* SINGLE DRIVER PROFILE DETAIL VIEW (IMAGE 2)              */
        /* ======================================================== */
        <div className="profile-view-wrapper">
          <button onClick={() => setSelectedDriver(null)} className="back-btn-row">
            ← Back to Fleet
          </button>

          {/* Profile Main Card */}
          <div className="profile-card-section">
            <div className="profile-avatar-details">
              <img
                src={selectedDriver.avatar}
                alt={selectedDriver.name}
                className="profile-avatar-large"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <div>
                <div className="profile-identity-title">
                  <h2>{selectedDriver.name}</h2>
                  <span className={`status-badge ${selectedDriver.status.toLowerCase().replace(' ', '-')}`}>
                    {selectedDriver.status}
                  </span>
                </div>
                <div className="profile-contact-details">
                  <span className="profile-contact-item">✉ {selectedDriver.email}</span>
                  <span className="profile-contact-item">☎ {selectedDriver.phone}</span>
                  <span className="profile-contact-item">📍 {selectedDriver.location}</span>
                </div>
              </div>
            </div>
            
            <div className="profile-action-buttons">
              <button className="action-btn-secondary">📝 Edit Profile</button>
              <button 
                onClick={() => toggleSuspendStatus(selectedDriver.id)} 
                className="profile-suspend-btn"
                style={{ backgroundColor: selectedDriver.status === 'SUSPENDED' ? '#10b981' : '#b91c1c' }}
              >
                {selectedDriver.status === 'SUSPENDED' ? '✓ Reactivate Account' : '🚫 Suspend Access'}
              </button>
            </div>
          </div>

          {/* Telemetry Metrics cards */}
          <div className="telemetry-grid">
            <div className="telemetry-card green-accent">
              <div className="telemetry-title">Safety Score</div>
              <div className="telemetry-value" style={{ color: selectedDriver.safetyScore > 85 ? '#0b4c35' : '#b91c1c' }}>
                {selectedDriver.safetyScore}
              </div>
              <div className="telemetry-sub" style={{ color: '#10b981' }}>📈 +2.1% improvement</div>
            </div>

            <div className="telemetry-card gold-accent">
              <div className="telemetry-title">Total Trips</div>
              <div className="telemetry-value">1,248</div>
              <div className="telemetry-sub">Lifetime deliveries logged</div>
            </div>

            <div className="telemetry-card green-accent">
              <div className="telemetry-title">Performance Rating</div>
              <div className="telemetry-value">4.9</div>
              <div className="rating-stars">★★★★★</div>
            </div>

            <div className="telemetry-card red-accent">
              <div className="telemetry-title">Safety Violations</div>
              <div className="telemetry-value" style={{ color: selectedDriver.status === 'SUSPENDED' ? '#b91c1c' : '#111827' }}>
                {selectedDriver.status === 'SUSPENDED' ? '2' : '0'}
              </div>
              <div className="telemetry-sub">Last 6 Months records</div>
            </div>
          </div>

          {/* Grid Split split-details */}
          <div className="profile-details-split-grid">
            {/* Left Col Info */}
            <div className="profile-info-card">
              <div className="profile-card-header">
                <h3>Personal Info</h3>
                <span>•••</span>
              </div>
              <table className="info-details-table">
                <tbody>
                  <tr>
                    <td className="label-col">Employee ID</td>
                    <td className="value-col">{selectedDriver.employeeId}</td>
                  </tr>
                  <tr>
                    <td className="label-col">Hire Date</td>
                    <td className="value-col">{selectedDriver.hireDate}</td>
                  </tr>
                  <tr>
                    <td className="label-col">Contract Type</td>
                    <td className="value-col">{selectedDriver.contractType}</td>
                  </tr>
                  <tr>
                    <td className="label-col">Date of Birth</td>
                    <td className="value-col">{selectedDriver.dob}</td>
                  </tr>
                  <tr>
                    <td className="label-col">Emergency Contact</td>
                    <td className="value-col">{selectedDriver.emergencyContact}</td>
                  </tr>
                </tbody>
              </table>

              <div className="internal-notes-box">
                <h4>Internal Notes</h4>
                <p>"{selectedDriver.internalNotes}"</p>
              </div>
            </div>

            {/* Right Col Licenses */}
            <div className="profile-info-card">
              <div className="profile-card-header">
                <h3>License & Certifications</h3>
                <span style={{ color: '#0b4c35', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer' }}>+ Add New</span>
              </div>

              <div className="certifications-container">
                {selectedDriver.certs.map((c, idx) => {
                  const isExp = isLicenseExpired(c.expiry);
                  return (
                    <div className="cert-badge-box" key={idx}>
                      <div className={`cert-icon-wrapper ${isExp ? 'expired' : ''}`}>
                        {isExp ? '📜' : '🎖️'}
                      </div>
                      <div className="cert-badge-details">
                        <div className="cert-title-txt">{c.name}</div>
                        <div className="cert-desc-txt">{c.type} • {c.number}</div>
                        <div className={`cert-expiry-txt ${isExp ? 'expired' : c.status === 'expiring' ? 'expiring' : 'valid'}`}>
                          {isExp ? `Expired: ${c.expiry}` : `Expires: ${c.expiry}`}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom components grid */}
          <div className="profile-details-split-grid">
            {/* Vehicle History */}
            <div className="profile-info-card">
              <div className="profile-card-header">
                <h3>Vehicle History</h3>
                <span style={{ color: '#6b7280', fontSize: '0.875rem', cursor: 'pointer' }}>View All Logs</span>
              </div>
              <div className="vehicle-history-timeline">
                {selectedDriver.vehicleHistory.map((h, idx) => (
                  <div className="timeline-item" key={idx}>
                    <div className={`timeline-dot ${h.current ? 'active' : ''}`}></div>
                    <div className="timeline-content">
                      <div className="timeline-vehicle-title">
                        {h.model}
                        {h.current && <span className="status-badge active" style={{ fontSize: '0.5rem', padding: '1px 4px' }}>Current</span>}
                      </div>
                      <div className="timeline-vehicle-sub">Unit: {h.unit} • Plate: {h.plate}</div>
                      <div className="timeline-date-range">{h.dateRange}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Trips Table */}
            <div className="profile-info-card">
              <div className="profile-card-header">
                <h3>Recent Trips</h3>
                <span style={{ color: '#6b7280', fontSize: '0.875rem', cursor: 'pointer' }}>View All Logs</span>
              </div>
              <div className="table-responsive">
                <table className="recent-trips-table">
                  <thead>
                    <tr>
                      <th>Trip ID</th>
                      <th>Route</th>
                      <th>Date</th>
                      <th>Fuel Efficiency</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedDriver.recentTrips.map((t, idx) => (
                      <tr key={idx}>
                        <td className="trip-id-text">{t.id}</td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{t.route}</div>
                          <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{t.details}</div>
                        </td>
                        <td>{t.date}</td>
                        <td style={{ fontWeight: 600 }}>{t.fuel}</td>
                        <td>
                          <span className={`trip-status-badge ${t.status.toLowerCase()}`}>
                            {t.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ======================================================== */
        /* DRIVER MANAGEMENT LIST VIEW (IMAGE 1)                    */
        /* ======================================================== */
        <div className="list-view-wrapper">
          {/* Header Row */}
          <div className="dashboard-header-row">
            <div className="header-title-section">
              <h1>Driver Management</h1>
              <p>Monitor status, compliance and telemetry data of fleet operators.</p>
            </div>
            
            <div className="actions-buttons-wrapper">
              <button className="action-btn-secondary">⚙️ Advanced Filters</button>
              <button className="action-btn-primary">＋ Add Driver</button>
            </div>
          </div>

          {/* Search & Tabs Row */}
          <div className="search-filters-bar">
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search drivers, license IDs, or vehicles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input-field"
              />
            </div>

            <div className="filter-tabs-wrapper">
              <button 
                onClick={() => setActiveTab('ALL')} 
                className={`filter-tab-btn ${activeTab === 'ALL' ? 'active' : ''}`}
              >
                All Drivers
              </button>
              <button 
                onClick={() => setActiveTab('AVAILABLE')} 
                className={`filter-tab-btn ${activeTab === 'AVAILABLE' ? 'active' : ''}`}
              >
                Available
              </button>
              <button 
                onClick={() => setActiveTab('SUSPENDED')} 
                className={`filter-tab-btn ${activeTab === 'SUSPENDED' ? 'active' : ''}`}
              >
                Suspended
              </button>
              <button 
                onClick={() => setActiveTab('EXPIRED')} 
                className={`filter-tab-btn expired-tab ${activeTab === 'EXPIRED' ? 'active' : ''}`}
              >
                Expired
              </button>
            </div>
          </div>

          {/* KPI Dashboard Cards Grid */}
          <div className="kpi-cards-grid">
            <div className="kpi-card">
              <div className="kpi-card-title">Total Fleet Strength</div>
              <div className="kpi-card-value">1,284</div>
              <div className="kpi-card-subtext positive">↗ +4.2% from last month</div>
            </div>

            <div className="kpi-card">
              <div className="kpi-card-title">Active Now</div>
              <div className="kpi-card-value">{stats.utilizationRate > 0 ? stats.active * 230 + 42 : 942}</div>
              <div className="kpi-card-subtext">● 73% Utilization</div>
            </div>

            <div className="kpi-card">
              <div className="kpi-card-title">Safety Avg.</div>
              <div className="kpi-card-value">{stats.safetyAvg}</div>
              <div className="kpi-card-subtext positive">✓ Top Tier Rating</div>
            </div>

            <div className="kpi-card">
              <div className="kpi-card-title">Action Required</div>
              <div className="kpi-card-value" style={{ color: '#ef4444' }}>{stats.expiredLicenseCount}</div>
              <div className="kpi-card-subtext warning-action">⚠️ Licenses Expired</div>
            </div>
          </div>

          {/* Main Table Card */}
          <div className="drivers-table-card">
            <div className="table-responsive">
              <table className="drivers-data-table">
                <thead>
                  <tr>
                    <th>Driver Name</th>
                    <th>Status</th>
                    <th>Assigned Vehicle</th>
                    <th>License Expiry</th>
                    <th>Safety Score</th>
                    <th>Performance</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDrivers.map(d => {
                    const expired = isLicenseExpired(d.licenseExpiry);
                    const scoreType = getScoreClass(d.safetyScore);
                    
                    return (
                      <tr key={d.id}>
                        {/* Driver profile avatar cell */}
                        <td>
                          <div onClick={() => setSelectedDriver(d)} className="driver-name-cell">
                            <img src={d.avatar} alt={d.name} className="driver-avatar-circle" />
                            <div>
                              <div className="driver-fullname">{d.name}</div>
                              <div className="driver-id-sub">ID: {d.driverId}</div>
                            </div>
                          </div>
                        </td>

                        {/* Status Badge cell */}
                        <td>
                          <span className={`status-badge ${d.status.toLowerCase().replace(' ', '-')}`}>
                            {d.status}
                          </span>
                        </td>

                        {/* Assigned Vehicle cell */}
                        <td>
                          <div className="vehicle-cell-title">{d.assignedVehicle}</div>
                          {d.vehiclePlate !== 'N/A' && (
                            <div className="vehicle-cell-plate">Plate: {d.vehiclePlate}</div>
                          )}
                        </td>

                        {/* License Expiry cell */}
                        <td>
                          {expired ? (
                            <span className="expiry-alert-text">
                              ⚠️ {new Date(d.licenseExpiry).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                            </span>
                          ) : (
                            <span>
                              {new Date(d.licenseExpiry).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                            </span>
                          )}
                        </td>

                        {/* Safety Score meter cell */}
                        <td>
                          <div className="safety-score-row">
                            <span className={`safety-score-value ${scoreType}`}>
                              {d.safetyScore}
                            </span>
                            <div className="safety-progress-bar">
                              <div 
                                className={`safety-progress-fill ${scoreType}`} 
                                style={{ width: `${d.safetyScore}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>

                        {/* Performance sparkline cell */}
                        <td>
                          <div className="performance-cell">
                            <div className="performance-header">
                              <span>Efficiency</span>
                              <span style={{ fontWeight: 700 }}>{d.efficiency}%</span>
                            </div>
                            <div className="performance-sparkline-bg">
                              <div className="performance-sparkline-fill" style={{ width: `${d.efficiency}%` }}></div>
                            </div>
                          </div>
                        </td>

                        {/* Actions menu list cell */}
                        <td>
                          <button onClick={() => setSelectedDriver(d)} className="action-btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>
                            View Details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredDrivers.length === 0 && (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>
                        No drivers matching filters found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Highlight Banners */}
          <div className="bottom-banners-grid">
            <div className="optimization-banner">
              <div className="optimization-banner-text">
                <h3>Automated Fleet Optimization</h3>
                <p>Our AI has identified 14 more efficient route pairings for your available drivers. Implementing these could reduce carbon emissions by 12% this week.</p>
              </div>
              <button className="optimization-btn">Run Optimization</button>
            </div>

            <div className="sustainability-banner">
              <span className="sustainability-label">Sustainability Goal</span>
              <div className="sustainability-value">88% EV Fleet</div>
              <div className="sustainability-progress-bg">
                <div className="sustainability-progress-fill"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverList;
