import axios from "axios";

// Lấy URL của Backend từ file .env
const API_URL = process.env.REACT_APP_API_URL;

// Hàm lấy token từ localStorage
const getToken = (): string | null => {
  const token = localStorage.getItem("auth_token");
  return token ? token : null;
};

// Hàm lấy tất cả danh mục với phân trang, tìm kiếm và sắp xếp
export const getAllCategories = async (
  page: number = 1,
  limit: number = 1000,
  keyword: string = ""
): Promise<any> => {
  try {
    const response = await axios.get(`${API_URL}/categories`, {
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
    console.error("Error fetching categories", error);
    throw error;
  }
};

// Hàm lấy danh mục theo ID
export const getCategoryById = async (id: any): Promise<any> => {
  try {
    const response = await axios.get(`${API_URL}/categories/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`, // Thêm token vào header
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching category by ID", error);
    throw error;
  }
};

// Hàm tạo danh mục mới
export const createCategory = async (
  categoryName: any,
  description: any,
  imageFile: any
): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append("categoryName", categoryName);
    formData.append("description", description);
    formData.append("image", imageFile);

    const response = await axios.post(`${API_URL}/categories`, formData, {
      headers: {
        Authorization: `Bearer ${getToken()}`, // Thêm token vào header
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error creating category", error);
    throw error;
  }
};

// Hàm cập nhật danh mục theo ID
export const updateCategory = async (
  id: any,
  categoryName: any,
  description: any,
  imageFile?: any
): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append("categoryName", categoryName);
    formData.append("description", description);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    const response = await axios.put(`${API_URL}/categories/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${getToken()}`, // Thêm token vào header
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error updating category", error);
    throw error;
  }
};

// Hàm xóa danh mục theo ID
export const deleteCategory = async (id: any): Promise<any> => {
  try {
    const response = await axios.delete(`${API_URL}/categories/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`, // Thêm token vào header
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error deleting category", error);
    throw error;
  }
};
