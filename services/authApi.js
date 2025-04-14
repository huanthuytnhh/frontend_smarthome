import axios from 'axios';

// Lấy API_URL từ biến môi trường
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000'; // Fallback nếu biến môi trường không được đặt
console.log('API_URL:', API_URL); // Kiểm tra giá trị của API_URL
// Instance riêng cho API xác thực (dưới /auth)
const authApi = axios.create({
  baseURL: API_URL, // Base URL không có /api
  headers: {
    'Content-Type': 'application/json',
  },
});

// Đăng ký người dùng mới
export const registerUser = async (userData) => {
  try {
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
