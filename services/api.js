// services/api.js
import axios from 'axios';

// Thay đổi địa chỉ IP này thành địa chỉ IP của máy chạy Django backend
const API_URL = 'http://localhost:8000'; // Ví dụ: 192.168.1.5

// Instance cho các API thông thường (dưới /api)
export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Instance riêng cho API xác thực (dưới /auth)
const authApi = axios.create({
  baseURL: API_URL, // Base URL không có /api
  headers: {
    'Content-Type': 'application/json',
  },
});

// Lấy danh sách thiết bị
export const getDevices = async () => {
  try {
    const response = await api.get('/devices/list/');
    return response.data.devices;
  } catch (error) {
    console.error('Error fetching devices:', error);
    throw error;
  }
};

// Điều khiển thiết bị
export const controlDevice = async (deviceId, action) => {
  try {
    const response = await api.post('/devices/control/', {
      device_id: deviceId,
      action: action, // 'turn_on' hoặc 'turn_off'
    });
    return response.data;
  } catch (error) {
    console.error('Error controlling device:', error);
    throw error;
  }
};

// Đăng ký người dùng mới
export const registerUser = async (userData) => {
  try {
    // Sử dụng authApi và đường dẫn đúng
    const response = await authApi.post('/auth/register/', userData);
    return response.data;
  } catch (error) {
    console.error(
      'Error registering user:',
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

// Đăng nhập người dùng
export const loginUser = async (credentials) => {
  try {
    // Sử dụng authApi và đường dẫn đúng
    const response = await authApi.post('/auth/login/', credentials);
    return response.data;
  } catch (error) {
    console.error(
      'Error logging in:',
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};
