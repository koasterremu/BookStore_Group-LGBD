import React from "react";
import { HiArrowNarrowLeft } from "react-icons/hi";
import { Link } from "react-router-dom";

interface IProps {
  orderCode: string;
}

const PaymentSuccess: React.FC<IProps> = (props) => {
  return (
    <div className="payment-success">
      <div className="row">
        <div className="col-12">
          <div className="title text-center">
            <h1 style={{ marginTop: "20px" }}>Thanh toán thành công</h1>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-8 offset-lg-2">
          <div className="text">
            <h5>Cảm ơn bạn! Đơn hàng của bạn đang được xử lý.</h5>
            <p>
              Mã đơn hàng của bạn là <strong>{props.orderCode}</strong>
            </p>
            <p>
              Một email sẽ được gửi chứa thông tin về đơn hàng của bạn. Nếu bạn
              có bất kỳ câu hỏi nào về đơn hàng, hãy gửi email cho chúng tôi tại{" "}
              <a href="/#">admin@rhodishop.com</a>
            </p>
          </div>
          <div className="back-to-shop-btn">
            <Link to="/shop" className="d-flex align-items-center">
              <span>
                <HiArrowNarrowLeft />
              </span>
              <p className="m-0">Quay lại</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
