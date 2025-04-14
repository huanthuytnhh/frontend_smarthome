import axios from 'axios';

// Lấy API_URL từ biến môi trường
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000'; // Fallback

// Instance cho các API thiết bị (dưới /api)
export const deviceApi = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
    // TODO: Add Authorization header if needed after login
    // 'Authorization': `Token ${userToken}`
  },
});

// Lấy danh sách thiết bị
export const getDevices = async () => {
  try {
    // Note: Backend endpoint might be /devices/ not /devices/list/
    const response = await deviceApi.get('/devices/');
    // Adjust based on actual backend response structure
    return response.data; // Assuming backend returns the list directly
  } catch (error) {
    console.error('Error fetching devices:', error);
    throw error;
  }
};

// Điều khiển thiết bị
export const controlDevice = async (deviceId, action) => {
  try {
    // Note: Backend endpoint might be different, e.g., /devices/{id}/control/
    const response = await deviceApi.post(`/devices/${deviceId}/control/`, {
      // Example adjusted path
      action: action, // 'turn_on' hoặc 'turn_off'
    });
    return response.data;
  } catch (error) {
    console.error('Error controlling device:', error);
    throw error;
  }
};

// Thêm thiết bị mới (Ví dụ)
export const addDevice = async (deviceData) => {
  try {
    const response = await deviceApi.post('/devices/', deviceData);
    return response.data;
  } catch (error) {
    console.error('Error adding device:', error);
    throw error;
  }
};

// Lấy chi tiết thiết bị (Ví dụ)
export const getDeviceDetails = async (deviceId) => {
  try {
    const response = await deviceApi.get(`/devices/${deviceId}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching device details:', error);
    throw error;
  }
};

// Cập nhật thiết bị (Ví dụ)
export const updateDevice = async (deviceId, deviceData) => {
  try {
    const response = await deviceApi.put(`/devices/${deviceId}/`, deviceData);
    return response.data;
  } catch (error) {
    console.error('Error updating device:', error);
    throw error;
  }
};

// Xóa thiết bị (Ví dụ)
export const deleteDevice = async (deviceId) => {
  try {
    const response = await deviceApi.delete(`/devices/${deviceId}/`);
    return response.data;
  } catch (error) {
    console.error('Error deleting device:', error);
    throw error;
  }
};
