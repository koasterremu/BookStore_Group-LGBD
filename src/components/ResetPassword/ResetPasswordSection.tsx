import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Đừng quên import CSS của toastify
import { resetPassword } from "../../services/authService"; // Import hàm resetPassword

// Khởi tạo toast cho toàn bộ ứng dụng
toast.configure();

const ResetPasswordSection: React.FC = () => {
  const [loading, setLoading] = useState(false); // Quản lý trạng thái loading
  const history = useHistory(); // Dùng để chuyển hướng trang sau khi đăng nhập thành công
  const location = useLocation(); // Lấy token từ URL

  // Lấy token từ query params
  const token = new URLSearchParams(location.search).get("token");

  // Schema xác thực đầu vào
  const validationSchema = Yup.object().shape({
    newPassword: Yup.string()
      .required("Mật khẩu mới là bắt buộc")
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirmNewPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], "Mật khẩu xác nhận không khớp")
      .required("Xác nhận mật khẩu là bắt buộc"),
  });

  const formOptions = { resolver: yupResolver(validationSchema) };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm(formOptions);

  // Hàm xử lý khi submit form
  const handleResetPassword = async (data: any) => {
    const { newPassword } = data;

    if (!token) {
      toast.error("Token không hợp lệ hoặc đã hết hạn.");
      return;
    }

    setLoading(true); // Bật trạng thái loading cho nút thay đổi mật khẩu
    try {
      console.log(token);
      // Gọi API resetPassword
      const result = await resetPassword(token, newPassword);

      // Hiển thị thông báo thành công
      toast.success("Mật khẩu của bạn đã được cập nhật thành công.");

      // Chuyển hướng về trang đăng nhập
      history.push("/login");
    } catch (error) {
      // Hiển thị toast thông báo lỗi
      toast.error("Đặt lại mật khẩu không thành công. Vui lòng thử lại.");
    } finally {
      setLoading(false); // Tắt trạng thái loading sau khi hoàn tất
    }
  };

  return (
    <section id="login">
      <div className="container">
        <div className="row">
          <div className="col-xl-6 col-lg-6 col-md-8 offset-xl-3 offset-lg-3 offset-md-2">
            <div className="login-area account-wrapper">
              <h6>Thay đổi mật khẩu</h6>
              <form onSubmit={handleSubmit(handleResetPassword)}>
                <div className="inputs-wrapper w-100">
                  <input
                    type="password"
                    className={`w-100 ${
                      errors.newPassword ? "error-border" : ""
                    }`}
                    placeholder="Mật khẩu mới"
                    {...register("newPassword")}
                  />
                  {errors.newPassword && <p>{errors.newPassword.message}</p>}
                </div>
                <div className="inputs-wrapper w-100">
                  <input
                    type="password"
                    className={`w-100 ${
                      errors.confirmNewPassword ? "error-border" : ""
                    }`}
                    placeholder="Xác nhận mật khẩu mới"
                    {...register("confirmNewPassword")}
                  />
                  {errors.confirmNewPassword && (
                    <p>{errors.confirmNewPassword.message}</p>
                  )}
                </div>
                <div className="submit-btn reset-password">
                  <input
                    type="submit"
                    className="w-100 text-white"
                    value={loading ? "Đang xử lý..." : "Thay đổi mật khẩu"}
                    disabled={loading}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResetPasswordSection;
