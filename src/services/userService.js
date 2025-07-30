import axios from "axios";

// Lấy URL của Backend từ file .env
const API_URL = process.env.REACT_APP_API_URL;

// Hàm lấy token từ localStorage
const getToken = () => {
  const token = localStorage.getItem("auth_token");
  return token ? token : null;
};

// Hàm lấy tất cả người dùng với phân trang, tìm kiếm và sắp xếp
export const getAllUsers = async (page = 1, limit = 1000, keyword = "") => {
  try {
    const response = await axios.get(`${API_URL}/users`, {
      params: {
        keyword,
        page,
        limit,
      },
      headers: {
        Authorization: `Bearer ${getToken()}`, // Thêm token vào header
      },
    });
    return response.data.payload;
  } catch (error) {
    console.error("Error fetching users", error);
    throw error;
  }
};

// Hàm lấy người dùng theo ID
export const getUserById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/users/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`, // Thêm token vào header
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user by ID", error);
    throw error;
  }
};

// Hàm tạo người dùng mới
export const createUser = async (userData, imageFile) => {
  try {
    const formData = new FormData();
    formData.append("username", userData.username);
    formData.append("password", userData.password);
    formData.append("email", userData.email);
    formData.append("phoneNumber", userData.phoneNumber);
    formData.append("fullName", userData.fullName);
    formData.append("address", userData.address);
    formData.append("role", userData.role);

    if (imageFile) {
      formData.append("avatar", imageFile); // Upload ảnh đại diện (avatar)
    }

    const response = await axios.post(`${API_URL}/users`, formData, {
      headers: {
        Authorization: `Bearer ${getToken()}`, // Thêm token vào header
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error creating user", error);
    throw error;
  }
};

// Hàm cập nhật người dùng theo ID
export const updateUser = async (id, userData, imageFile) => {
  try {
    const formData = new FormData();
    formData.append("username", userData.username);
    formData.append("email", userData.email);
    formData.append("phoneNumber", userData.phoneNumber);
    formData.append("fullName", userData.fullName);
    formData.append("address", userData.address);
    formData.append("role", userData.role);

    if (imageFile) {
      formData.append("avatar", imageFile); // Upload ảnh đại diện (avatar)
    }

    const response = await axios.put(`${API_URL}/users/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${getToken()}`, // Thêm token vào header
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error updating user", error);
    throw error;
  }
};

// Hàm xóa người dùng theo ID
export const deleteUser = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/users/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`, // Thêm token vào header
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting user", error);
    throw error;
  }
};
