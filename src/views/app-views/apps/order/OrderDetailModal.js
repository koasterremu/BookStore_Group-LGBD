import React, { useState, useEffect } from "react";
import { Modal, Tag, message, Steps } from "antd"; // Import thêm Steps
import { updateOrderStatus } from "services/orderService";
import { formatCurrency } from "utils/formatCurrency";

const { Step } = Steps;

const statusSteps = [
  "Chờ xác nhận",
  "Đã xác nhận",
  "Đã đóng gói",
  "Đang vận chuyển",
  "Đã giao hàng",
  "Đã hủy",
];
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
const OrderDetailModal = ({
  visible,
  onClose,
  selectedOrder,
  fetchOrdersData,
}) => {
  const [currentStatus, setCurrentStatus] = useState(selectedOrder?.status);

  useEffect(() => {
    if (selectedOrder) {
      setCurrentStatus(selectedOrder.status);
    }
  }, [selectedOrder]);

  // Hàm xử lý khi click vào step để cập nhật trạng thái đơn hàng
  const handleStatusUpdate = async (status) => {
    try {
      await updateOrderStatus(selectedOrder._id, status);
      setCurrentStatus(status);
      message.success(`Đã cập nhật trạng thái đơn hàng thành ${status}`);
      fetchOrdersData();
    } catch (error) {
      message.error("Lỗi khi cập nhật trạng thái đơn hàng.");
    }
  };

  // Lấy index của trạng thái hiện tại
  const currentStatusIndex = statusSteps.indexOf(currentStatus);
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
  return (
    <Modal
      title={`Chi tiết đơn hàng: ${selectedOrder?.code}`}
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={1000}
    >
      <div>
        {/* Thông tin chung về đơn hàng */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2 style={{ fontSize: "1.25rem", fontWeight: "600" }}>
            Mã đơn hàng: {selectedOrder.code}
          </h2>
          {generateStatus(selectedOrder.status)}
        </div>
        <p style={{ color: "#6B7280" }}>
          {new Date(selectedOrder.date).toLocaleString("vi-VN")}
        </p>
        {/* Thêm Steps để hiển thị các bước trạng thái */}
        <div style={{ marginBottom: "2rem", marginTop: "2rem" }}>
          <Steps
            current={currentStatusIndex}
            onChange={(current) => handleStatusUpdate(statusSteps[current])}
          >
            {statusSteps.map((status, index) => (
              <Step key={status} title={status} style={{ cursor: "pointer" }} />
            ))}
          </Steps>
        </div>
        {/* Sản phẩm trong đơn hàng */}
        <div
          style={{
            border: "1px solid #E5E7EB",
            borderRadius: "0.5rem",
            padding: "1rem",
            marginTop: "1rem",
          }}
        >
          <h3 style={{ fontWeight: "600", marginBottom: "0.5rem" }}>
            Sản phẩm trong đơn hàng
          </h3>
          {selectedOrder.orderDetails.map((item) => {
            const defaultImageUrl =
              item.product.images.find((img) => img.isDefault)?.imageUrl ||
              "URL của ảnh mặc định";

            return (
              <div
                key={item._id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1rem",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "1rem" }}
                >
                  <img
                    src={defaultImageUrl}
                    alt={item.product.productName}
                    style={{
                      width: "5rem",
                      height: "5rem",
                      objectFit: "cover",
                      borderRadius: "0.5rem",
                    }}
                  />
                  <div>
                    <p style={{ fontWeight: "600", color: "#1a3353" }}>
                      {item.product.productName}
                    </p>
                    <p style={{ fontSize: "0.875rem", color: "#6B7280" }}>
                      Lựa chọn:{" "}
                      {item.productVariation?.attributeValue || "Không có"}
                    </p>
                  </div>
                </div>
                <div>
                  <p style={{ color: "#6B7280" }}>x{item.quantity}</p>
                  <p style={{ fontWeight: "600", color: "#1a3353" }}>
                    {formatCurrency(item.price)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tóm tắt đơn hàng */}
        <div
          style={{
            border: "1px solid #E5E7EB",
            borderRadius: "0.5rem",
            padding: "1rem",
            marginTop: "1rem",
          }}
        >
          <h3 style={{ fontWeight: "600", marginBottom: "0.5rem" }}>
            Tóm tắt đơn hàng
          </h3>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "0.5rem",
            }}
          >
            <p>Tổng tiền</p>
            <p style={{ color: "#1a3353" }}>
              {formatCurrency(
                selectedOrder.totalPrice / (1 - selectedOrder.discount / 100)
              )}
            </p>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "0.5rem",
            }}
          >
            <p>Giảm giá</p>
            {selectedOrder.discount ? (
              <p style={{ color: "#1a3353" }}>
                -{" "}
                {formatCurrency(
                  (selectedOrder.totalPrice /
                    (1 - selectedOrder.discount / 100)) *
                    (selectedOrder.discount / 100)
                )}
              </p>
            ) : (
              <p>Không có</p>
            )}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontWeight: "bold",
              fontSize: "1.125rem",
            }}
          >
            <p>Tổng đơn hàng</p>
            <p style={{ color: "#1a3353" }}>
              {formatCurrency(selectedOrder.totalPrice)}
            </p>
          </div>
        </div>

        {/* Thông tin khách hàng */}
        <div
          style={{
            display: "flex",
            gap: "1rem", // Khoảng cách giữa hai thẻ div
            marginTop: "1rem",
          }}
        >
          <div
            style={{
              flex: 1,
              border: "1px solid #E5E7EB",
              borderRadius: "0.5rem",
              padding: "1rem",
            }}
          >
            <h3 style={{ fontWeight: "600", marginBottom: "0.5rem" }}>
              Thông tin khách hàng
            </h3>
            <div>
              <p style={{ color: "#1a3353" }}>
                <strong>Khách hàng:</strong> {selectedOrder.user.fullName}
              </p>
              <p style={{ color: "#1a3353" }}>
                <strong>Email:</strong> {selectedOrder.user.email}
              </p>
              <p style={{ color: "#1a3353" }}>
                <strong>Số điện thoại:</strong>{" "}
                {selectedOrder.user.phoneNumber || "Không có số điện thoại"}
              </p>
            </div>
          </div>
          <div
            style={{
              flex: 1,
              border: "1px solid #E5E7EB",
              borderRadius: "0.5rem",
              padding: "1rem",
            }}
          >
            <h3 style={{ fontWeight: "600", marginBottom: "0.5rem" }}>
              Thông tin người nhận
            </h3>
            <div>
              <p style={{ color: "#1a3353" }}>
                <strong>Khách hàng:</strong>{" "}
                {selectedOrder.addressBook.recipientName}
              </p>
              <p style={{ color: "#1a3353" }}>
                <strong>Email:</strong> {selectedOrder.addressBook.email}
              </p>
              <p style={{ color: "#1a3353" }}>
                <strong>Số điện thoại:</strong>{" "}
                {selectedOrder.addressBook.phoneNumber ||
                  "Không có số điện thoại"}
              </p>
              <p style={{ color: "#1a3353" }}>
                <strong>Địa chỉ:</strong> {selectedOrder.addressBook.address},{" "}
                {selectedOrder.addressBook.ward},{" "}
                {selectedOrder.addressBook.district},{" "}
                {selectedOrder.addressBook.city}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default OrderDetailModal;
