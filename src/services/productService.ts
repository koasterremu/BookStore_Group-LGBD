import axios from "axios";

// Lấy URL của Backend từ file .env
const API_URL = process.env.REACT_APP_API_URL;

// Hàm lấy token từ localStorage
const getToken = (): string | null => {
  const token = localStorage.getItem("auth_token");
  return token ? token : null;
};

// Hàm lấy tất cả sản phẩm với phân trang, tìm kiếm và lọc
export const getAllProducts = async (
  search: string = "",
  categoryId: number | null = null,
  brandId: number | null = null,
  page: number = 1,
  limit: number = 10,
  sortField: string = "productName", // Thêm tham số sortField
  sortDirection: string = "asc" // Thêm tham số sortDirection
): Promise<any> => {
  try {
    const response = await axios.get<any>(`${API_URL}/products`, {
      params: {
        search,
        categoryId,
        brandId,
        page,
        limit,
        sortField, // Truyền sortField vào params
        sortDirection, // Truyền sortDirection vào params
      },
      headers: {
        Authorization: `Bearer ${getToken()}`, // Thêm token vào header
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching products", error);
    throw error;
  }
};

// Hàm lấy sản phẩm theo ID
export const getProductById = async (id: number): Promise<any> => {
  try {
    const response = await axios.get<any>(`${API_URL}/products/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`, // Thêm token vào header
      },
    });
    return response.data.payload;
  } catch (error) {
    console.error("Error fetching product by ID", error);
    throw error;
  }
};

// Hàm lấy sản phẩm theo các điều kiện lọc
export const getFilteredProducts = async (
  isNewProduct: boolean | null = null,
  isSale: boolean | null = null,
  isSpecial: boolean | null = null,
  page: number = 1,
  limit: number = 10
): Promise<any> => {
  try {
    const response = await axios.get<any>(`${API_URL}/products/filtered`, {
      params: {
        isSpecial,
        page,
        limit,
      },
      headers: {
        Authorization: `Bearer ${getToken()}`, // Thêm token vào header
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching filtered products", error);
    throw error;
  }
};
// Hàm gọi API gợi ý sản phẩm
export const getRecommendedProducts = async (
  userId: string | null = null
): Promise<any> => {
  try {
    const response = await axios.get<any>(`${API_URL}/products/recommend`, {
      params: userId ? { userId } : {},
      headers: {
        Authorization: `Bearer ${getToken()}`, // Thêm token nếu cần
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching recommended products", error);
    throw error;
  }
};
