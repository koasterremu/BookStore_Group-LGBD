import axios from "axios";

// Lấy URL của Backend từ file .env
const API_URL = process.env.REACT_APP_API_URL;

// Hàm lấy token từ localStorage
const getToken = () => {
  const token = localStorage.getItem("auth_token");
  return token ? token : null;
};

// Hàm lấy tất cả các voucher với phân trang, tìm kiếm
export const getAllVouchers = async (page = 1, limit = 10, keyword = "") => {
  try {
    const response = await axios.get(`${API_URL}/vouchers`, {
      params: {
        keyword,
        page,
        limit,
      },
      headers: {
        Authorization: `Bearer ${getToken()}`, // Thêm token vào header
      },
    });
    return response.data.payload;
  } catch (error) {
    console.error("Error fetching vouchers", error);
    throw error;
  }
};

// Hàm tạo voucher mới
export const createVoucher = async (voucherData) => {
  try {
    const response = await axios.post(
      `${API_URL}/vouchers`,
      voucherData, // Sử dụng đối tượng voucherData được truyền vào
      {
        headers: {
          Authorization: `Bearer ${getToken()}`, // Thêm token vào header
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating voucher", error);
    throw error;
  }
};

// Hàm cập nhật voucher theo ID
export const updateVoucher = async (id, voucherData) => {
  try {
    const response = await axios.put(`${API_URL}/vouchers/${id}`, voucherData, {
      headers: {
        Authorization: `Bearer ${getToken()}`, // Thêm token vào header
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating voucher", error);
    throw error;
  }
};

// Hàm xóa voucher theo ID
export const deleteVoucher = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/vouchers/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`, // Thêm token vào header
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting voucher", error);
    throw error;
  }
};

// Hàm đánh dấu voucher đã sử dụng
export const markVoucherAsUsed = async (id) => {
  try {
    const response = await axios.patch(
      `${API_URL}/vouchers/${id}/mark-as-used`,
      null,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`, // Thêm token vào header
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error marking voucher as used", error);
    throw error;
  }
};

// Hàm kiểm tra voucher
export const checkVoucher = async (code) => {
  try {
    const response = await axios.get(`${API_URL}/vouchers/check/${code}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`, // Thêm token vào header
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error checking voucher", error);
    throw error;
  }
};

// Hàm thay đổi trạng thái voucher
export const changeVoucherStatus = async (id) => {
  try {
    const response = await axios.put(
      `${API_URL}/vouchers/${id}/change-status`,
      null,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`, // Thêm token vào header
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error changing voucher status", error);
    throw error;
  }
};
