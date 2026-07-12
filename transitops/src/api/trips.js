import { apiClient } from '../services/apiClient';

export const getTrips = () => apiClient.get('/trips');
export const createTrip = (data) => apiClient.post('/trips', data);
export const getResources = () => apiClient.get('/trips/resources');
export const getTripById = (id) => apiClient.get(`/trips/${id}`);

<<<<<<< HEAD
export const getTrips = () => api.get('/trips');
export const getTrip = (id) => api.get(`/trips/${id}`);
export const createTrip = (data) => api.post('/trips', data);
export const getResources = () => api.get('/trips/resources');
export const dispatchTrip = (id) => api.patch(`/trips/${id}/dispatch`);
export const completeTrip = (id, data) => api.patch(`/trips/${id}/complete`, data);
export const cancelTrip = (id) => api.patch(`/trips/${id}/cancel`);
=======
// Connect to backend PATCH /:id/status endpoint
export const dispatchTrip = (id) => apiClient.patch(`/trips/${id}/status`, { status_name: 'DISPATCHED' });
export const completeTrip = (id, data) => apiClient.patch(`/trips/${id}/status`, { status_name: 'COMPLETED', ...data });
export const cancelTrip = (id) => apiClient.patch(`/trips/${id}/status`, { status_name: 'CANCELLED' });
>>>>>>> 30fefbefc835956e67a9056efd9495b0c7cb53d0
