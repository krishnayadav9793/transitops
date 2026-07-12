// Shared math utilities and conversion calculations

/**
 * Calculates a vehicle's Return on Investment (ROI) percentage
 * Formula: ROI = ((Revenue - (Maintenance + Fuel)) / AcquisitionCost) * 100
 */
export const calculateVehicleROI = (revenue = 0, maintenance = 0, fuel = 0, acquisitionCost = 1) => {
  if (acquisitionCost <= 0) return 0;
  const netProfit = revenue - (maintenance + fuel);
  return (netProfit / acquisitionCost) * 100;
};

/**
 * Calculates average fuel efficiency
 * Formula: Distance / Fuel
 */
export const calculateFuelEfficiency = (distance = 0, fuel = 0) => {
  if (fuel <= 0) return 0;
  return distance / fuel;
};
