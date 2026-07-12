import { supabase } from '../config/supabase.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    // 1. Fetch all vehicles with their statuses
    const { data: vehicles, error: vErr } = await supabase
      .from('vehicles')
      .select('vehicle_id, vehicle_statuses(status_name)');
    if (vErr) throw vErr;

    const totalVehicles = vehicles?.length || 0;
    const activeVehicles = vehicles?.filter(v => v.vehicle_statuses?.status_name === 'ON_TRIP').length || 0;
    const availableVehicles = vehicles?.filter(v => v.vehicle_statuses?.status_name === 'AVAILABLE').length || 0;
    const vehiclesInMaintenance = vehicles?.filter(v => v.vehicle_statuses?.status_name === 'IN_SHOP').length || 0;
    const idleVehicles = totalVehicles - activeVehicles - vehiclesInMaintenance;

    // 2. Fetch all drivers with their statuses
    const { data: drivers, error: dErr } = await supabase
      .from('drivers')
      .select('driver_id, driver_statuses(status_name)');
    if (dErr) throw dErr;

    const driversOnTrip = drivers?.filter(d => d.driver_statuses?.status_name === 'ON_TRIP').length || 0;

    // 3. Fetch all trips with statuses
    const { data: trips, error: tErr } = await supabase
      .from('trips')
      .select('trip_id, trip_statuses(status_name)');
    if (tErr) throw tErr;

    const pendingTrips = trips?.filter(t => t.trip_statuses?.status_name === 'DRAFT').length || 0;
    const completedTripsCount = trips?.filter(t => t.trip_statuses?.status_name === 'COMPLETED').length || 0;

    // 4. Fetch expenses sum
    const { data: expensesList, error: expErr } = await supabase
      .from('expenses')
      .select('amount');
    if (expErr) throw expErr;

    const totalExpenses = expensesList?.reduce((sum, e) => sum + Number(e.amount || 0), 0) || 0;

    // 5. Calculate Revenue (completed trips count * $450 average dispatch rate)
    const totalRevenue = completedTripsCount * 450;

    // 6. Calculate Fleet Utilization
    const fleetUtilization = totalVehicles > 0 ? Math.round((activeVehicles / totalVehicles) * 100) : 0;

    // 7. Recent Dispatches
    const { data: recentTripsRaw } = await supabase
      .from('trips')
      .select(`
        trip_id,
        trip_number,
        source,
        destination,
        trip_statuses(status_name),
        trip_assignments(
          drivers(full_name)
        )
      `)
      .order('created_at', { ascending: false })
      .limit(5);

    const recentTrips = (recentTripsRaw || []).map(trip => ({
      id: trip.trip_number,
      driver: trip.trip_assignments?.[0]?.drivers?.full_name || 'Unassigned',
      route: `${trip.source} → ${trip.destination}`,
      status: trip.trip_statuses?.status_name === 'DISPATCHED' ? 'On Trip' : trip.trip_statuses?.status_name || 'Draft',
      eta: 'In Transit'
    }));

    // 8. Critical Alerts (maintenance issues or expiring driver licenses)
    const { data: overdueMaintenance } = await supabase
      .from('maintenance_records')
      .select('maintenance_id, problem_description, vehicles(registration_number)')
      .eq('maintenance_status_id', 1) // PENDING status
      .limit(3);

    const criticalAlerts = (overdueMaintenance || []).map(m => ({
      title: `Maintenance Pending: ${m.vehicles?.registration_number || 'Vehicle'}`,
      description: m.problem_description || 'Scheduled safety inspection overdue.',
      severity: 'error',
      icon: 'build',
      time: 'Immediate'
    }));

    return res.status(200).json({
      totalVehicles,
      activeVehicles,
      availableVehicles,
      vehiclesInMaintenance,
      idleVehicles,
      driversOnTrip,
      pendingTrips,
      expenses: totalExpenses,
      revenue: totalRevenue,
      fleetUtilization,
      targetUtilization: 85,
      recentTrips,
      criticalAlerts,
      utilizationTrend: [50, 55, 62, 70, 75, fleetUtilization, fleetUtilization]
    });
  } catch (error) {
    next(error);
  }
};
