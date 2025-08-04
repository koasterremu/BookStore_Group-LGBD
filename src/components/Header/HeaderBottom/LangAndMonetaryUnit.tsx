import React from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/reducers"; // Import RootState từ Redux

const LangAndMonetaryUnit: React.FC = () => {
  const history = useHistory();

  // Lấy trạng thái người dùng từ Redux
  const isUserLoggedIn = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );

  const handleClick = () => {
    if (isUserLoggedIn) {
      history.push("/history"); // Điều hướng tới trang lịch sử đặt hàng
    }
  };

  return (
    <div className="lang-and-monetary-unit">
      <ul>
        {/* Hiển thị mục Lịch sử đặt hàng nếu user đã đăng nhập */}
        {isUserLoggedIn && (
          <li onClick={handleClick} style={{ cursor: "pointer" }}>
            <p style={{ color: "#ffffff" }}>Lịch sử đặt hàng</p>
          </li>
        )}
      </ul>
    </div>
  );
};

export default LangAndMonetaryUnit;
