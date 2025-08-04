import axios from "axios";

// Lấy URL của Backend từ file .env
const API_URL = process.env.REACT_APP_API_URL;

// Hàm lấy token từ localStorage
const getToken = (): string | null => {
  const token = localStorage.getItem("auth_token");
  return token ? token : null;
};

// Hàm lấy tất cả nhà xuất bản với phân trang, tìm kiếm
export const getAllBrands = async (
  page: number = 1,
  limit: number = 1000,
  keyword: string = ""
): Promise<any> => {
  try {
    const response = await axios.get(`${API_URL}/brands`, {
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
  } catch (error: any) {
    console.error("Error fetching brands", error);
    throw error;
  }
};

// Hàm lấy nhà xuất bản theo ID
export const getBrandById = async (id: number): Promise<any> => {
  try {
    const response = await axios.get(`${API_URL}/brands/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`, // Thêm token vào header
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching brand by ID", error);
    throw error;
  }
};
