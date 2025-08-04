import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import HistorySection from "../components/History/HistorySection";

const History: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="login-content">
      <div className="main">
        {/* ===== breadcrumb ===== */}
        <section id="breadcrumb">
          <div className="container">
            <ul className="breadcrumb-content d-flex m-0 p-0">
              <li>
                <Link to="/">Trang chủ</Link>
              </li>
              <li>
                <span>Lịch sử mua hàng</span>
              </li>
            </ul>
          </div>
        </section>
        {/* ===== content ===== */}
        <HistorySection />
      </div>
    </div>
  );
};

export default History;
