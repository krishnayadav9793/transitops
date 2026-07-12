import React from 'react';

// Reusable FilterBar component
export const FilterBar = ({ children, onClear }) => {
  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm p-lg mb-xl flex flex-wrap items-center gap-lg border border-surface-container">
      <div className="flex items-center gap-sm">
        <span className="material-symbols-outlined text-on-surface-variant">filter_list</span>
        <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">Filters</span>
      </div>
      <div className="h-8 w-px bg-outline-variant"></div>
      <div className="flex flex-wrap gap-lg flex-1">
        {children}
      </div>
      {onClear && (
        <button
          onClick={onClear}
          className="ml-auto flex items-center gap-sm text-on-surface-variant hover:text-primary transition-colors font-body-md font-medium"
        >
          <span className="material-symbols-outlined">filter_list</span>
          Clear Filters
        </button>
      )}
    </div>
  );
};

// Reusable Select component
export const FilterSelect = ({ label, options, value, onChange, className = '' }) => {
  return (
    <div className={`flex flex-col gap-xs ${className}`}>
      {label && (
        <label className="font-label-caps text-[10px] text-outline">{label}</label>
      )}
      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="bg-surface border-outline-variant rounded-lg py-sm px-md text-body-sm font-medium appearance-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

// Reusable SearchInput component
export const SearchInput = ({ placeholder, value, onChange, className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-surface-container-low border border-outline-variant rounded-lg py-sm pl-3xl pr-md text-body-md focus:border-primary focus:ring-primary"
      />
    </div>
  );
};

export default FilterBar;