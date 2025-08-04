import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import ForgotPasswordSection from "../components/ResetPassword/ForgotPasswordSection";

const ForgotPassword: React.FC = () => {
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
                <span>Quên mật khẩu</span>
              </li>
            </ul>
          </div>
        </section>
        {/* ===== content ===== */}
        <ForgotPasswordSection />
      </div>
    </div>
  );
};

export default ForgotPassword;
