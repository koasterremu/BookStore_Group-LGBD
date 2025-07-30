import axios from "axios";

// Lấy URL của Backend từ file .env
const API_URL = process.env.REACT_APP_API_URL;

// Hàm lấy token từ localStorage
const getToken = () => {
  const token = localStorage.getItem("auth_token");
  return token ? token : null;
};

// Hàm lấy tất cả sản phẩm với phân trang, tìm kiếm và lọc
export const getAllProducts = async (
  search = "",
  categoryId = null,
  brandId = null,
  page = 1,
  limit = 10
) => {
  try {
    const response = await axios.get(`${API_URL}/products`, {
      params: {
        search,
        categoryId,
        brandId,
        page,
        limit,
      },
      headers: {
        Authorization: `Bearer ${getToken()}`, // Thêm token vào header
      },
    });
    return response.data.payload;
  } catch (error) {
    console.error("Error fetching products", error);
    throw error;
  }
};

// Hàm lấy sản phẩm theo ID
export const getProductById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/products/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`, // Thêm token vào header
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching product by ID", error);
    throw error;
  }
};

// Hàm tạo sản phẩm mới
export const createProduct = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/products`, formData, {
      headers: {
        Authorization: `Bearer ${getToken()}`, // Thêm token vào header
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error creating product", error);
    throw error;
  }
};

// Hàm cập nhật sản phẩm theo ID
export const updateProduct = async (id, formData) => {
  try {
    const response = await axios.put(`${API_URL}/products/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${getToken()}`, // Thêm token vào header
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error updating product", error);
    throw error;
  }
};

// Hàm xóa sản phẩm theo ID
export const deleteProduct = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/products/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`, // Thêm token vào header
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting product", error);
    throw error;
  }
};
