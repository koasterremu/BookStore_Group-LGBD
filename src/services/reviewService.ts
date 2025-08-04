import axios from "axios";

// Lấy URL của Backend từ file .env
const API_URL = process.env.REACT_APP_API_URL;

// Hàm lấy token từ localStorage
const getToken = (): string | null => {
  const token = localStorage.getItem("auth_token");
  return token ? token : null;
};

// Hàm lấy review theo product ID với phân trang và tìm kiếm
export const getReviewsByProduct = async (
  productId: any,
  page: number = 1,
  size: number = 10,
  searchText: string = ""
): Promise<any> => {
  try {
    const response = await axios.get(`${API_URL}/reviews/product/${productId}`, {
      params: {
        searchText,
        page,
        size,
      },
      headers: {
        Authorization: `Bearer ${getToken()}`, // Thêm token vào header
      },
    });
    return response.data.payload;
  } catch (error: any) {
    console.error("Error fetching reviews by product", error);
    throw error;
  }
};

// Hàm tạo review mới
export const createReview = async (
  productId: any,
  userId: any,
  reviewText: string,
  rating: number
): Promise<any> => {
  try {
    const reviewData = {
      productId,
      userId,
      reviewText,
      rating,
    };

    const response = await axios.post(`${API_URL}/reviews`, reviewData, {
      headers: {
        Authorization: `Bearer ${getToken()}`, // Thêm token vào header
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error creating review", error);
    throw error;
  }
};
