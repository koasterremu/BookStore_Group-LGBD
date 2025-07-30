import {
  Table,
  Button,
  Popconfirm,
  Pagination,
  Input,
  message,
  Spin,
  Card,
} from "antd";
import React, { useEffect, useState, useCallback } from "react";
import { getAllOrders, updateOrderStatus } from "services/orderService"; // Import các API
import { debounce } from "lodash"; // Import debounce từ lodash
import { formatCurrency } from "utils/formatCurrency";
import COD from "../../../../assets/img/cash-on-delivery.png";
import OrderDetailModal from "./OrderDetailModal"; // Import modal chi tiết đơn hàng

// Hàm hiển thị phương thức thanh toán với hình ảnh
const generatePaymentMethod = (method) => {
  switch (method) {
    case "COD":
      return (
        <img
          src={COD}
          alt="COD"
          width={50}
          height={50}
          style={{ borderRadius: "15px" }}
        />
      );
    case "VNPay":
      return (
        <img
          src="https://vinadesign.vn/uploads/images/2023/05/vnpay-logo-vinadesign-25-12-57-55.jpg"
          alt="VNPay"
          width={50}
          height={50}
          style={{ borderRadius: "15px" }}
        />
      );
    case "Paypal":
      return (
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Paypal_2014_logo.png"
          alt="Paypal"
          width={50}
          height={50}
          style={{ borderRadius: "15px" }}
        />
      );
    default:
      return <span>{method}</span>;
  }
};

const generateStatus = (status) => {
  let color = "";
  switch (status) {
    case "Chờ xác nhận":
      color = "#FF9900";
      break;
    case "Đã xác nhận":
      color = "#0000FF";
      break;
    case "Đã đóng gói":
      color = "#800080";
      break;
    case "Đang vận chuyển":
      color = "#008000";
      break;
    case "Đã hủy":
      color = "#FF0000";
      break;
    case "Đã giao hàng":
      color = "#008080";
      break;
    default:
      color = "gray";
  }
  return (
    <span
      style={{
        color: color,
        padding: "3px 8px",
        border: `1px solid ${color}`,
        borderRadius: "5px",
        backgroundColor: `${color}20`,
        textAlign: "center",
        display: "inline-block",
      }}
    >
      {status}
    </span>
  );
};

export default function OrderManagement() {
  const [orders, setOrders] = useState([]); // State lưu trữ danh sách đơn hàng
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [totalPages, setTotalPages] = useState(1); // Tổng số trang
  const [loading, setLoading] = useState(false); // Trạng thái loading cho bảng
  const [searchTerm, setSearchTerm] = useState(""); // Từ khóa tìm kiếm
  const [selectedOrder, setSelectedOrder] = useState(null); // Đơn hàng đã chọn để hiển thị chi tiết
  const [isModalVisible, setIsModalVisible] = useState(false); // Trạng thái modal
  const limit = 5; // Số lượng đơn hàng trên mỗi trang

  // Hàm lấy danh sách đơn hàng
  const fetchOrders = useCallback(
    async (search = searchTerm, page = currentPage) => {
      setLoading(true); // Bắt đầu loading
      try {
        const data = await getAllOrders(page, limit, search); // Gọi API lấy đơn hàng
        setOrders(data.content);
        setTotalPages(data.totalPages);
      } catch (error) {
        message.error("Lỗi khi lấy danh sách đơn hàng.");
      } finally {
        setLoading(false); // Dừng loading
      }
    },
    [currentPage, limit]
  );

  // Hàm debounce tìm kiếm
  const debouncedFetchOrders = useCallback(
    debounce((value) => {
      setCurrentPage(1); // Reset về trang đầu tiên khi tìm kiếm
      fetchOrders(value, 1); // Gọi hàm lấy đơn hàng với trang 1
    }, 800),
    [fetchOrders]
  );

  // Lấy danh sách đơn hàng khi trang hoặc từ khóa tìm kiếm thay đổi
  useEffect(() => {
    fetchOrders(searchTerm, currentPage); // Gọi lại khi trang hoặc từ khóa tìm kiếm thay đổi
  }, [fetchOrders, currentPage]);

  // Hàm xử lý khi nhấn vào "Xem chi tiết"
  const handleViewDetail = (order) => {
    setSelectedOrder(order); // Lưu đơn hàng đã chọn
    setIsModalVisible(true); // Hiển thị modal chi tiết đơn hàng
  };

  // Hàm đóng modal chi tiết đơn hàng
  const handleCloseModal = () => {
    setIsModalVisible(false); // Ẩn modal
    setSelectedOrder(null); // Xóa đơn hàng đã chọn
  };

  // Hàm cập nhật trạng thái đơn hàng
  const confirmUpdateOrderStatus = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status); // Gọi API cập nhật trạng thái
      message.success("Đã cập nhật trạng thái đơn hàng.");
      fetchOrders(); // Lấy lại danh sách đơn hàng sau khi cập nhật
    } catch (error) {
      message.error("Lỗi khi cập nhật trạng thái đơn hàng.");
    }
  };

  // Hàm xử lý thay đổi trang
  const handlePageChange = (page) => {
    setCurrentPage(page); // Cập nhật trang hiện tại
  };

  // Cấu hình các cột cho bảng Ant Design
  const columns = [
    {
      title: "Mã Đơn Hàng",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Người Mua",
      dataIndex: ["user", "fullName"],
      key: "user",
    },
    {
      title: "Số Điện Thoại",
      dataIndex: ["user", "phoneNumber"],
      key: "phoneNumber",
    },
    {
      title: "Email",
      dataIndex: ["user", "email"],
      key: "email",
    },
    {
      title: "Ngày Đặt",
      dataIndex: "date",
      key: "date",
      render: (text) => new Date(text).toLocaleDateString("vi-VN"), // Hiển thị ngày đặt với định dạng tiếng Việt
    },
    {
      title: "Phương Thức Thanh Toán",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      align: "center",
      render: (method) => generatePaymentMethod(method), // Hiển thị hình ảnh phương thức thanh toán
    },
    {
      title: "Tổng Giá",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (text) => `${formatCurrency(text)}`,
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      render: (status) => generateStatus(status), // Sử dụng hàm generateStatus để hiển thị trạng thái
    },
    {
      title: "Hành Động",
      key: "actions",
      align: "center", // Canh giữa cột Hành Động
      render: (text, record) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            size="small"
            type="primary"
            onClick={() => handleViewDetail(record)}
          >
            Xem chi tiết
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Card>
      <div>
        {/* Ô tìm kiếm và lọc đơn hàng */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <Input
            placeholder="Tìm kiếm đơn hàng..."
            allowClear
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value); // Cập nhật từ khóa tìm kiếm
              debouncedFetchOrders(e.target.value); // Gọi hàm tìm kiếm
            }}
            style={{ width: "75%" }}
          />
        </div>

        {/* Loading spinner */}
        {loading ? (
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <Spin size="large" />
          </div>
        ) : (
          <>
            {/* Bảng danh sách đơn hàng */}
            <Table
              columns={columns}
              dataSource={orders}
              pagination={false}
              rowKey={(record) => record.orderId}
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
      </div>

      {/* Modal chi tiết đơn hàng */}
      {selectedOrder && (
        <OrderDetailModal
          visible={isModalVisible}
          onClose={handleCloseModal}
          selectedOrder={selectedOrder}
          fetchOrdersData={fetchOrders}
        />
      )}
    </Card>
  );
}
