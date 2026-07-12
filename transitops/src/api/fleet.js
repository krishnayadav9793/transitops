import { apiClient } from '../services/apiClient';

export const getVehicles = () => apiClient.get('/vehicles');
export const getVehicle = (id) => apiClient.get(`/vehicles/${id}`);
export const createVehicle = (data) => apiClient.post('/vehicles', data);
export const getVehicleTypes = () => apiClient.get('/vehicles/types');
export const getDocumentTypes = () => apiClient.get('/vehicles/documents/types');
export const getMaintenanceLogs = () => apiClient.get('/maintenance');
export const createMaintenanceLog = (data) => apiClient.post('/maintenance', data);
export const closeMaintenanceLog = (id, data) => apiClient.put(`/maintenance/${id}/close`, data);
export const getMaintenanceTypes = () => apiClient.get('/maintenance/types');

export const uploadVehicleDocument = async (formData) => {
  const token = localStorage.getItem('token');
  const response = await fetch(
    `${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/vehicles/documents`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    }
  );
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Upload failed');
  return data;
};