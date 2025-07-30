import axios from "axios";

// Lấy URL của Backend từ file .env
const API_URL = process.env.REACT_APP_API_URL;

// Hàm lấy token từ localStorage
const getToken = () => {
  const token = localStorage.getItem("auth_token");
  return token ? token : null;
};

const getUserId = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user).userId : null;
};

// Hàm lấy tất cả đơn hàng với phân trang
export const getAllOrders = async (
  page = 1,
  limit = 10,
  code,
  status,
  method
) => {
  try {
    const params = { page, limit };

    // Kiểm tra xem các tham số lọc có tồn tại không, nếu có thì thêm vào params
    if (code) {
      params.code = code;
    }
    if (status) {
      params.status = status;
    }
    if (method) {
      params.method = method;
    }

    const response = await axios.get(`${API_URL}/orders/all`, {
      params,
      headers: {
        Authorization: `Bearer ${getToken()}`, // Thêm token vào header
      },
    });
    return response.data.payload;
  } catch (error) {
    console.error("Error fetching orders", error);
    throw error;
  }
};

// Hàm cập nhật trạng thái đơn hàng
export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await axios.put(
      `${API_URL}/orders/${orderId}/status`,
      null,
      {
        params: { status },
        headers: {
          Authorization: `Bearer ${getToken()}`, // Thêm token vào header
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating order status", error);
    throw error;
  }
};
