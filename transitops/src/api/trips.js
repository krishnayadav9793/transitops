import { apiClient } from '../services/apiClient';

export const getTrips = () => apiClient.get('/trips');
export const getTrip = (id) => apiClient.get(`/trips/${id}`);
export const getTripById = (id) => apiClient.get(`/trips/${id}`);
export const createTrip = (data) => apiClient.post('/trips', data);
export const getResources = () => apiClient.get('/trips/resources');
export const dispatchTrip = (id, data) => apiClient.patch(`/trips/${id}/status`, { status_name: 'ON_TRIP', ...data });
export const completeTrip = (id, data) => apiClient.patch(`/trips/${id}/status`, { status_name: 'COMPLETED', ...data });
export const cancelTrip = (id, data) => apiClient.patch(`/trips/${id}/status`, { status_name: 'CANCELLED', ...data });
