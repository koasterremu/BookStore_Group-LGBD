import React from "react";
import WesterUnionImg from "../../../assets/img/payment/western-union.png";
import CirrusImg from "../../../assets/img/payment/cirrus.png";
import MasterCardImg from "../../../assets/img/payment/master-card.png";
import SkrillImg from "../../../assets/img/payment/skrill.png";
import VisaImg from "../../../assets/img/payment/visa.png";
import { IPayment } from "../../../types/types";

const FooterBottom: React.FC = () => {
  const PaymentData: IPayment[] = [
    {
      id: 1,
      img: "https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-VNPAY-QR.png",
    },
    { id: 2, img: "https://canhme.com/wp-content/uploads/2016/01/Paypal.png" },
    { id: 3, img: MasterCardImg },
    { id: 5, img: VisaImg },
  ];

  return (
    <div className="footer-bottom">
      <div className="row">
        <div className="col-lg-4 col-md-12">
          {/* ======= Copyright ======= */}
          <div className="copyright">
            <p>
              © 2025 Book Story.
              {/* <a href="" target="__blank">
             
              </a> */}
            </p>
          </div>
        </div>
        <div className="col-lg-8 col-md-12">
          {/* ======= Thanh toán ======= */}
          <div className="payment">
            <div className="payment-text">
              <p>Chúng tôi sử dụng thanh toán an toàn cho:</p>
            </div>
            <div className="payment-cards">
              <ul>
                {PaymentData.map((item) => (
                  <li key={item.id}>
                    <img src={item.img} alt="thẻ thanh toán" />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterBottom;
