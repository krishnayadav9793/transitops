import { apiClient } from '../services/apiClient';

export const getTrips = () => apiClient.get('/trips');
export const createTrip = (data) => apiClient.post('/trips', data);
export const getResources = () => apiClient.get('/trips/resources');
export const getTripById = (id) => apiClient.get(`/trips/${id}`);

// Connect to backend PATCH /:id/status endpoint
export const dispatchTrip = (id) => apiClient.patch(`/trips/${id}/status`, { status_name: 'DISPATCHED' });
export const completeTrip = (id, data) => apiClient.patch(`/trips/${id}/status`, { status_name: 'COMPLETED', ...data });
export const cancelTrip = (id) => apiClient.patch(`/trips/${id}/status`, { status_name: 'CANCELLED' });