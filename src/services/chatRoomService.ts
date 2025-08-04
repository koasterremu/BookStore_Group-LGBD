import axios from "axios";

// Lấy URL của Backend từ file .env
const API_URL = process.env.REACT_APP_API_URL;

// Hàm lấy token từ localStorage
const getToken = (): string | null => {
  const token = localStorage.getItem("auth_token");
  return token ? token : null;
};

// Hàm lấy customerId từ localStorage (giả định user được lưu trong localStorage)
const getCustomerId = (): number | null => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return user?.userId || null;
};

// Hàm tạo phòng chat cho khách hàng với customerId
export const createChatRoom = async (): Promise<any> => {
  const customerId = getCustomerId(); // Lấy customerId từ localStorage

  if (!customerId) {
    throw new Error("CustomerId not found in localStorage");
  }

  try {
    const response = await axios.post(
      `${API_URL}/chatrooms`,
      null, // Không có body nên gửi null
      {
        params: { customerId }, // Truyền customerId qua query params
        headers: {
          Authorization: `Bearer ${getToken()}`, // Thêm token vào header nếu có
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Error creating chat room", error);
    throw error;
  }
};
