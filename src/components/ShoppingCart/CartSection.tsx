import React from "react";
import CartTable from "./CartTable";
import CartTotals from "./CartTotals";
import { HiArrowNarrowLeft } from "react-icons/hi";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/reducers/index";

const CartSection: React.FC = () => {
  const cartState = useSelector((state: RootState) => state.cart);
  const cart = cartState.cart;

  return (
    <section id="cart-section">
      <div className="container">
        <div className="row">
          <div className="col-12">
            {/* ======= Tiêu đề ======= */}
            <div className="title text-center">
              <h1>Giỏ hàng</h1>
            </div>
          </div>
        </div>
        {cart.length > 0 ? (
          <>
            <div className="row">
              <div className="col-12">
                {/* ======= Bảng giỏ hàng ======= */}
                <CartTable cart={cart} />
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6">
                {/* ======= Quay lại cửa hàng ======= */}
                <div className="back-to-shop-link">
                  <Link to="/shop" className="d-flex align-items-center">
                    <span>
                      <HiArrowNarrowLeft color="#ffffff" />
                    </span>
                    <p className="m-0" style={{ color: "#ffffff" }}>
                      Quay lại
                    </p>
                  </Link>
                </div>
              </div>
              <div className="col-lg-6">
                {/* ======= Tổng giỏ hàng ======= */}
                <div className="cart-totals-wrapper">
                  <CartTotals cart={cart} />
                </div>
              </div>
            </div>
          </>
        ) : (
          // ======= Thông báo giỏ hàng trống ======= //
          <>
            <div className="empty-alert-wrapper">
              <p>Giỏ hàng của bạn đang trống.</p>
            </div>
            <div className="back-to-shop-link">
              <Link to="/shop" className="d-flex align-items-center">
                <span>
                  <HiArrowNarrowLeft />
                </span>
                <p className="m-0">Quay lại</p>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default CartSection;
