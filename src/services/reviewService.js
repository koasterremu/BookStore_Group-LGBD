import axios from "axios";

// Lấy URL của Backend từ file .env
const API_URL = process.env.REACT_APP_API_URL;

// Hàm lấy token từ localStorage
const getToken = () => {
  const token = localStorage.getItem("auth_token");
  return token ? token : null;
};

// Hàm lấy tất cả review với phân trang và tìm kiếm
export const getAllReviews = async (page = 1, limit = 10, searchText = "") => {
  try {
    const response = await axios.get(`${API_URL}/reviews`, {
      params: {
        searchText,
        page,
        limit,
      },
      headers: {
        Authorization: `Bearer ${getToken()}`, // Thêm token vào header
      },
    });
    return response.data.payload;
  } catch (error) {
    console.error("Error fetching reviews", error);
    throw error;
  }
};

// Hàm lấy review theo product ID với phân trang và tìm kiếm
export const getReviewsByProduct = async (
  productId,
  page = 1,
  limit = 10,
  searchText = ""
) => {
  try {
    const response = await axios.get(
      `${API_URL}/reviews/product/${productId}`,
      {
        params: {
          searchText,
          page,
          limit,
        },
        headers: {
          Authorization: `Bearer ${getToken()}`, // Thêm token vào header
        },
      }
    );
    return response.data.payload;
  } catch (error) {
    console.error("Error fetching reviews by product", error);
    throw error;
  }
};

// Hàm lấy review theo ID
export const getReviewById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/reviews/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`, // Thêm token vào header
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching review by ID", error);
    throw error;
  }
};

// Hàm tạo review mới
export const createReview = async (productId, userId, reviewText, rating) => {
  try {
    const reviewData = {
      productId,
      userId,
      reviewText,
      rating,
    };

    const response = await axios.post(`${API_URL}/reviews`, reviewData, {
      headers: {
        Authorization: `Bearer ${getToken()}`, // Thêm token vào header
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error creating review", error);
    throw error;
  }
};

// Hàm cập nhật review theo ID
export const updateReview = async (id, reviewText, rating) => {
  try {
    const reviewData = {
      reviewText,
      rating,
    };

    const response = await axios.put(`${API_URL}/reviews/${id}`, reviewData, {
      headers: {
        Authorization: `Bearer ${getToken()}`, // Thêm token vào header
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error updating review", error);
    throw error;
  }
};

// Hàm xóa review theo ID
export const deleteReview = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/reviews/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`, // Thêm token vào header
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting review", error);
    throw error;
  }
};
