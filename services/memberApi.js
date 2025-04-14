import axios from 'axios';

// Lấy API_URL từ biến môi trường
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000'; // Fallback

// Instance cho các API thành viên (dưới /api)
export const memberApi = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
    // TODO: Add Authorization header if needed after login
    // 'Authorization': `Token ${userToken}`
  },
});

// Lấy danh sách thành viên
export const getMembers = async () => {
  try {
    const response = await memberApi.get('/members/');
    return response.data;
  } catch (error) {
    console.error('Error fetching members:', error);
    throw error;
  }
};

// Thêm thành viên mới
export const addMember = async (memberData) => {
  try {
    const response = await memberApi.post('/members/', memberData);
    return response.data;
  } catch (error) {
    console.error('Error adding member:', error);
    throw error;
  }
};

// Lấy chi tiết thành viên
export const getMemberDetails = async (memberId) => {
  try {
    const response = await memberApi.get(`/members/${memberId}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching member details:', error);
    throw error;
  }
};

// Cập nhật thành viên
export const updateMember = async (memberId, memberData) => {
  try {
    const response = await memberApi.put(`/members/${memberId}/`, memberData);
    return response.data;
  } catch (error) {
    console.error('Error updating member:', error);
    throw error;
  }
};

// Xóa thành viên
export const deleteMember = async (memberId) => {
  try {
    const response = await memberApi.delete(`/members/${memberId}/`);
    return response.data; // Or handle status code 204 No Content
  } catch (error) {
    console.error('Error deleting member:', error);
    throw error;
  }
};
