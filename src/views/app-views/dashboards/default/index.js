import React, { useEffect, useState } from "react";
import { Row, Col, Button, Card, Table, DatePicker, message } from "antd";
import StatisticWidget from "components/shared-components/StatisticWidget";
import ChartWidget from "components/shared-components/ChartWidget";

import { getDailyRevenue, getRevunueSumary } from "services/revenueService.js";
import { withRouter } from "react-router-dom";
import { formatCurrency } from "utils/formatCurrency";
import User from "assets/img/teamwork.png";
import Order from "assets/img/shopping-bag.png";
import Product from "assets/img/best-seller.png";
import COD from "assets/img/cash-on-delivery.png";
import moment from "moment"; // Import moment for date formatting
import OrderDetailModal from "views/app-views/apps/order/OrderDetailModal";
import { getAllOrders } from "services/orderService";

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

export const DefaultDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null); // Đơn hàng đã chọn để hiển thị chi tiết
  const [isModalVisible, setIsModalVisible] = useState(false); // Trạng thái modal
  const limit = 5; // Số lượng đơn hàng trên mỗi trang
  const [revenue, setRevenue] = useState(null);
  const [dailyData, setDailyData] = useState(null);
  const [startDate, setStartDate] = useState(
    moment().subtract(1, "months").endOf("month").isAfter(moment())
      ? moment().subtract(1, "months").endOf("month").format("YYYY-MM-DD")
      : moment().subtract(1, "months").format("YYYY-MM-DD")
  );

  const [endDate, setEndDate] = useState(
    moment().add(1, "days").format("YYYY-MM-DD")
  );
  // Default to current date

  const fetchOrders = async () => {
    try {
      const data = await getAllOrders(1, limit); // Gọi API lấy đơn hàng
      setOrders(data.content);
    } catch (error) {
      console.error("Error fetching daily revenue:", error);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const revenueData = await getRevunueSumary();
        setRevenue(revenueData);

        // Gọi API lấy doanh thu hằng ngày ngay khi component mount
        await handleFetchRevenue();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchOrders();
    fetchData(); // Gọi hàm fetchData khi component được mount
  }, []); // Chạy khi component mount, không cần dependencies khác

  const handleFetchRevenue = async () => {
    try {
      const dailyRevenueData = await getDailyRevenue(startDate, endDate);
      setDailyData(dailyRevenueData);
    } catch (error) {
      console.error("Error fetching daily revenue:", error);
    }
  };
  // Hàm xử lý khi nhấn vào "Xem chi tiết"
  const handleViewDetail = (order) => {
    setSelectedOrder(order); // Lưu đơn hàng đã chọn
    setIsModalVisible(true); // Hiển thị modal chi tiết đơn hàng
  };
  const handleCloseModal = () => {
    setIsModalVisible(false); // Ẩn modal
    setSelectedOrder(null); // Xóa đơn hàng đã chọn
  };
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
    <>
      <Row gutter={16}>
        <Col xs={24} sm={24} md={24} lg={24}>
          <Row gutter={16}>
            {/* Displaying Revenue Widgets */}
            <Col xs={24} sm={24} md={24} lg={24} xl={8}>
              <StatisticWidget
                title={"Tổng số sản phẩm"}
                value={`${revenue?.totalProducts} sản phẩm`}
                imgSrc={Product}
              />
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={8}>
              <StatisticWidget
                title={"Tổng số đơn hàng"}
                value={`${revenue?.totalOrders} đơn hàng`}
                imgSrc={Order}
              />
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={8}>
              <StatisticWidget
                title={"Tổng số người dùng"}
                value={`${revenue?.totalUsers} người dùng`}
                imgSrc={User}
              />
            </Col>
          </Row>
          <Row gutter={16}>
            {/* Displaying Revenue Widgets */}
            <Col xs={24} sm={24} md={24} lg={24} xl={8}>
              <StatisticWidget
                title={"Doanh thu hôm nay"}
                value={
                  formatCurrency(revenue?.todayRevenue) ?? formatCurrency(0)
                }
                status={revenue?.todayIncreasePercentage.toFixed(2)}
                subtitle={`So với hôm qua (${formatCurrency(
                  revenue?.yesterdayRevenue
                )})`}
              />
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={8}>
              <StatisticWidget
                title={"Doanh thu tháng này"}
                value={
                  formatCurrency(revenue?.monthlyRevenue) ?? formatCurrency(0)
                }
                status={revenue?.monthlyIncreasePercentage.toFixed(2)}
                subtitle={`So với tháng trước (${formatCurrency(
                  revenue?.lastMonthRevenue
                )})`}
              />
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={8}>
              <StatisticWidget
                title={"Doanh thu năm"}
                value={
                  formatCurrency(revenue?.yearlyRevenue) ?? formatCurrency(0)
                }
                status={revenue?.yearlyIncreasePercentage.toFixed(2)}
                subtitle={`So với năm ngoái (${formatCurrency(
                  revenue?.lastYearRevenue
                )})`}
              />
            </Col>
          </Row>

          {/* Date pickers and button for calculating revenue */}
          <Row gutter={16} style={{ marginBottom: "20px", marginTop: "20px" }}>
            <Col xs={24} sm={12} md={8}>
              <DatePicker
                onChange={(date, dateString) => setStartDate(dateString)}
                value={moment(startDate)}
                format={"YYYY-MM-DD"}
                allowClear={false}
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <DatePicker
                onChange={(date, dateString) => setEndDate(dateString)}
                value={moment(endDate)}
                format={"YYYY-MM-DD"}
                allowClear={false}
              />
            </Col>
            <Col xs={24} sm={24} md={8}>
              <Button type="primary" onClick={handleFetchRevenue}>
                Tính doanh thu
              </Button>
            </Col>
          </Row>

          {/* Chart for Visitors */}
          <Row gutter={16}>
            <Col span={24}>
              <ChartWidget
                title="Doanh thu"
                series={dailyData?.series}
                xAxis={dailyData?.categories}
                height={400}
              />
            </Col>
          </Row>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} sm={24} md={24} lg={24}>
          <Card title="Đơn hàng gần nhất">
            <Table
              columns={columns}
              dataSource={orders}
              pagination={false}
              rowKey={(record) => record.orderId}
            />
          </Card>
        </Col>
      </Row>
      {selectedOrder && (
        <OrderDetailModal
          visible={isModalVisible}
          onClose={handleCloseModal}
          selectedOrder={selectedOrder}
          fetchOrdersData={fetchOrders}
        />
      )}
    </>
  );
};

export default withRouter(DefaultDashboard);
