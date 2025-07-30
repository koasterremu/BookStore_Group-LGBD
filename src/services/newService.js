import axios from "axios";

// Lấy URL của Backend từ file .env
const API_URL = process.env.REACT_APP_API_URL;

// Hàm lấy token từ localStorage
const getToken = () => {
  const token = localStorage.getItem("auth_token");
  return token ? token : null;
};

// Hàm lấy tất cả tin tức với phân trang, tìm kiếm
export const getAllNews = async (page = 1, limit = 10, keyword = "") => {
  try {
    const response = await axios.get(`${API_URL}/news`, {
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
    console.error("Error fetching news", error);
    throw error;
  }
};

// Hàm lấy tin tức theo ID
export const getNewsById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/news/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`, // Thêm token vào header
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching news by ID", error);
    throw error;
  }
};

// Hàm tạo tin tức mới
export const createNews = async (title, content, imageFile) => {
  try {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    const response = await axios.post(`${API_URL}/news`, formData, {
      headers: {
        Authorization: `Bearer ${getToken()}`, // Thêm token vào header
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error creating news", error);
    throw error;
  }
};

// Hàm cập nhật tin tức theo ID
export const updateNews = async (id, title, content, imageFile) => {
  try {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    const response = await axios.put(`${API_URL}/news/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${getToken()}`, // Thêm token vào header
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error updating news", error);
    throw error;
  }
};

// Hàm xóa tin tức theo ID
export const deleteNews = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/news/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`, // Thêm token vào header
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting news", error);
    throw error;
  }
};
