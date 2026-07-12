// Formatters utility helper library

// Format currency values dynamically (e.g. $1,200.00)
export const formatCurrency = (val) => {
  if (val === undefined || val === null || isNaN(val)) return '$0.00';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
};

// Format date values to local readable strings
export const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

// Format odometer distance readings (e.g. 12,300 km)
export const formatDistance = (distance) => {
  if (distance === undefined || distance === null || isNaN(distance)) return '0 km';
  return `${new Intl.NumberFormat('en-US').format(distance)} km`;
};
