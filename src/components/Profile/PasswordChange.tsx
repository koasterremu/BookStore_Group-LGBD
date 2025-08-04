import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { changePassword } from "../../services/userService"; // Import hàm changePassword

const PasswordChange: React.FC<{ userId: number }> = ({ userId }) => {
  const [isLoading, setIsLoading] = useState(false);

  // Validation schema
  const validationSchema = Yup.object().shape({
    currentPassword: Yup.string().required("Mật khẩu cũ là bắt buộc"),
    newPassword: Yup.string()
      .required("Mật khẩu mới là bắt buộc")
      .min(6, "Mật khẩu mới phải có ít nhất 6 ký tự"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], "Mật khẩu xác nhận không khớp")
      .required("Xác nhận mật khẩu là bắt buộc"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  // Hàm xử lý khi submit form
  const onSubmit = async (data: any) => {
    setIsLoading(true);

    try {
      // Gọi API đổi mật khẩu
      await changePassword(userId, data.currentPassword, data.newPassword);
      toast.success("Đổi mật khẩu thành công!");
    } catch (error: any) {
      // Kiểm tra xem phản hồi lỗi có tồn tại hay không
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message); // Hiển thị thông báo lỗi từ backend
      } else {
        toast.error("Đã có lỗi xảy ra. Vui lòng thử lại!"); // Thông báo lỗi chung
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h6>Đổi mật khẩu</h6>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ marginBottom: "15px" }}>
          <label>Mật khẩu cũ</label>
          <input
            type="password"
            {...register("currentPassword")}
            style={{ width: "100%", padding: "10px" }}
          />
          {errors.currentPassword && (
            <p style={{ color: "red" }}>{errors.currentPassword.message}</p>
          )}
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Mật khẩu mới</label>
          <input
            type="password"
            {...register("newPassword")}
            style={{ width: "100%", padding: "10px" }}
          />
          {errors.newPassword && (
            <p style={{ color: "red" }}>{errors.newPassword.message}</p>
          )}
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Xác nhận mật khẩu mới</label>
          <input
            type="password"
            {...register("confirmPassword")}
            style={{ width: "100%", padding: "10px" }}
          />
          {errors.confirmPassword && (
            <p style={{ color: "red" }}>{errors.confirmPassword.message}</p>
          )}
        </div>
        <div style={{ textAlign: "center" }}>
          <button
            type="submit"
            disabled={isLoading}
            style={{
              backgroundColor: isLoading ? "#999" : "#d91f28",
              color: "white",
              padding: "10px 20px",
              borderRadius: "5px",
              border: "none",
              cursor: isLoading ? "not-allowed" : "pointer",
              fontSize: "16px",
            }}
          >
            {isLoading ? "Đang xử lý..." : "Cập nhật mật khẩu"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PasswordChange;
