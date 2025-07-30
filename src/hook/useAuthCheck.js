// src/hooks/useAuthCheck.js
import { message } from "antd";
import { useEffect, useState } from "react";

const useAuthCheck = () => {
  const [hasNotified, setHasNotified] = useState(false); // Biến trạng thái để theo dõi việc đã thông báo hay chưa

  useEffect(() => {
    const checkTokenExpiration = () => {
      const expiration = localStorage.getItem("token_expiration");
      const currentTime = Date.now();

      if (expiration && currentTime >= expiration && !hasNotified) {
        // Token đã hết hạn và chưa thông báo
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user");
        localStorage.removeItem("token_expiration");
        message.warning("Phiên đăng nhập đã hết hạn vui lòng đăng nhập lại!");
        setHasNotified(true); // Đánh dấu là đã thông báo
      }
    };

    // Kiểm tra ngay khi component mount
    checkTokenExpiration();

    // Kiểm tra sau mỗi 1 phút
    const interval = setInterval(checkTokenExpiration, 60 * 1000);

    // Dọn dẹp interval khi component unmount
    return () => clearInterval(interval);
  }, [hasNotified]); // Thêm hasNotified vào dependency array
};

export default useAuthCheck;
