import { apiClient } from '../services/apiClient';

export const getVehicles = () => apiClient.get('/vehicles');
export const getVehicleById = (id) => apiClient.get(`/vehicles/${id}`);
export const createVehicle = (data) => apiClient.post('/vehicles', data);
export const getVehicleTypes = () => apiClient.get('/vehicles/types');
export const getDocumentTypes = () => apiClient.get('/vehicles/documents/types');

export const uploadVehicleDocument = (formData) => apiClient.post('/vehicles/documents', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

export const getMaintenanceLogs = () => apiClient.get('/maintenance');
export const createMaintenanceLog = (data) => apiClient.post('/maintenance', data);
export const closeMaintenanceLog = (id, data) => apiClient.put(`/maintenance/${id}/close`, data);
export const getMaintenanceTypes = () => apiClient.get('/maintenance/types');