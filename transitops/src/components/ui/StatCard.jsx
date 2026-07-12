import React from 'react';

// Reusable StatCard component for KPI display
export const StatCard = ({ label, value, trend, trendDirection, icon: Icon, variant = 'default' }) => {
  const variantStyles = {
    default: 'bg-surface-container-lowest border border-outline-variant/30',
    primary: 'bg-primary-container border border-primary',
    warning: 'bg-secondary-container/20 border border-secondary/10',
    error: 'bg-error-container/30 border border-error/10',
  };

  const textColors = {
    default: 'text-on-surface',
    primary: 'text-on-primary',
    warning: 'text-on-secondary-container',
    error: 'text-error',
  };

  return (
    <div className={`p-lg rounded-xl shadow-sm hover:shadow-md transition-all ${variantStyles[variant]}`}>
      <div className="flex items-center justify-between mb-md">
        <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">{label}</span>
        {Icon && (
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            variant === 'primary' ? 'bg-primary/20 text-on-primary' :
            variant === 'warning' ? 'bg-secondary/10 text-secondary' :
            variant === 'error' ? 'bg-error/10 text-error' :
            'bg-primary/10 text-primary'
          }`}>
            <Icon className="text-sm" style={{ fontVariationSettings: "'FILL' 1" }} />
          </div>
        )}
      </div>
      <div className="flex items-baseline gap-sm">
        <span className={`font-kpi-lg text-kpi-lg ${variant === 'primary' ? 'text-on-primary' : 'text-on-surface'}`}>
          {value}
        </span>
        {trend && (
          <span className={`font-body-sm font-medium ${
            trendDirection === 'up' ? 'text-primary' :
            trendDirection === 'down' ? 'text-error' :
            'text-on-surface-variant'
          }`}>
            {trendDirection === 'up' && <span className="material-symbols-outlined text-sm mr-1">trending_up</span>}
            {trendDirection === 'down' && <span className="material-symbols-outlined text-sm mr-1">trending_down</span>}
            {trend}
          </span>
        )}
      </div>
    </div>
  );
};

export default StatCard;