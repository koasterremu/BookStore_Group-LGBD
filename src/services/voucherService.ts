import axios from "axios";

// Lấy URL của Backend từ file .env
const API_URL = process.env.REACT_APP_API_URL;

// Hàm lấy token từ localStorage
const getToken = (): string | null => {
  const token = localStorage.getItem("auth_token");
  return token ? token : null;
};

// Hàm xóa voucher theo ID
export const deleteVoucher = async (id: any): Promise<any> => {
  try {
    const response = await axios.delete(`${API_URL}/vouchers/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`, // Thêm token vào header
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error deleting voucher", error);
    throw error;
  }
};

// Hàm đánh dấu voucher đã sử dụng
export const markVoucherAsUsed = async (id: any): Promise<any> => {
  try {
    const response = await axios.put(
      `${API_URL}/vouchers/${id}/mark-as-used`,
      null,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`, // Thêm token vào header
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error marking voucher as used", error);
    throw error;
  }
};

// Hàm kiểm tra voucher
export const checkVoucher = async (code: string): Promise<any> => {
  try {
    const response = await axios.get(`${API_URL}/vouchers/check/${code}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`, // Thêm token vào header
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error checking voucher", error);
    throw error;
  }
};

// Hàm thay đổi trạng thái voucher
export const changeVoucherStatus = async (id: any): Promise<any> => {
  try {
    const response = await axios.patch(
      `${API_URL}/vouchers/${id}/change-status`,
      null,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`, // Thêm token vào header
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error changing voucher status", error);
    throw error;
  }
};
