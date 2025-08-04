import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import ProfileSection from "../components/Profile/ProfileSection";

const Profile: React.FC = () => {
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
                <span>Trang cá nhân</span>
              </li>
            </ul>
          </div>
        </section>
        {/* ===== content ===== */}
        <ProfileSection />
      </div>
    </div>
  );
};

export default Profile;
