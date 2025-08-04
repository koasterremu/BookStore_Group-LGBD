import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Đừng quên import CSS của toastify
import { forgotPassword } from "../../services/authService"; // Import hàm forgotPassword

// Khởi tạo toast cho toàn bộ ứng dụng
toast.configure();

const ForgotPasswordSection: React.FC = () => {
  const [loading, setLoading] = useState(false); // Quản lý trạng thái loading
  const history = useHistory(); // Dùng để chuyển hướng trang sau khi gửi yêu cầu thành công

  // Schema xác thực đầu vào
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .required("Email là bắt buộc")
      .email("Email không hợp lệ"),
  });

  const formOptions = { resolver: yupResolver(validationSchema) };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm(formOptions);

  // Hàm xử lý khi submit form
  const handleForgotPassword = async (data: any) => {
    const { email } = data;

    setLoading(true); // Bật trạng thái loading cho nút gửi yêu cầu
    try {
      // Gọi API forgotPassword
      const result = await forgotPassword(email);
      if (result === "Email không tồn tại trong hệ thống") {
        toast.error("Email không tồn tại trong hệ thống.");
        return;
      }
      // Hiển thị thông báo thành công
      toast.success("Liên kết đặt lại mật khẩu đã được gửi đến email của bạn.");

      // Chuyển hướng về trang đăng nhập sau khi gửi yêu cầu thành công
      history.push("/login");
    } catch (error) {
      // Hiển thị toast thông báo lỗi
      toast.error("Yêu cầu quên mật khẩu không thành công. Vui lòng thử lại.");
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
              <h6>Quên mật khẩu</h6>
              <form onSubmit={handleSubmit(handleForgotPassword)}>
                <div className="inputs-wrapper w-100">
                  <input
                    type="text"
                    className={`w-100 ${errors.email ? "error-border" : ""}`}
                    placeholder="Email"
                    {...register("email")}
                  />
                  {errors.email && <p>{errors.email.message}</p>}
                </div>

                <div className="submit-btn forgot-password">
                  <input
                    type="submit"
                    className="w-100 text-white"
                    value={loading ? "Đang xử lý..." : "Gửi yêu cầu"}
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

export default ForgotPasswordSection;
