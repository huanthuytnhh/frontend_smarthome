import axios from 'axios';

// Lấy API_URL từ biến môi trường
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000'; // Fallback

// Instance cho các API phân quyền (dưới /api)
export const permissionApi = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
    // TODO: Add Authorization header if needed after login
    // 'Authorization': `Token ${userToken}`
  },
});

// Lấy danh sách phân quyền
export const getPermissions = async () => {
  try {
    const response = await permissionApi.get('/permissions/');
    return response.data;
  } catch (error) {
    console.error('Error fetching permissions:', error);
    throw error;
  }
};

// Thêm phân quyền mới
export const addPermission = async (permissionData) => {
  // permissionData should contain user_id, device_id, can_control
  try {
    const response = await permissionApi.post('/permissions/', permissionData);
    return response.data;
  } catch (error) {
    console.error('Error adding permission:', error);
    throw error;
  }
};

// Lấy chi tiết phân quyền
export const getPermissionDetails = async (permissionId) => {
  try {
    const response = await permissionApi.get(`/permissions/${permissionId}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching permission details:', error);
    throw error;
  }
};

// Cập nhật phân quyền
export const updatePermission = async (permissionId, permissionData) => {
  // permissionData might only need can_control or also user_id/device_id depending on backend
  try {
    const response = await permissionApi.put(
      `/permissions/${permissionId}/`,
      permissionData
    );
    return response.data;
  } catch (error) {
    console.error('Error updating permission:', error);
    throw error;
  }
};

// Xóa phân quyền
export const deletePermission = async (permissionId) => {
  try {
    const response = await permissionApi.delete(
      `/permissions/${permissionId}/`
    );
    return response.data; // Or handle status code 204 No Content
  } catch (error) {
    console.error('Error deleting permission:', error);
    throw error;
  }
};

// Lấy quyền theo thành viên (Ví dụ - dựa trên postman.md)
export const getPermissionsByMember = async (memberId) => {
  try {
    const response = await permissionApi.get(
      `/permissions/member/${memberId}/`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching permissions by member:', error);
    throw error;
  }
};
