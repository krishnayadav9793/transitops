import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
});

export const getTrips = () => api.get('/trips');
export const createTrip = (data) => api.post('/trips', data);
export const updateTripStatus = (id, data) => api.patch(`/trips/${id}/status`, data);
export const getResources = () => api.get('/trips/resources');