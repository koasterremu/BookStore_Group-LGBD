import axios from "axios";

// Lấy URL của Backend từ file .env
const API_URL = process.env.REACT_APP_API_URL;

// Hàm lấy token từ localStorage
const getToken = (): string | null => {
  const token = localStorage.getItem("auth_token");
  return token ? token : null;
};

// Hàm lấy tất cả người dùng với phân trang, tìm kiếm và sắp xếp
export const getAllUsers = async (
  page: any = 1,
  limit: any = 1000,
  keyword: any = ""
): Promise<any> => {
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
  } catch (error: any) {
    console.error("Error fetching users", error);
    throw error;
  }
};

// Hàm lấy người dùng theo ID
export const getUserById = async (id: any): Promise<any> => {
  try {
    const response = await axios.get(`${API_URL}/users/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`, // Thêm token vào header
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching user by ID", error);
    throw error;
  }
};

// Hàm tạo người dùng mới
export const createUser = async (userData: any): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append("username", userData.username);
    formData.append("password", userData.password);
    formData.append("email", userData.email);
    formData.append("phoneNumber", userData.phoneNumber);
    formData.append("fullName", userData.fullName);
    formData.append("address", userData.address);
    formData.append("role", userData.role);

    formData.append("avatar", "");

    const response = await axios.post(`${API_URL}/users`, formData, {
      headers: {
        Authorization: `Bearer ${getToken()}`, // Thêm token vào header
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error creating user", error);
    throw error;
  }
};

// Hàm cập nhật người dùng theo ID
export const updateUser = async (
  id: any,
  userData: any,
  imageFile: any
): Promise<any> => {
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
  } catch (error: any) {
    console.error("Error updating user", error);
    throw error;
  }
};
export const updateProfile = async (
  id: any,
  userData: any,
  imageFile: any
): Promise<any> => {
  try {
    // Lấy user từ localStorage
    const user = localStorage.getItem("user");
    let parsedUser = null;
    if (user) {
      parsedUser = JSON.parse(user);
    }

    const formData = new FormData();
    if (parsedUser) {
      formData.append("username", parsedUser.username); // Lấy username từ localStorage
      formData.append("role", parsedUser.role); // Lấy role từ localStorage
    }
    formData.append("email", userData.email);
    formData.append("phoneNumber", userData.phoneNumber);
    formData.append("fullName", userData.fullName);
    formData.append("address", userData.address);

    if (imageFile) {
      formData.append("avatar", imageFile); // Upload ảnh đại diện nếu có
    }

    const response = await axios.put(`${API_URL}/users/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error updating user", error);
    throw error;
  }
};

// Hàm xóa người dùng theo ID
export const deleteUser = async (id: any): Promise<any> => {
  try {
    const response = await axios.delete(`${API_URL}/users/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`, // Thêm token vào header
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error deleting user", error);
    throw error;
  }
};
export const changePassword = async (
  id: any,
  currentPassword: string,
  newPassword: string
): Promise<any> => {
  try {
    // Gửi dữ liệu dưới dạng JSON
    const response = await axios.put(
      `${process.env.REACT_APP_API_URL}/users/${id}/change-password`,
      { currentPassword, newPassword },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Error changing password", error);
    throw error;
  }
};
