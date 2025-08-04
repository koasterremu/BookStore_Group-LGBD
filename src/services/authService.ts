import axios from "axios";
import { toast } from "react-toastify";

// Lấy URL của Backend từ file .env
const API_URL = process.env.REACT_APP_API_URL;

// Hàm đăng nhập người dùng
export const login = async (username: any, password: any): Promise<any> => {
  try {
    // Thực hiện yêu cầu POST đến API login
    const response: any = await axios.post(`${API_URL}/auth/login`, {
      username,
      password,
    });

    // Trả về dữ liệu từ server (ví dụ: token, thông tin người dùng)
    return response.data;
  } catch (error: any) {
    console.error("Error during login", error);
    throw error; // Ném lỗi ra ngoài để có thể xử lý trong component
  }
};

// Hàm đăng ký người dùng
export const signup = async (userInfo: any): Promise<any> => {
  try {
    // Thực hiện yêu cầu POST đến API signup
    const response: any = await axios.post(
      `${API_URL}/auth/register`,
      userInfo
    );

    // Trả về dữ liệu từ server (ví dụ: token, thông tin người dùng)
    return response.data;
  } catch (error: any) {
    toast.error(
      error.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại."
    );
    throw new Error(
      "Đăng ký không thành công. Vui lòng kiểm tra lại thông tin."
    ); // Ném lỗi ra ngoài để có thể xử lý trong component
  }
};
export const forgotPassword = async (email: string): Promise<any> => {
  try {
    const response = await axios.post(
      `${API_URL}/auth/forgot-password`,
      { email } // Truyền email qua body
    );

    return response.data;
  } catch (error: any) {
    console.error("Error sending forgot password request", error);
    throw error;
  }
};

// API đặt lại mật khẩu
export const resetPassword = async (
  token: string,
  newPassword: string
): Promise<any> => {
  try {
    const response = await axios.post(
      `${API_URL}/auth/reset-password`,
      { token, newPassword } // Truyền token và newPassword vào body của request
    );

    return response.data;
  } catch (error: any) {
    console.error("Error resetting password", error);
    throw error;
  }
};
