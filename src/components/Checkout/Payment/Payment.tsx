import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom"; // Thay useNavigate bằng useHistory
import { HiArrowNarrowLeft } from "react-icons/hi";
import { formatCurrency } from "../../../utils/currencyFormatter";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createOrder } from "../../../services/orderService";
import {
  checkVoucher,
  markVoucherAsUsed,
} from "../../../services/voucherService"; // Import checkVoucher API
import { useDispatch } from "react-redux"; // Thêm import này
import { ActionType } from "../../../redux/actions/actionTypes";
import { createVNPayPayment } from "../../../services/vnpayService"; // Import service của VNPay

interface IProps {
  cart: any;
  back: () => void;
  handlePaymentSubmit: () => void;
  selectedAddress: any;
  setOrderCode: any;
}

const Payment: React.FC<IProps> = (props) => {
  const dispatch = useDispatch();
  const history = useHistory(); // Sử dụng useHistory cho react-router-dom v5
  const [showCodContent, setShowCodContent] = useState<boolean>(true);
  const [showPaypalContent, setShowPaypalContent] = useState<boolean>(false);
  const [showVNPayContent, setShowVNPayContent] = useState<boolean>(false); // Thêm state cho VNPay
  const [voucherCode, setVoucherCode] = useState<string>(""); // State để lưu mã voucher
  const [discount, setDiscount] = useState<number>(0); // State để lưu giá trị giảm giá
  const [voucherMessage, setVoucherMessage] = useState<string>(""); // State để lưu thông báo mã voucher
  const [voucherId, setVoucherId] = useState<number | null>(null); // Thêm state để lưu voucherId
  const { cart } = props;

  // Giả định tỉ lệ chuyển đổi từ VND sang USD
  const exchangeRate = 24000; // 1 USD = 24,000 VND
  const generateOrderCode = (): string => {
    const randomNumber = Math.floor(10000000 + Math.random() * 90000000); // Tạo mã 8 số ngẫu nhiên
    return `ORD${randomNumber}`;
  };
  const calculateDiscountedPrice = (product: any) => {
    const priceToUse = product.selectedPrice
      ? product.selectedPrice
      : product.price;
    const discountedPrice = product.discount
      ? priceToUse - (priceToUse * product.discount) / 100
      : priceToUse;
    return discountedPrice;
  };

  const handleVNPayPayment = async () => {
    try {
      const orderCode = generateOrderCode();
      const REACT_APP_URL = process.env.REACT_APP_URL || "";
      const finalPrice = discount ? discountedPrice : totalPriceVND;
      // Gọi API tạo thanh toán VNPay
      const response = await createVNPayPayment(
        finalPrice,
        orderCode,
        REACT_APP_URL
      );

      if (response) {
        // Điều hướng tới URL thanh toán VNPay trả về
        window.location.href = response; // Điều hướng người dùng tới trang thanh toán
      } else {
        toast.error("Lỗi tạo thanh toán VNPay");
      }
    } catch (error) {
      console.error("Error creating VNPay payment:", error);
      toast.error("Lỗi khi tạo thanh toán VNPay.");
    }
  };

  const handlePaymentSubmit = async (method: string) => {
    try {
      const orderCode = generateOrderCode();
      const response = await createOrder(
        cart,
        method,
        orderCode,
        props.selectedAddress._id,
        discount
      );
      props.setOrderCode(orderCode);
      toast.success("Đặt hàng thành công");

      // Nếu có voucher, gọi API đánh dấu mã đã sử dụng
      if (voucherId) {
        await markVoucherAsUsed(voucherId);
        toast.success("Mã giảm giá đã được sử dụng");
        localStorage.removeItem("voucher");
      }

      history.push({
        pathname: "/checkoutsuccess",
        state: { orderCode }, // Gửi orderCode qua location.state
      });
      dispatch({ type: ActionType.CLEAR_CART });
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Đã xảy ra lỗi khi đặt hàng.");
    }
  };
  const handleApplyVoucher = async () => {
    try {
      const response = await checkVoucher(voucherCode);
      if (response?.payload) {
        const { discount, isUsed, _id } = response.payload; // Lưu voucherId

        if (isUsed) {
          setVoucherMessage("Mã giảm giá đã được sử dụng.");
        } else {
          setDiscount(discount);
          setVoucherMessage(
            `Đã áp dụng mã giảm giá, bạn tiết kiệm được ${formatCurrency(
              (totalPriceVND * discount) / 100
            )}!`
          );
          setVoucherId(voucherId); // Lưu voucherId vào state

          // Lưu toàn bộ response.payload vào localStorage với tên 'voucher'
          localStorage.setItem("voucher", JSON.stringify(response.payload));
        }
      }
    } catch (error) {
      setVoucherMessage("Mã giảm giá không hợp lệ.");
      console.error("Error applying voucher:", error);
    }
  };

  const handleRemoveVoucher = () => {
    setDiscount(0);
    setVoucherId(null);
    setVoucherCode("");
    localStorage.removeItem("voucher");
    setVoucherMessage("Voucher đã được loại bỏ.");
  };

  const totalPriceVND = cart.reduce(
    (total: number, product: any) =>
      total + calculateDiscountedPrice(product) * product.count,
    0
  );

  const discountedPrice = totalPriceVND - (totalPriceVND * discount) / 100;

  // Chuyển đổi từ VND sang USD
  const totalPriceUSD = discountedPrice / exchangeRate;

  return (
    <div className="checkout-payment">
      <div className="row">
        <div className="col-12">
          <div className="title text-center">
            <h1 style={{ marginTop: "20px" }}>Thanh toán</h1>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-8">
          <div className="checkout-payment-area">
            <div
              style={{
                marginBottom: "20px",
                backgroundColor: "#f9f9f9",
                padding: "20px",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              <h5
                style={{
                  fontSize: "18px",
                  marginBottom: "10px",
                  fontWeight: "600",
                }}
              >
                Áp dụng mã giảm giá
              </h5>
              <input
                type="text"
                placeholder="Nhập mã giảm giá"
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  marginBottom: "10px",
                  fontSize: "16px",
                }}
              />
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="button"
                  style={{
                    backgroundColor: "#d91f28",
                    border: "none",
                    height: "50px",
                    padding: "0 30px",
                    borderRadius: "4px",
                    fontWeight: "600",
                    fontSize: "16px",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    color: "#ffffff",
                  }}
                  onClick={handleApplyVoucher}
                >
                  Áp dụng Voucher
                </button>
                {discount ? (
                  <button
                    type="button"
                    style={{
                      backgroundColor: "#000000",
                      border: "none",
                      height: "50px",
                      padding: "0 30px",
                      borderRadius: "4px",
                      fontWeight: "600",
                      fontSize: "16px",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                      color: "#FFFFFF",
                    }}
                    onClick={handleRemoveVoucher}
                  >
                    Không dùng voucher
                  </button>
                ) : null}
              </div>
              <p
                style={{
                  color: discount > 0 ? "green" : "red",
                  marginTop: "10px",
                }}
              >
                {voucherMessage}
              </p>
            </div>

            {/* Rest of the form for payment methods */}
            <form>
              <div className="payment-methods">
                <h5>Phương thức thanh toán</h5>
                <div className="inputs">
                  {/* Voucher Section */}
                  <div className="row">
                    <div className="col-12">
                      <div className="radio-input-wrapper d-flex align-items-center">
                        <input
                          type="radio"
                          name="paymentMethod"
                          id="cod"
                          checked={showCodContent === true}
                          onChange={() => {
                            setShowCodContent(true);
                            setShowPaypalContent(false);
                            setShowVNPayContent(false);
                          }}
                        />
                        <label
                          htmlFor="cod"
                          style={{ fontWeight: "bold", fontSize: "18px" }}
                        >
                          Thanh toán khi nhận hàng (COD)
                        </label>
                      </div>
                      <div className="radio-input-wrapper d-flex align-items-center">
                        <input
                          type="radio"
                          name="paymentMethod"
                          id="paypalMethod"
                          checked={showPaypalContent === true}
                          onChange={() => {
                            setShowCodContent(false);
                            setShowPaypalContent(true);
                            setShowVNPayContent(false);
                          }}
                        />
                        <label
                          style={{ fontWeight: "bold", fontSize: "18px" }}
                          htmlFor="paypalMethod"
                        >
                          PayPal
                        </label>
                      </div>
                      <div className="radio-input-wrapper d-flex align-items-center">
                        <input
                          type="radio"
                          name="paymentMethod"
                          id="vnpayMethod"
                          checked={showVNPayContent === true}
                          onChange={() => {
                            setShowCodContent(false);
                            setShowPaypalContent(false);
                            setShowVNPayContent(true);
                          }}
                        />
                        <label
                          style={{ fontWeight: "bold", fontSize: "18px" }}
                          htmlFor="vnpayMethod"
                        >
                          VNPay
                        </label>
                      </div>
                    </div>
                    <div className="col-12">
                      {/* === COD === */}
                      <div className={showCodContent ? "for-cod" : "d-none"}>
                        <div className="submit-btn-wrapper">
                          <button
                            type="button"
                            style={{
                              backgroundColor: "#d91f28",
                              color: "#ffffff",
                              border: "0",
                              height: "50px",
                              padding: "0 30px",
                              borderRadius: "4px",
                              fontWeight: "600",
                              fontSize: "16px",
                              transition: "all 0.3s ease",
                              cursor: "pointer",
                            }}
                            onClick={() => handlePaymentSubmit("COD")}
                          >
                            Thanh toán khi nhận hàng
                          </button>
                        </div>
                      </div>

                      {/* === Paypal === */}
                      <div
                        className={showPaypalContent ? "for-paypal" : "d-none"}
                      >
                        <PayPalScriptProvider
                          options={{
                            clientId: process.env.REACT_APP_PAYPAL_CLIENT_ID!,
                          }}
                        >
                          <PayPalButtons
                            style={{ layout: "vertical" }}
                            createOrder={(data, actions) => {
                              // Kiểm tra nếu actions.order tồn tại
                              if (actions && actions.order) {
                                return actions.order.create({
                                  intent: "CAPTURE",
                                  purchase_units: [
                                    {
                                      amount: {
                                        currency_code: "USD",
                                        value: totalPriceUSD.toFixed(2),
                                      },
                                    },
                                  ],
                                });
                              }
                              return Promise.reject(
                                new Error("Order creation failed")
                              );
                            }}
                            onApprove={async (data, actions) => {
                              if (actions && actions.order) {
                                try {
                                  const details = await actions.order.capture();
                                  const givenName =
                                    details?.payer?.name?.given_name ||
                                    "Khách hàng";
                                  handlePaymentSubmit("Paypal");
                                  toast.success(
                                    `Giao dịch thành công! Xin chào, ${givenName}`
                                  );
                                } catch (error) {
                                  console.error(
                                    "Lỗi khi hoàn thành thanh toán:",
                                    error
                                  );
                                  toast.error("Lỗi khi hoàn thành thanh toán.");
                                }
                              } else {
                                return Promise.reject(
                                  new Error("Order capture failed")
                                );
                              }
                            }}
                            onError={(err) => {
                              console.error("Lỗi khi thanh toán PayPal:", err);
                              toast.error("Lỗi khi thanh toán PayPal.");
                            }}
                          />
                        </PayPalScriptProvider>
                      </div>

                      {/* === VNPay === */}
                      <div
                        className={showVNPayContent ? "for-vnpay" : "d-none"}
                      >
                        <div className="submit-btn-wrapper">
                          <button
                            type="button"
                            style={{
                              backgroundColor: "#d91f28",
                              color: "#ffffff",
                              border: "0",
                              height: "50px",
                              padding: "0 30px",
                              borderRadius: "4px",
                              fontWeight: "600",
                              fontSize: "16px",
                              transition: "all 0.3s ease",
                              cursor: "pointer",
                            }}
                            onClick={handleVNPayPayment} // Gọi hàm thanh toán VNPay
                          >
                            Thanh toán qua VNPay
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="cart-totals-and-orders">
            {/* === top === */}
            <div className="top d-flex justify-content-between">
              <h6>SẢN PHẨM</h6>
              <h6>TỔNG</h6>
            </div>
            {/* === body === */}
            <div className="body">
              <ul>
                {cart.map((product: any) => (
                  <li
                    key={product._id}
                    className="d-flex justify-content-between"
                  >
                    <div className="left">
                      <Link to={`/product-details/${product._id}`}>
                        <p className="title">{product.productName}</p>
                        <p className="count text-muted">
                          Số lượng:
                          <span> {product.count}</span>
                        </p>
                      </Link>
                    </div>
                    <div className="right d-flex">
                      <p>
                        {formatCurrency(
                          calculateDiscountedPrice(product) * product.count
                        )}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            {/* === bottom === */}
            <div className="bottom">
              <div className="subtotal d-flex justify-content-between">
                <h6>TẠM TÍNH</h6>
                <div className="price d-flex">
                  <p>{formatCurrency(totalPriceVND)}</p>
                </div>
              </div>
              {discount > 0 && (
                <div className="subtotal d-flex justify-content-between">
                  <h6>GIẢM GIÁ</h6>
                  <div className="price d-flex">
                    <p>- {formatCurrency((totalPriceVND * discount) / 100)}</p>
                  </div>
                </div>
              )}
              <div className="total d-flex justify-content-between">
                <h6>TỔNG</h6>
                <div className="price d-flex">
                  <p>{formatCurrency(discountedPrice)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
      <div className="row">
        <div className="col-12">
          <div className="bottom-links d-flex">
            <button
              type="button"
              className="d-flex align-items-center"
              onClick={() => props.back()}
            >
              <span>
                <HiArrowNarrowLeft />
              </span>
              <p>Quay lại bước vận chuyển</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
