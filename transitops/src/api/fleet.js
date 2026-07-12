import { apiClient } from '../services/apiClient';

export const getVehicles = () => apiClient.get('/vehicles');
export const getVehicleById = (id) => apiClient.get(`/vehicles/${id}`);
export const createVehicle = (data) => apiClient.post('/vehicles', data);
export const getVehicleTypes = () => apiClient.get('/vehicles/types');
export const getDocumentTypes = () => apiClient.get('/vehicles/documents/types');

export const getVehicles = () => api.get('/vehicles');
export const getVehicle = (id) => api.get(`/vehicles/${id}`);
export const createVehicle = (data) => api.post('/vehicles', data);
export const getVehicleTypes = () => api.get('/vehicles/types');
export const getDocumentTypes = () => api.get('/vehicles/documents/types');
export const uploadVehicleDocument = (formData) => api.post('/vehicles/documents', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

export const getMaintenanceLogs = () => apiClient.get('/maintenance');
export const createMaintenanceLog = (data) => apiClient.post('/maintenance', data);
export const closeMaintenanceLog = (id, data) => apiClient.put(`/maintenance/${id}/close`, data);
export const getMaintenanceTypes = () => apiClient.get('/maintenance/types');