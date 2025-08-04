import React, { useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { handleVNPayPaymentReturn } from "../services/vnpayService"; // Import hàm xử lý VNPay
import { createOrder } from "../services/orderService";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/reducers/index";
import { ActionType } from "../redux/actions/actionTypes";
import { markVoucherAsUsed } from "../services/voucherService";

const CheckoutVNPay: React.FC = () => {
  const location = useLocation();
  const history = useHistory();
  const cartState = useSelector((state: RootState) => state.cart);
  const cart = cartState.cart;
  const dispatch = useDispatch();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search); // Lấy các tham số trả về từ URL
    const requestParams = Object.fromEntries(queryParams.entries());

    handleVNPayPaymentReturn(requestParams)
      .then((response) => {
        // Kiểm tra trạng thái từ response
        const { status, message } = response;

        switch (status) {
          case "SUCCESS":
            const orderCode = queryParams.get("vnp_OrderInfo") || "";
            handlePaymentSubmit("VNPay", orderCode); // Xử lý tạo đơn hàng
            break;
          case "FAILED":
            toast.error(message || "Giao dịch thất bại."); // Hiển thị message từ response nếu có
            history.push("/"); // Điều hướng về trang chủ
            break;
          case "INVALID":
            toast.error(message || "Giao dịch không hợp lệ.");
            history.push("/"); // Điều hướng về trang chủ
            break;
          default:
            toast.error(message || "Lỗi không xác định.");
            history.push("/"); // Điều hướng về trang chủ
            break;
        }
      })
      .catch((error) => {
        console.error("Error handling VNPay payment return:", error);
        toast.error("Lỗi xử lý thanh toán VNPay.");
        history.push("/"); // Điều hướng về trang chủ nếu lỗi
      });
  }, [location, history]);

  const handlePaymentSubmit = async (method: string, orderCode: string) => {
    try {
      // Lấy selectedAddressBookId từ localStorage và chuyển đổi sang number
      const selectedAddressBookId = localStorage.getItem(
        "selectedAddressBookId"
      );

      if (!selectedAddressBookId) {
        throw new Error("Không tìm thấy địa chỉ giao hàng.");
      }

      const addressBookId = selectedAddressBookId; // Chuyển đổi sang kiểu number

      // Lấy thông tin voucher từ localStorage
      const storedVoucher = localStorage.getItem("voucher");
      let voucherId: string | null = null;
      let discount: number = 0;
      if (storedVoucher) {
        const voucher = JSON.parse(storedVoucher);
        voucherId = voucher._id; // Lấy voucherId từ localStorage
        discount = voucher.discount;
      }

      // Tạo đơn hàng
      const response = await createOrder(
        cart,
        method,
        orderCode,
        addressBookId,
        discount
      );
      toast.success("Đặt hàng thành công");

      // Nếu có voucherId, gọi API để đánh dấu mã giảm giá đã được sử dụng
      if (voucherId) {
        await markVoucherAsUsed(voucherId);
        toast.success("Mã giảm giá đã được sử dụng");

        // Xóa voucher khỏi localStorage sau khi sử dụng
        localStorage.removeItem("voucher");
      }

      // Dispatch action để xóa giỏ hàng
      dispatch({ type: ActionType.CLEAR_CART });

      // Xóa selectedAddressBookId khỏi localStorage sau khi đặt hàng thành công
      localStorage.removeItem("selectedAddressBookId");

      // Chuyển hướng đến trang checkout success
      history.push({
        pathname: "/checkoutsuccess",
        state: { orderCode }, // Gửi orderCode qua location.state
      });
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Đặt hàng thất bại.");
    }
  };

  return <div>Đang xử lý thanh toán...</div>; // Hiển thị trong khi xử lý kết quả
};

export default CheckoutVNPay;
