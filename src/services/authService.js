import axios from "axios";

// Lấy URL của Backend từ file .env
const API_URL = process.env.REACT_APP_API_URL;

// Hàm đăng nhập người dùng
export const login = async (username, password) => {
  try {
    // Thực hiện yêu cầu POST đến API login
    const response = await axios.post(`${API_URL}/auth/login`, {
      username,
      password,
    });

    // Trả về dữ liệu từ server (ví dụ: token, thông tin người dùng)
    return response.data;
  } catch (error) {
    console.error("Error during login", error);
    throw error; // Ném lỗi ra ngoài để có thể xử lý trong component
  }
};
