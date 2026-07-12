import React, { useState } from 'react';

export const DriverFormModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    employeeId: '',
    email: '',
    phone: '',
    address: '',
    licenseNumber: '',
    licenseClass: 'Class A (CDL)',
    licenseExpiry: '',
    hireDate: '',
    region: 'Northeast Logistics Hub',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/40 backdrop-blur-sm p-lg">
      <div className="bg-surface-container-lowest w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-xl py-lg border-b border-outline-variant flex justify-between items-center">
          <div className="flex items-center gap-md">
            <div className="bg-primary-container p-sm rounded-lg text-on-primary-container">
              <span className="material-symbols-outlined">person_add</span>
            </div>
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface">Register New Driver</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Add a new driver to the TransitOps fleet.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-on-surface-variant hover:bg-surface-container-high p-sm rounded-full transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
            <div className="lg:col-span-8 space-y-2xl">
              <section>
                <div className="flex items-center gap-md mb-lg border-b border-surface-container-low pb-sm">
                  <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">1</span>
                  <h4 className="font-headline-sm text-headline-sm">Basic Information</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                  <div className="space-y-sm">
                    <label className="font-label-caps text-label-caps text-on-surface-variant block">FULL NAME</label>
                    <input name="fullName" value={formData.fullName} onChange={handleChange} className="w-full border-outline-variant rounded-lg p-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary transition-all" placeholder="e.g. Jonathan Harker" type="text" />
                  </div>
                  <div className="space-y-sm">
                    <label className="font-label-caps text-label-caps text-on-surface-variant block">EMPLOYEE ID (OPTIONAL)</label>
                    <input name="employeeId" value={formData.employeeId} onChange={handleChange} className="w-full border-outline-variant rounded-lg p-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary transition-all" placeholder="TX-9920" type="text" />
                  </div>
                  <div className="space-y-sm">
                    <label className="font-label-caps text-label-caps text-on-surface-variant block">EMAIL ADDRESS</label>
                    <input name="email" value={formData.email} onChange={handleChange} className="w-full border-outline-variant rounded-lg p-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary transition-all" placeholder="j.harker@transitops.com" type="email" />
                  </div>
                  <div className="space-y-sm">
                    <label className="font-label-caps text-label-caps text-on-surface-variant block">PHONE NUMBER</label>
                    <input name="phone" value={formData.phone} onChange={handleChange} className="w-full border-outline-variant rounded-lg p-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary transition-all" placeholder="+1 (555) 000-0000" type="tel" />
                  </div>
                  <div className="md:col-span-2 space-y-sm">
                    <label className="font-label-caps text-label-caps text-on-surface-variant block">RESIDENTIAL ADDRESS</label>
                    <textarea name="address" value={formData.address} onChange={handleChange} className="w-full border-outline-variant rounded-lg p-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none" placeholder="Street address, City, State, ZIP code" rows="2" />
                  </div>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-md mb-lg border-b border-surface-container-low pb-sm">
                  <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">2</span>
                  <h4 className="font-headline-sm text-headline-sm">License & Certifications</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
                  <div className="space-y-sm">
                    <label className="font-label-caps text-label-caps text-on-surface-variant block">LICENSE NUMBER</label>
                    <input name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} className="w-full border-outline-variant rounded-lg p-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary transition-all" placeholder="D-8829-331" type="text" />
                  </div>
                  <div className="space-y-sm">
                    <label className="font-label-caps text-label-caps text-on-surface-variant block">LICENSE CLASS</label>
                    <select name="licenseClass" value={formData.licenseClass} onChange={handleChange} className="w-full border-outline-variant rounded-lg p-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-surface-container-lowest appearance-none">
                      <option>Class A (CDL)</option>
                      <option>Class B (CDL)</option>
                      <option>Class C (Standard)</option>
                      <option>Specialist/Heavy</option>
                    </select>
                  </div>
                  <div className="space-y-sm">
                    <label className="font-label-caps text-label-caps text-on-surface-variant block">EXPIRY DATE</label>
                    <input name="licenseExpiry" value={formData.licenseExpiry} onChange={handleChange} className="w-full border-outline-variant rounded-lg p-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary transition-all" type="date" />
                  </div>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-md mb-lg border-b border-surface-container-low pb-sm">
                  <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">3</span>
                  <h4 className="font-headline-sm text-headline-sm">Employment Data</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                  <div className="space-y-sm">
                    <label className="font-label-caps text-label-caps text-on-surface-variant block">HIRE DATE</label>
                    <input name="hireDate" value={formData.hireDate} onChange={handleChange} className="w-full border-outline-variant rounded-lg p-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary transition-all" type="date" />
                  </div>
                  <div className="space-y-sm">
                    <label className="font-label-caps text-label-caps text-on-surface-variant block">ASSIGNED REGION</label>
                    <select name="region" value={formData.region} onChange={handleChange} className="w-full border-outline-variant rounded-lg p-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-surface-container-lowest appearance-none">
                      <option>Northeast Logistics Hub</option>
                      <option>Southwest Distribution</option>
                      <option>Pacific Coast Corridor</option>
                      <option>Central Plains Route</option>
                    </select>
                  </div>
                </div>
              </section>
            </div>

            <div className="lg:col-span-4 space-y-xl">
              <div className="bg-surface-container-lowest rounded-xl p-lg border border-surface-container text-center">
                <h5 className="font-label-caps text-label-caps text-on-surface-variant mb-lg uppercase">Profile Photo</h5>
                <div className="w-32 h-32 mx-auto rounded-full bg-surface-container-high flex flex-col items-center justify-center border-2 border-dashed border-outline-variant group cursor-pointer hover:border-primary transition-all mb-md overflow-hidden">
                  <span className="material-symbols-outlined text-outline-variant text-[40px] group-hover:text-primary">person_add</span>
                  <p className="text-[10px] text-outline group-hover:text-primary-container px-sm leading-tight mt-sm">CLICK TO UPLOAD</p>
                </div>
                <p className="text-body-sm text-outline-variant italic">Accepted formats: JPG, PNG (Max 5MB)</p>
              </div>

              <div className="bg-surface-container-lowest rounded-xl p-lg border border-surface-container">
                <h5 className="font-label-caps text-label-caps text-on-surface-variant mb-lg uppercase">Required Documents</h5>
                <div className="space-y-md">
                  {[
                    { icon: 'badge', label: 'Driver License Scan', color: 'text-primary' },
                    { icon: 'medical_services', label: 'Medical Certificate', color: 'text-secondary' },
                    { icon: 'fact_check', label: 'Clearance Report', color: 'text-tertiary' },
                  ].map((doc) => (
                    <div key={doc.label} className="p-md rounded-lg bg-background border border-surface-container-high group cursor-pointer hover:border-primary/30 transition-all">
                      <div className="flex items-center justify-between mb-xs">
                        <div className="flex items-center gap-sm">
                          <span className={`material-symbols-outlined ${doc.color}`}>{doc.icon}</span>
                          <span className="font-body-md font-medium">{doc.label}</span>
                        </div>
                        <span className="material-symbols-outlined text-outline-variant group-hover:text-primary">cloud_upload</span>
                      </div>
                      <div className="h-1 bg-surface-container-high rounded-full overflow-hidden">
                        <div className="w-0 h-full bg-primary group-hover:w-full transition-all duration-700"></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-lg p-md bg-secondary/5 border border-secondary/10 rounded-lg">
                  <div className="flex gap-sm">
                    <span className="material-symbols-outlined text-secondary text-[20px]">info</span>
                    <p className="text-body-sm text-secondary-fixed-dim font-medium leading-tight">Documents must be current and clearly legible. System will auto-verify OCR data.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-xl py-lg bg-surface-container-low border-t border-outline-variant flex justify-end items-center gap-md">
          <button onClick={onClose} className="px-xl py-md text-on-surface-variant font-medium hover:bg-surface-container transition-colors rounded-lg">Cancel</button>
          <button className="px-3xl py-md bg-primary text-on-primary font-bold rounded-lg shadow-sm hover:bg-primary-container transition-all active:scale-95 flex items-center gap-md">
            <span className="material-symbols-outlined">save</span>
            Save Driver
          </button>
        </div>
      </div>
    </div>
  );
};

export default DriverFormModal;
