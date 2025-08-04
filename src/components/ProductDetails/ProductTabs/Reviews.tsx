import React, { useState, useEffect } from "react";
import { AiFillStar } from "react-icons/ai";
import {
  getReviewsByProduct,
  createReview,
} from "../../../services/reviewService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux"; // Import useSelector từ Redux
import { RootState } from "../../../redux/reducers"; // Import RootState để lấy kiểu của Redux store
import { checkProfanityWithHuggingFace } from "../../../services/profanityCheckService";

toast.configure(); // Cấu hình toast cho toàn bộ ứng dụng

const Reviews: React.FC<any> = ({ product }) => {
  const [rows] = useState<number>(7);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [rating, setRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Phân trang
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Lấy thông tin người dùng từ Redux store
  const user = useSelector((state: RootState) => state.user.user);
  const fetchReviews = async (page: number = 1, size: number = 5) => {
    try {
      const response = await getReviewsByProduct(product._id, page, size);
      setReviews(response.content);
      setTotalPages(response.totalPages); // Lưu tổng số trang
    } catch (error) {
      console.error("Error fetching reviews: ", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchReviews(currentPage); // Gọi API cho trang hiện tại
  }, [product, currentPage]); // Khi product hoặc currentPage thay đổi thì gọi lại API

  // Hàm để ẩn 5 chữ số giữa của số điện thoại
  const maskPhoneNumber = (phoneNumber: string) => {
    return phoneNumber.replace(/(\d{3})\d{5}(\d{2})/, "$1*****$2");
  };

  // Hàm xử lý gửi review
  const handleSubmitReview = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user || !user.userId) {
      toast.warning("Vui lòng đăng nhập để đánh giá.");
      return;
    }

    if (!reviewText || rating === 0) {
      toast.error("Vui lòng điền đầy đủ thông tin đánh giá.");
      return;
    }

    setIsSubmitting(true); // Bật loading khi gửi đánh giá

    try {
      // Kiểm tra nội dung bằng Hugging Face AI
      const isProfane = await checkProfanityWithHuggingFace(reviewText);
      if (isProfane) {
        toast.error("Đánh giá của bạn có chứa từ ngữ không phù hợp.");
        setIsSubmitting(false); // Tắt loading nếu đánh giá không hợp lệ
        return;
      }

      // Gửi đánh giá nếu hợp lệ
      await createReview(product._id, user.userId, reviewText, rating);
      toast.success("Đánh giá của bạn đã được gửi thành công!");

      // Xóa nội dung sau khi gửi
      setReviewText("");
      setRating(0);
      fetchReviews(currentPage);
    } catch (error) {
      toast.error("Lỗi khi đánh giá.");
      console.error("Error submitting review: ", error);
    } finally {
      setIsSubmitting(false); // Tắt loading sau khi hoàn tất
    }
  };

  // Hàm xử lý khi chuyển trang
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setLoading(true); // Hiển thị loading khi chuyển trang
  };

  return (
    <div className="tabContent-reviews">
      <h6>Gửi đánh giá của bạn</h6>
      <form onSubmit={handleSubmitReview}>
        <div className="rating" style={{ marginBottom: "10px" }}>
          <p>Xếp hạng của bạn cho sản phẩm này</p>
          <div
            className="stars"
            style={{
              display: "flex", // Bố trí các ngôi sao theo chiều ngang từ trái sang phải
              flexDirection: "row", // Đảm bảo chiều sắp xếp từ trái qua phải
            }}
          >
            {[...Array(5)].map((_, i) => (
              <label key={i}>
                <input
                  type="radio"
                  name="rate"
                  value={i + 1}
                  onClick={() => setRating(i + 1)}
                />
                <AiFillStar
                  style={{
                    fontSize: "24px",
                    color: i + 1 <= rating ? "gold" : "gray",
                    marginRight: "5px", // Tạo khoảng cách giữa các ngôi sao
                  }}
                />
              </label>
            ))}
          </div>
        </div>

        <div className="review-area">
          <textarea
            name="review"
            className="w-100"
            placeholder="Viết đánh giá của bạn tại đây"
            rows={rows}
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ddd",
            }}
          ></textarea>
          <div className="submit-review-btn">
            <input
              type="submit"
              value={isSubmitting ? "Đang gửi..." : "Gửi đánh giá"} // Thay đổi text khi đang gửi
              disabled={isSubmitting} // Vô hiệu hóa nút khi đang gửi
              style={{
                backgroundColor: isSubmitting ? "#ccc" : "#d91f28", // Đổi màu nút khi đang gửi

                color: "#fff",
                padding: "10px 20px",
                borderRadius: "5px",
                border: "none",
                cursor: isSubmitting ? "not-allowed" : "pointer", // Đổi trạng thái con trỏ khi đang gửi
                marginTop: "10px",
              }}
            />
          </div>
        </div>
      </form>

      {/* Hiển thị các đánh giá */}
      <div className="review-list" style={{ marginTop: "30px" }}>
        <h6>Đánh giá sản phẩm</h6>
        {loading ? (
          <p>Đang tải đánh giá...</p>
        ) : reviews.length > 0 ? (
          reviews.map((review: any) => (
            <div
              key={review._id}
              className="review-item"
              style={{
                padding: "10px",
                borderBottom: "1px solid #ddd",
                marginBottom: "10px",
              }}
            >
              <div
                className="review-header"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontWeight: "bold",
                }}
              >
                <strong>
                  {review.user.fullName} (
                  {maskPhoneNumber(review.user.phoneNumber)})
                </strong>
                <span>
                  {new Date(review.reviewDate).toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div
                className="review-rating"
                style={{
                  color: "gold",
                  marginBottom: "10px",
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                {[...Array(review.rating)].map((_, i) => (
                  <AiFillStar key={i} />
                ))}
              </div>
              <p>{review.reviewText}</p>
            </div>
          ))
        ) : (
          <p>Chưa có đánh giá nào cho sản phẩm này.</p>
        )}

        {/* Nút phân trang */}
        {totalPages > 1 && (
          <div className="pagination">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                style={{
                  padding: "5px 10px",
                  margin: "0 5px",
                  backgroundColor: currentPage === i + 1 ? "#333" : "#fff",
                  color: currentPage === i + 1 ? "#fff" : "#000",
                  borderRadius: "5px",
                  border: "1px solid #ddd",
                  cursor: "pointer",
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;
