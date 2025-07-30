import axios from "axios";

// Lấy URL của Backend từ file .env
const API_URL = process.env.REACT_APP_API_URL;

// Hàm lấy token từ localStorage
const getToken = () => {
  const token = localStorage.getItem("auth_token");
  return token ? token : null;
};

// Hàm lấy tất cả đơn hàng với phân trang
export const getRevunueSumary = async () => {
  try {
    const response = await axios.get(`${API_URL}/revenue/summary`, {
      headers: {
        Authorization: `Bearer ${getToken()}`, // Thêm token vào header
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching orders", error);
    throw error;
  }
};

// Bổ sung hàm để lấy doanh thu hàng ngày theo startDate và endDate
export const getDailyRevenue = async (startDate, endDate) => {
  try {
    const response = await axios.get(`${API_URL}/revenue/daily`, {
      params: {
        startDate,
        endDate,
      },
      headers: {
        Authorization: `Bearer ${getToken()}`, // Thêm token vào header
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching daily revenue", error);
    throw error;
  }
};
