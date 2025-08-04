import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../redux/reducers/index";
import { DeleteFromCart } from "../../../redux/actions/cartActions";
import { MakeIsInCartFalse } from "../../../redux/actions/productActions";
import { WishlistProductIsInCartFalse } from "../../../redux/actions/wishlistActions";
import { CompareProductIsInCartFalse } from "../../../redux/actions/compareActions";
import { ShowOrHideDropdownCart } from "../../../redux/actions/primaryActions";
import { toast } from "react-toastify";
import { formatCurrency } from "../../../utils/currencyFormatter"; // Hàm format tiền tệ

const DropdownCart: React.FC = () => {
  const cartState = useSelector((state: RootState) => state.cart);
  const primaryState = useSelector((state: RootState) => state.primary);
  const userState = useSelector((state: RootState) => state.user); // Lấy trạng thái user từ Redux
  const cart = cartState.cart;
  const showOrHideDropdCart = primaryState.showOrHideDropdownCart;
  const dispatch = useDispatch();

  // Tính giá sau khi áp dụng discount cho từng sản phẩm
  const calculateDiscountedPrice = (product: any) => {
    const priceToUse = product.selectedPrice || product.price; // Sử dụng selectedPrice nếu có, nếu không thì sử dụng price gốc
    const discountedPrice = product.discount
      ? priceToUse * (1 - product.discount / 100)
      : priceToUse;
    return discountedPrice;
  };

  // Tính tổng giá trị của giỏ hàng (subtotal)
  const totalPrice = cart.reduce(
    (total: number, product: any) =>
      (total += calculateDiscountedPrice(product) * product.count),
    0
  );

  const closeDropdownCart = (e: React.MouseEvent<HTMLAnchorElement>) => {
    dispatch(ShowOrHideDropdownCart());
  };

  // Hàm xử lý khi nhấn nút "Thanh toán"
  const handleCheckout = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!userState.isAuthenticated) {
      // Kiểm tra trạng thái đăng nhập từ Redux
      e.preventDefault(); // Ngăn điều hướng nếu chưa đăng nhập
      toast.warning("Bạn cần đăng nhập tài khoản để mua hàng"); // Hiển thị cảnh báo nếu chưa đăng nhập
    }
  };

  return (
    <div
      className={
        showOrHideDropdCart
          ? "dropdownCart-wrapper show-dropdownCart"
          : "dropdownCart-wrapper"
      }
    >
      <div className="dropdownCart">
        {cart.length > 0 ? (
          <>
            {/* ======= Bảng giỏ hàng ======= */}
            <table>
              <tbody className="table-body">
                {cart.map((product: any) => (
                  <tr key={product._id}>
                    <td>
                      {/* ======= Nút xoá ======= */}
                      <div className="remove-btn">
                        <button
                          type="button"
                          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                            dispatch(DeleteFromCart(product._id));
                            dispatch(MakeIsInCartFalse(product._id));
                            dispatch(
                              WishlistProductIsInCartFalse(product._id)
                            );
                            dispatch(
                              CompareProductIsInCartFalse(product._id)
                            );
                            toast.error(
                              '"' +
                                product.productName +
                                '" đã được xoá khỏi giỏ hàng.'
                            );
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    </td>
                    <td>
                      {/* ======= Hình ảnh sản phẩm ======= */}
                      <div className="product-img">
                        <Link
                          to={`/product-details/${product._id}`}
                          onClick={closeDropdownCart}
                        >
                          <div className="img-wrapper">
                            <img
                              className="img-fluid"
                              src={product.images[0]?.imageUrl}
                              alt={product.productName}
                            />
                          </div>
                        </Link>
                      </div>
                    </td>
                    <td>
                      <ul className="d-flex flex-column align-items-start">
                        {/* ======= Tên sản phẩm ======= */}
                        <li>
                          <h6 className="product-title">
                            <Link
                              style={{ color: "#d91f28" }}
                              to={`/product-details/${product._id}`}
                              onClick={closeDropdownCart}
                            >
                              {product.productName}
                            </Link>
                          </h6>
                        </li>
                        {/* ======= Biến thể đã chọn ======= */}
                        <li>
                          <small className="text-muted">
                            Lựa chọn:{" "}
                            {product.selectedAttribute
                              ? product.selectedAttribute
                              : "Không có"}
                          </small>
                        </li>
                        {/* ======= Số lượng và giá ======= */}
                        <li className="count-and-price">
                          <small className="d-flex">
                            <p className="total-price price d-flex align-items-center">
                              <span>
                                {/* Hiển thị giá sau khi đã áp dụng giảm giá */}
                                {formatCurrency(
                                  calculateDiscountedPrice(product),
                                  "VND"
                                )}{" "}
                                đ
                              </span>
                            </p>
                            <span className="multiplication">×</span>
                            <span className="book-count">{product.count}</span>
                          </small>
                        </li>
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* ======= Tổng tiền (subtotal) ======= */}
            <div className="total-area">
              <div className="top-content d-flex justify-content-between">
                <h6>Tổng cộng</h6>
                <p>
                  <span>{formatCurrency(totalPrice, "VND")} đ</span>
                </p>
              </div>
              <div className="links d-flex align-items-center justify-content-between">
                <div className="view-cart-btn text-center">
                  <Link to="/cart" onClick={closeDropdownCart}>
                    Xem giỏ hàng
                  </Link>
                </div>
                <div className="checkout-btn d-flex">
                  <Link
                    to="/checkout"
                    className="btn-style-2 w-100 text-center"
                    onClick={(e) => {
                      handleCheckout(e);
                      closeDropdownCart(e); // Đóng dropdown sau khi nhấn Thanh Toán
                    }}
                  >
                    Thanh toán
                  </Link>
                </div>
              </div>
            </div>
          </>
        ) : (
          // ======= Thông báo giỏ hàng trống ======= //
          <div className="empty-cart">
            <div className="alert-text text-center">
              <p className="paragraph mb-1">Giỏ hàng hiện đang trống.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DropdownCart;
