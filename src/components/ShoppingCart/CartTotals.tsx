import React from "react";
import { IProducts, ICartProps } from "../../types/types";
import { Link } from "react-router-dom";
import { toast } from "react-toastify"; // Import toast để hiển thị thông báo
import { formatCurrency } from "../../utils/currencyFormatter";
import { useSelector } from "react-redux"; // Import useSelector từ Redux
import { RootState } from "../../redux/reducers"; // Import RootState để lấy kiểu của Redux store

const CartTotals: React.FC<ICartProps> = (props) => {
  const { cart } = props;

  // Lấy trạng thái người dùng từ Redux
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );

  // Tính tổng giá ban đầu và tổng số tiền giảm giá
  const { totalPrice, totalDiscount } = cart.reduce(
    (acc: any, product: any) => {
      const originalPrice = product.selectedPrice || product.price;
      const discountAmount = originalPrice * (product.discount / 100) || 0;
      acc.totalPrice += originalPrice * product.count;
      acc.totalDiscount += discountAmount * product.count;
      return acc;
    },
    { totalPrice: 0, totalDiscount: 0 }
  );

  // Tính tổng tiền cuối cùng sau khi giảm giá
  const finalTotal = totalPrice - totalDiscount;

  // Hàm xử lý khi nhấn vào Link
  const handleCheckout = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    if (!isAuthenticated) {
      // Kiểm tra trạng thái đăng nhập từ Redux
      e.preventDefault(); // Ngăn điều hướng nếu chưa có user
      toast.warning("Bạn cần đăng nhập tài khoản để mua hàng"); // Hiển thị cảnh báo nếu chưa đăng nhập
    }
  };

  return (
    <div className="cart-totals">
      <div className="cart-totals-content">
        {/* ======= Tiêu đề ======= */}
        <div className="cart-totals-title">
          <h4>Tổng giỏ hàng</h4>
        </div>
        {/* ======= Tổng giá ban đầu ======= */}
        <div
          style={{ marginBottom: "10px" }}
          className="discount price d-flex justify-content-between align-items-center"
        >
          <h6>Giá ban đầu</h6>
          <p>
            <span>{formatCurrency(totalPrice, "VND")}</span>
          </p>
        </div>
        {/* ======= Số tiền giảm giá ======= */}
        <div
          style={{ marginBottom: "10px" }}
          className="discount price d-flex justify-content-between align-items-center"
        >
          <h6>Giảm giá</h6>
          <p>
            <span>-{formatCurrency(totalDiscount, "VND")}</span>
          </p>
        </div>
        {/* ======= Tổng số tiền sau khi giảm giá ======= */}
        <div className="grand-total price d-flex justify-content-between">
          <h5>Tổng tiền</h5>
          <p>
            <span>{formatCurrency(finalTotal, "VND")}</span>
          </p>
        </div>
      </div>
      {/* ======= Nút thanh toán ======= */}
      <div className="checkout-btn">
        <Link
          to="/checkout"
          className="btn-style btn-style-2 text-center w-100"
          onClick={handleCheckout} // Gọi hàm kiểm tra khi nhấn
          style={{ color: "#ffffff" }}
        >
          Thanh toán
        </Link>
      </div>
    </div>
  );
};

export default CartTotals;
