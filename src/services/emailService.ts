import axios from "axios";

// Lấy URL của Backend từ file .env
const API_URL = process.env.REACT_APP_API_URL;

// Hàm lấy token từ localStorage
const getToken = (): string | null => {
  const token = localStorage.getItem("auth_token");
  return token ? token : null;
};

// Hàm gửi email xác nhận đơn hàng
export const sendOrderConfirmationEmail = async (
  orderCode: string
): Promise<any> => {
  try {
    const response = await axios.post(
      `${API_URL}/email/sendOrderConfirmation`,
      null, // Không có body nên gửi null
      {
        params: { orderCode }, // Truyền mã đơn hàng qua query params
        headers: {
          Authorization: `Bearer ${getToken()}`, // Thêm token vào header nếu có
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Error sending order confirmation email", error);
    throw error;
  }
};
