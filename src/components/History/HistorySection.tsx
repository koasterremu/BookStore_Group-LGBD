import React, { useState, useEffect } from "react";
import { Tag, Table, Avatar, message, Modal, Button } from "antd";
import { getOrdersByUserId } from "../../services/orderService";
import { formatCurrency } from "../../utils/currencyFormatter";
import { useSelector } from "react-redux"; // Import useSelector từ Redux
import { RootState } from "../../redux/reducers"; // Import RootState để lấy kiểu của Redux store

const HistorySection: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalElements: 0,
    limit: 5,
  });
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Lấy thông tin người dùng từ Redux store
  const user = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    const fetchUserOrders = async (currentPage = 1, limit = 5) => {
      if (user && user.userId) {
        const userId = user.userId;
        setLoading(true);
        try {
          const { content, page, totalPages, totalElements } =
            await getOrdersByUserId(userId, currentPage, limit);
          setOrders(content);
          setPagination({
            page,
            totalPages,
            totalElements,
            limit,
          });
        } catch (error: any) {
          message.error("Không thể lấy thông tin đơn hàng: " + error.message);
        } finally {
          setLoading(false);
        }
      } else {
        message.warning("Không tìm thấy thông tin người dùng trong Redux");
      }
    };

    fetchUserOrders(pagination.page, pagination.limit);
  }, [pagination.page, pagination.limit, user]);

  const generateStatus = (status: string) => {
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

  const columns = [
    {
      title: "Người đặt hàng",
      dataIndex: "addressBook",
      key: "addressBook",
      render: (addressBook: any) => (
        <div className="flex items-center gap-2">
          <span>{addressBook.recipientName}</span>
        </div>
      ),
    },
    {
      title: "Địa chỉ",
      dataIndex: "addressBook",
      key: "address",
      render: (addressBook: any) =>
        `${addressBook.address}, ${addressBook.ward}, ${addressBook.district}, ${addressBook.city}`,
    },
    {
      title: "Số điện thoại",
      dataIndex: "addressBook",
      key: "address",
      render: (addressBook: any) => `${addressBook.phoneNumber}`,
    },
    {
      title: "Email",
      dataIndex: "addressBook",
      key: "address",
      render: (addressBook: any) => `${addressBook.email}`,
    },
    {
      title: "Mã đơn hàng",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Ngày đặt",
      dataIndex: "date",
      key: "date",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (totalPrice: number) => `${formatCurrency(totalPrice)}`,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center" as const,
      render: (status: string) => generateStatus(status),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_: any, record: any) => (
        <Button onClick={() => showOrderDetail(record)}>Xem chi tiết</Button>
      ),
    },
  ];

  const showOrderDetail = (order: any) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  const renderOrderDetails = () => {
    if (!selectedOrder) return null;

    return (
      <div>
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
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Tag color="orange">{selectedOrder.status}</Tag>
          </div>
        </div>
        <p style={{ color: "#6B7280" }}>
          {new Date(selectedOrder.date).toLocaleString()}
        </p>

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
          {selectedOrder.orderDetails.map((item: any) => {
            console.log(item);
            const defaultImageUrl =
              item.product.images.find((img: any) => img.isDefault)?.imageUrl ||
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
                    <p style={{ fontWeight: "600" }}>
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
                  <p style={{ fontWeight: "600" }}>
                    {formatCurrency(item.price)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

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
            <p>
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
              <p>
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
            <p>{formatCurrency(selectedOrder.totalPrice)}</p>
          </div>
        </div>

        <div
          style={{
            border: "1px solid #E5E7EB",
            borderRadius: "0.5rem",
            padding: "1rem",
            marginTop: "1rem",
          }}
        >
          <h3 style={{ fontWeight: "600", marginBottom: "0.5rem" }}>
            Thông tin người nhận
          </h3>
          <div>
            <div>
              <p>
                <strong>Khách hàng:</strong>{" "}
                {selectedOrder.addressBook.recipientName}
              </p>
              <p>
                <strong>Email:</strong> {selectedOrder.addressBook.email}
              </p>
            </div>
            <div>
              <p>
                <strong>Số điện thoại:</strong>{" "}
                {selectedOrder.addressBook.phoneNumber ||
                  "Không có số điện thoại"}
              </p>
            </div>
            <div>
              <p>
                <strong>Địa chỉ:</strong> {selectedOrder.addressBook.address},{" "}
                {selectedOrder.addressBook.ward},{" "}
                {selectedOrder.addressBook.district},{" "}
                {selectedOrder.addressBook.city}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleTableChange = (pagination: any) => {
    setPagination((prev) => ({
      ...prev,
      page: pagination.current,
      limit: pagination.limit,
    }));
  };

  return (
    <div className="max-w-container mx-auto px-4">
      <Table
        columns={columns}
        dataSource={orders}
        rowKey={(record) => record.orderId}
        loading={loading}
        pagination={{
          current: pagination.page,
          pageSize: pagination.limit,
          total: pagination.totalElements,
        }}
        onChange={handleTableChange}
      />
      <Modal
        title="Chi tiết đơn hàng"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={1000}
      >
        {renderOrderDetails()}
      </Modal>
    </div>
  );
};

export default HistorySection;
