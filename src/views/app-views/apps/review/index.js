import React, { useEffect, useState, useCallback } from "react";
import {
  Table,
  Button,
  Pagination,
  Input,
  message,
  Spin,
  Card,
  Modal,
} from "antd";
import { getAllReviews, deleteReview } from "services/reviewService";
import { debounce } from "lodash";
import moment from "moment";

export default function ReviewManagement() {
  const [reviews, setReviews] = useState([]); // State lưu trữ danh sách review
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [totalPages, setTotalPages] = useState(1); // Tổng số trang
  const [loading, setLoading] = useState(false); // Trạng thái loading cho bảng
  const [searchTerm, setSearchTerm] = useState(""); // Từ khóa tìm kiếm
  const [selectedReview, setSelectedReview] = useState(null); // Đánh giá được chọn
  const [isModalVisible, setIsModalVisible] = useState(false); // Hiển thị modal

  const limit = 5; // Số lượng review trên mỗi trang

  // Hàm lấy review
  const fetchReviews = useCallback(
    async (search = searchTerm, page = currentPage) => {
      setLoading(true); // Bắt đầu loading
      try {
        const data = await getAllReviews(page, limit, search); // Gọi API lấy review
        setReviews(data.content);
        setTotalPages(data.totalPages);
      } catch (error) {
        message.error("Lỗi khi lấy đánh giá.");
      } finally {
        setLoading(false); // Dừng loading
      }
    },
    [currentPage, limit]
  );

  // Hàm debounce tìm kiếm
  const debouncedFetchReviews = useCallback(
    debounce((value) => {
      setCurrentPage(1); // Reset về trang đầu tiên khi tìm kiếm
      fetchReviews(value, 1); // Gọi hàm lấy review với trang 1
    }, 800),
    [fetchReviews]
  );

  // Lấy review khi trang hoặc từ khóa tìm kiếm thay đổi
  useEffect(() => {
    fetchReviews(searchTerm, currentPage); // Gọi lại khi trang hoặc từ khóa tìm kiếm thay đổi
  }, [fetchReviews, currentPage]);

  // Hàm hiển thị modal chi tiết đánh giá
  const showReviewDetails = (record) => {
    setSelectedReview(record); // Cập nhật đánh giá được chọn
    setIsModalVisible(true); // Hiển thị modal
  };

  // Hàm đóng modal chi tiết đánh giá
  const handleCancel = () => {
    setIsModalVisible(false); // Đóng modal
    setSelectedReview(null); // Xóa dữ liệu chi tiết đánh giá
  };

  // Hàm xử lý thay đổi trang
  const handlePageChange = (page) => {
    setCurrentPage(page); // Cập nhật trang hiện tại
  };

  // Cấu hình các cột cho bảng Ant Design
  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: ["product", "productName"], // Truy cập tên sản phẩm từ trường "product"
      key: "productName",
    },
    {
      title: "Người dùng",
      dataIndex: ["user", "fullName"], // Truy cập tên đầy đủ của người dùng từ trường "user"
      key: "fullName",
    },
    {
      title: "Số điện thoại",
      dataIndex: ["user", "phoneNumber"], // Truy cập số điện thoại từ trường "user"
      key: "phoneNumber",
    },
    {
      title: "Đánh giá",
      dataIndex: "reviewText", // Trường đánh giá trực tiếp từ dữ liệu chính
      key: "reviewText",
    },
    {
      title: "Số sao",
      dataIndex: "rating", // Trường số sao trực tiếp từ dữ liệu chính
      key: "rating",
    },
    {
      title: "Ngày đánh giá",
      dataIndex: "reviewDate", // Trường ngày đánh giá
      key: "reviewDate",
      render: (text) => moment(text).format("DD/MM/YYYY"), // Định dạng ngày
    },
    {
      title: "Hành Động",
      key: "actions",
      align: "center", // Canh giữa cột Hành Động
      render: (text, record) => (
        <Button
          size="small"
          style={{ marginLeft: "10px" }}
          onClick={() => showReviewDetails(record)}
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];

  return (
    <Card>
      <div>
        {/* Ô tìm kiếm */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <Input
            placeholder="Tìm kiếm đánh giá..."
            allowClear
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value); // Cập nhật từ khóa tìm kiếm
              debouncedFetchReviews(e.target.value); // Gọi hàm tìm kiếm
            }}
            style={{ width: "100%" }}
          />
        </div>

        {/* Loading spinner */}
        {loading ? (
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <Spin size="large" />
          </div>
        ) : (
          <>
            {/* Bảng review */}
            <Table
              columns={columns}
              dataSource={reviews}
              pagination={false}
              rowKey={(record) => record.reviewId}
            />

            {/* Phân trang */}
            <Pagination
              current={currentPage}
              total={totalPages * limit}
              pageSize={limit}
              onChange={handlePageChange}
              style={{ marginTop: "20px", textAlign: "center" }}
            />
          </>
        )}

        {/* Modal hiển thị chi tiết đánh giá */}
        <Modal
          title="Chi tiết đánh giá"
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={null}
        >
          {selectedReview && (
            <div>
              <p>
                <strong>Sản phẩm:</strong> {selectedReview.product.productName}
              </p>
              <p>
                <strong>Người dùng:</strong> {selectedReview.user.fullName}
              </p>
              <p>
                <strong>Số điện thoại:</strong> {selectedReview.user.phoneNumber}
              </p>
              <p>
                <strong>Đánh giá:</strong> {selectedReview.reviewText}
              </p>
              <p>
                <strong>Số sao:</strong> {selectedReview.rating}
              </p>
              <p>
                <strong>Ngày đánh giá:</strong>{" "}
                {moment(selectedReview.reviewDate).format("DD/MM/YYYY")}
              </p>
            </div>
          )}
        </Modal>
      </div>
    </Card>
  );
}
