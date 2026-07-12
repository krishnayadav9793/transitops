import { apiClient } from '../services/apiClient';

export const getTrips = () => apiClient.get('/trips');
export const getTrip = (id) => apiClient.get(`/trips/${id}`);
export const createTrip = (data) => apiClient.post('/trips', data);
export const getResources = () => apiClient.get('/trips/resources'); // calls the correct backend route
export const dispatchTrip = (id) => apiClient.patch(`/trips/${id}/dispatch`);
export const completeTrip = (id, data) => apiClient.patch(`/trips/${id}/complete`, data);
export const cancelTrip = (id) => apiClient.patch(`/trips/${id}/cancel`);