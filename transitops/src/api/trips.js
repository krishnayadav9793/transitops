import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
});

export const getTrips = () => api.get('/trips');
export const getTrip = (id) => api.get(`/trips/${id}`);
export const createTrip = (data) => api.post('/trips', data);
export const getResources = () => api.get('/trips/resources');
export const dispatchTrip = (id) => api.patch(`/trips/${id}/dispatch`);
export const completeTrip = (id, data) => api.patch(`/trips/${id}/complete`, data);
export const cancelTrip = (id) => api.patch(`/trips/${id}/cancel`);