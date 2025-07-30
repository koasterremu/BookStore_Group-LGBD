import React, { useState } from "react";
import { Button, Form, Input, message as AntdMessage } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import { login as loginApi } from "services/authService"; // Import API login từ authService
import { jwtDecode } from "jwt-decode"; // Import jwt-decode

const LoginForm = () => {
  let history = useHistory();

  // State management
  const [loading, setLoading] = useState(false); // Quản lý trạng thái loading
  const [showForgetPassword, setShowForgetPassword] = useState(false); // Quản lý trạng thái hiển thị quên mật khẩu

  const onLogin = async (values) => {
    setLoading(true); // Hiển thị trạng thái loading

    try {
      // Gọi API đăng nhập từ authService với username và password
      const response = await loginApi(values.username, values.password);

      // Kiểm tra nếu đăng nhập thành công
      if (response && response.payload) {
        const { jwtToken } = response.payload[0]; // Lấy jwtToken từ payload
        const user = response.payload[1]; // Thông tin người dùng

        // Giải mã JWT để lấy thời gian hết hạn
        const decodedToken = jwtDecode(jwtToken);
        const expirationTime = decodedToken.exp * 1000; // Thời gian hết hạn trong milliseconds
        if (user.role === "CUSTOMER") {
          AntdMessage.warning("Bạn không có quyền truy cập");
          return;
        } else if (user.isDelete) {
          AntdMessage.warning("Tài khoản của bạn đã bị khóa ");
          return;
        }
        // Lưu token và thời gian hết hạn vào localStorage
        localStorage.setItem("auth_token", jwtToken);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token_expiration", expirationTime);

        // Điều hướng tới dashboard sau khi đăng nhập thành công
        history.push("/app/dashboards/default");
        window.location.reload();
        AntdMessage.success("Đăng nhập thành công");
      } else {
        // Hiển thị thông báo nếu không nhận được JWT
        throw new Error("Đăng nhập thất bại");
      }
    } catch (error) {
      console.error("Đăng nhập thất bại", error);
      AntdMessage.error("Đăng nhập thất bại");
    } finally {
      setLoading(false); // Tắt trạng thái loading dù thành công hay thất bại
    }
  };

  const onForgetPasswordClick = () => {
    setShowForgetPassword(!showForgetPassword); // Toggle trạng thái quên mật khẩu
  };

  return (
    <>
      <Form layout="vertical" name="login-form" onFinish={onLogin}>
        <Form.Item
          name="username"
          label="Tên đăng nhập"
          rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập" }]}
        >
          <Input prefix={<UserOutlined className="text-primary" />} />
        </Form.Item>
        <Form.Item
          name="password"
          label={
            <div
              className={`${
                showForgetPassword
                  ? "d-flex justify-content-between w-100 align-items-center"
                  : ""
              }`}
            >
              <span>Mật khẩu</span>
              {showForgetPassword && (
                <span
                  onClick={onForgetPasswordClick}
                  className="cursor-pointer font-size-sm font-weight-normal text-muted"
                >
                  Quên mật khẩu?
                </span>
              )}
            </div>
          }
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
        >
          <Input.Password prefix={<LockOutlined className="text-primary" />} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default LoginForm;
