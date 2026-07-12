import React from 'react';

// Reusable Status Badge component
export const StatusBadge = ({ status, children }) => {
  const statusStyles = {
    active: 'bg-primary-fixed-dim/20 text-primary',
    'on-trip': 'bg-primary-fixed-dim/30 text-on-primary-fixed-variant',
    available: 'bg-primary-fixed text-on-primary-fixed-variant',
    maintenance: 'bg-secondary-fixed/30 text-secondary',
    idle: 'bg-surface-container-highest/50 text-on-surface-variant',
    'out-of-service': 'bg-error-container/30 text-error',
    suspended: 'bg-error/10 text-error',
    'off-duty': 'bg-surface-container-high text-on-surface-variant',
    completed: 'bg-surface-container-highest text-on-surface-variant',
    pending: 'bg-secondary-container/10 text-secondary',
    approved: 'bg-primary-fixed-dim/20 text-primary',
    flagged: 'bg-error-container text-on-error-container',
    'in-progress': 'bg-secondary-container text-on-secondary-container',
    scheduled: 'bg-primary/20 text-primary',
    delayed: 'bg-error-container text-on-error-container',
    draft: 'bg-tertiary-fixed text-on-tertiary-fixed-variant',
    dispatched: 'bg-secondary-container text-on-secondary-fixed-variant',
    'on-going': 'bg-primary-fixed-dim text-on-primary-fixed-variant',
  };

  const defaultStyle = 'bg-surface-container text-on-surface-variant';

  return (
    <span className={`inline-flex items-center px-sm py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${statusStyles[status?.toLowerCase()] || defaultStyle}`}>
      {status === 'on-trip' && (
        <span className="w-1.5 h-1.5 rounded-full bg-primary mr-1.5 animate-pulse"></span>
      )}
      {children || status}
    </span>
  );
};

export default StatusBadge;