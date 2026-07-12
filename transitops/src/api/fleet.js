import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

export const getVehicles = () => api.get('/vehicles');
export const getVehicle = (id) => api.get(`/vehicles/${id}`);
export const createVehicle = (data) => api.post('/vehicles', data);
export const getVehicleTypes = () => api.get('/vehicles/types');
export const getDocumentTypes = () => api.get('/vehicles/documents/types');
export const uploadVehicleDocument = (formData) => api.post('/vehicles/documents', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

export const getMaintenanceLogs = () => api.get('/maintenance');
export const createMaintenanceLog = (data) => api.post('/maintenance', data);
export const closeMaintenanceLog = (id, data) => api.put(`/maintenance/${id}/close`, data);
export const getMaintenanceTypes = () => api.get('/maintenance/types');