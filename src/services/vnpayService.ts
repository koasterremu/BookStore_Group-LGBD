import axios from "axios";

// Lấy URL của Backend từ file .env
const API_URL = process.env.REACT_APP_API_URL;

// Hàm lấy token từ localStorage
const getToken = (): string | null => {
  const token = localStorage.getItem("auth_token");
  return token ? token : null;
};

// Hàm tạo thanh toán VNPay
export const createVNPayPayment = async (
  amount: number,
  orderInfo: string,
  returnUrl: string
): Promise<any> => {
  try {
    const response = await axios.get(`${API_URL}/vnpay/payment`, {
      params: {
        amount,
        orderInfo,
        returnUrl,
      },
      headers: {
        Authorization: `Bearer ${getToken()}`, // Thêm token vào header
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error creating VNPay payment", error);
    throw error;
  }
};

// Hàm xử lý trả về từ VNPay sau khi thanh toán
export const handleVNPayPaymentReturn = async (
  requestParams: any
): Promise<any> => {
  try {
    const response = await axios.get(`${API_URL}/vnpay/paymentReturn`, {
      params: requestParams,
      headers: {
        Authorization: `Bearer ${getToken()}`, // Thêm token vào header
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error handling VNPay payment return", error);
    throw error;
  }
};
