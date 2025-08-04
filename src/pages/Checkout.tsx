import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import ShippingInfo from "../components/Checkout/ShippingInfo/ShippingInfo";
import Payment from "../components/Checkout/Payment/Payment";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/reducers/index";
import { getAddressBooksByUserId } from "../services/addressBookService";
import {
  Typography,
  Select,
  Button,
  Steps,
  Radio,
  List,
  Row,
  Divider,
  Col,
  Input,
} from "antd"; // Import Input từ Ant Design

const { Text } = Typography;
const { Step } = Steps;

const Checkout: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0); // State quản lý step hiện tại
  const [loading, setLoading] = useState(false);
  const [addressList, setAddressList] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [orderCode, setOrderCode] = useState<any>(null);
  const [couponCode, setCouponCode] = useState<string>(""); // State lưu mã giảm giá
  const [discountAmount, setDiscountAmount] = useState<number>(0); // State lưu số tiền giảm giá
  const history = useHistory();
  const cartState = useSelector((state: RootState) => state.cart);
  const cart = cartState.cart;
  const user = useSelector((state: RootState) => state.user.user); // Lấy user từ Redux store
  const dispatch = useDispatch();

  // Fetch địa chỉ giao hàng từ API
  useEffect(() => {
    const fetchAddresses = async () => {
      if (user && user.userId) {
        try {
          const addressData = await getAddressBooksByUserId(user.userId);
          if (addressData && addressData.length > 0) {
            setAddressList(addressData);
            setSelectedAddress(addressData[0]);
            localStorage.setItem(
              "selectedAddressBookId",
              addressData[0]._id
            );
          }
        } catch (error) {
          console.error("Error fetching address:", error);
        }
      } else {
        console.error("User not found in Redux store");
      }
    };

    fetchAddresses();
  }, [user]); // Theo dõi user từ Redux store

  const handleAddressChange = (value: any) => {
    const selectedAddr = addressList.find(
      (addr) => addr._id === value
    );

    if (selectedAddr) {
      setSelectedAddress(selectedAddr);

      // Lưu địa chỉ đã chọn vào localStorage
      localStorage.setItem("selectedAddressBookId", selectedAddr._id);
    }
  };

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handlePaymentSubmit = () => {
    setCurrentStep(currentStep + 1);
  };

  // Hàm kiểm tra và áp dụng mã giảm giá
  const handleApplyCoupon = () => {
    // Giả định mã "DISCOUNT10" sẽ giảm 10%
    if (couponCode === "DISCOUNT10") {
      const totalCartValue = cart.reduce(
        (total: number, product: any) => total + product.price * product.count,
        0
      );
      const discount = totalCartValue * 0.1; // Giảm giá 10%
      setDiscountAmount(discount); // Cập nhật số tiền giảm giá
      alert("Mã giảm giá hợp lệ! Bạn đã được giảm 10%.");
    } else {
      alert("Mã giảm giá không hợp lệ.");
    }
  };

  const steps = [
    {
      title: "Địa chỉ giao hàng",
      content: (
        <>
          <div
            className="address-select-wrapper"
            style={{ marginBottom: "20px" }}
          >
            <div className="row">
              <div className="col-12">
                <div
                  style={{ marginTop: "20px" }}
                  className="title text-center"
                >
                  <h1 style={{ marginTop: "20px" }}>Địa chỉ giao hàng</h1>
                </div>
              </div>
            </div>
            {addressList.length > 0 ? (
              <List
                bordered
                dataSource={addressList}
                renderItem={(address) => (
                  <List.Item
                    style={{
                      padding: "16px 24px",
                      backgroundColor: "#f9f9f9",
                      borderRadius: "8px",
                      marginBottom: "16px",
                    }}
                  >
                    <Row style={{ width: "100%" }} align="middle">
                      <Col span={20}>
                        <Radio
                          value={address._id}
                          checked={
                            selectedAddress?._id ===
                            address._id
                          }
                          onChange={() =>
                            handleAddressChange(address._id)
                          }
                        >
                          <Text strong>{address.recipientName}</Text>
                        </Radio>
                        <Divider type="vertical" />
                        <Text>{`${address.email}`}</Text>
                        <Divider type="vertical" />
                        <Text>{`${address.phoneNumber}`}</Text>
                        <Divider type="vertical" />
                        <Text>{`${address.address}, ${address.ward}, ${address.district}, ${address.city}`}</Text>
                      </Col>
                    </Row>
                  </List.Item>
                )}
              />
            ) : (
              <p>Không có địa chỉ nào.</p>
            )}
            <div style={{ marginTop: "20px" }}>
              <input
                type="submit"
                disabled={selectedAddress ? false : true}
                style={{
                  backgroundColor: "#d91f28",
                  color: "white",
                  padding: "10px 20px",
                  borderRadius: "5px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
                value={"Tiếp tục"}
                onClick={handleNext}
              />
            </div>
          </div>
          <Button
            type="primary"
            style={{
              backgroundColor: "#d91f28",
              borderColor: "#d91f28",
            }}
            onClick={() => history.push("/profile")}
          >
            Thêm địa chỉ giao hàng
          </Button>
        </>
      ),
    },
    {
      title: "Thông tin vận chuyển",
      content: (
        <ShippingInfo
          handleShippingSubmit={handleNext}
          handlePrev={handlePrev}
          selectedAddress={selectedAddress}
        />
      ),
    },
    {
      title: "Thanh toán",
      content: (
        <>
          <Payment
            back={handlePrev}
            cart={cart}
            selectedAddress={selectedAddress}
            handlePaymentSubmit={handlePaymentSubmit}
            setOrderCode={setOrderCode}
          />
        </>
      ),
    },
  ];

  return (
    <div className="checkout-content">
      <div className="main">
        <section id="breadcrumb">
          <div className="container">
            <ul className="breadcrumb-content d-flex m-0 p-0">
              <li>
                <Link to="/">Trang chủ</Link>
              </li>
              <li>
                <span>Thanh toán</span>
              </li>
            </ul>
          </div>
        </section>
        <section id="checkout">
          <div className="container">
            <Steps current={currentStep}>
              {steps.map((item, index) => (
                <Step key={index} title={item.title} />
              ))}
            </Steps>
            <div className="steps-content">{steps[currentStep].content}</div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Checkout;
