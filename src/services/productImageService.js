import axios from "axios";

// Lấy URL của Backend từ file .env
const API_URL = process.env.REACT_APP_API_URL;

// Hàm lấy token từ localStorage
const getToken = () => {
  const token = localStorage.getItem("auth_token");
  return token ? token : null;
};

// Hàm lấy tất cả hình ảnh của một sản phẩm
export const getProductImages = async (productId) => {
  try {
    const response = await axios.get(
      `${API_URL}/products/${productId}/images`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`, // Thêm token vào header
        },
      }
    );
    return response.data.payload; // Giả sử payload chứa danh sách hình ảnh
  } catch (error) {
    console.error("Error fetching product images", error);
    throw error;
  }
};

// Hàm tạo hình ảnh sản phẩm mới
export const createProductImage = async (productId, formData) => {
  try {
    const response = await axios.post(
      `${API_URL}/products/${productId}/images`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`, // Thêm token vào header
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data; // Trả về thông tin hình ảnh đã tạo
  } catch (error) {
    console.error("Error creating product image", error);
    throw error;
  }
};

// Hàm cập nhật hình ảnh sản phẩm theo ID
export const updateProductImage = async (productId, imageId, imageFile) => {
  try {
    const formData = new FormData();
    formData.append("image", imageFile); // Thêm file hình ảnh vào FormData

    const response = await axios.put(
      `${API_URL}/products/${productId}/images/${imageId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`, // Thêm token vào header
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data; // Trả về thông tin hình ảnh đã cập nhật
  } catch (error) {
    console.error("Error updating product image", error);
    throw error;
  }
};

// Hàm xóa tất cả hình ảnh của một sản phẩm
export const deleteProductImages = async (imageId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/products/productId/images/${imageId}`, // Backend API URL for DELETE
      {
        headers: {
          Authorization: `Bearer ${getToken()}`, // Add the token for authorization
        },
      }
    );
    return response.data; // Return the server response
  } catch (error) {
    console.error("Error deleting product image", error);
    throw error; // Throw an error if any issues occur
  }
};

// Function to change the default status of a product image
export const changeIsDefault = async (imageId, isDefault) => {
  try {
    const response = await axios.put(
      `${API_URL}/products/productId/images/${imageId}/default`, // Correct URL with imageId
      null, // No request body required as we're using @RequestParam for isDefault
      {
        headers: {
          Authorization: `Bearer ${getToken()}`, // Add the token for authorization
        },
        params: {
          isDefault: isDefault, // Pass isDefault as a query parameter
        },
      }
    );
    return response.data; // Return the confirmation response from the server
  } catch (error) {
    console.error("Error changing default status of product image", error);
    throw error; // Throw an error if any issues occur
  }
};
