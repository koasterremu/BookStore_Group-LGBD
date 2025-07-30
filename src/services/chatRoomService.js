import axios from "axios";

// Lấy URL của Backend từ file .env
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

// Hàm lấy token từ localStorage
const getToken = () => {
  const token = localStorage.getItem("auth_token");
  return token ? token : null;
};

// Hàm lấy tất cả chat rooms cho admin
export const getAllChatRoomsForAdmin = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/chatrooms/admin`, {
      params: { userId },
      headers: {
        Authorization: `Bearer ${getToken()}`, // Thêm token vào header nếu cần
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching chat rooms", error);
    throw error;
  }
};
