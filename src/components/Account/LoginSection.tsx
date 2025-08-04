import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SocialMediaData } from "../Other/SocialMediaData";
import { login } from "../../services/authService";
import { useDispatch } from "react-redux"; // Import useDispatch từ redux
import { loginSuccess } from "../../redux/actions/userActions"; // Import loginSuccess

// Khởi tạo toast cho toàn bộ ứng dụng
toast.configure();

const LoginSection: React.FC = () => {
  const [loginLoading, setLoginLoading] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch(); // Khởi tạo useDispatch

  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Tên đăng nhập là bắt buộc"),
    password: Yup.string()
      .required("Mật khẩu là bắt buộc")
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  });

  const formOptions = { resolver: yupResolver(validationSchema) };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm(formOptions);

  const handleLogin = async (data: any) => {
    const { username, password } = data;
    setLoginLoading(true);
    try {
      const result = await login(username, password);
      const { jwtToken } = result.payload[0];
      const user = result.payload[1];

      // Dispatch thông tin user và token vào Redux
      dispatch(loginSuccess(user, jwtToken));

      // Lưu jwtToken vào localStorage (tuỳ chọn nếu bạn muốn lưu trên localStorage)
      localStorage.setItem("auth_token", jwtToken);
      localStorage.setItem("user", JSON.stringify(user));

      if (user.isDelete) {
        toast.warning("Tài khoản của bạn đã bị khóa!");
        return;
      }

      toast.success("Đăng nhập thành công");
      history.push("/");
    } catch (error) {
      toast.error(
        "Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin."
      );
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <section id="login">
      <div className="container">
        <div className="row">
          <div className="col-xl-6 col-lg-6 col-md-8 offset-xl-3 offset-lg-3 offset-md-2">
            <div className="links d-flex justify-content-center">
              <Link to="/login" className="text-dark">
                Đăng nhập
              </Link>
              <Link to="/register" className="text-muted">
                Đăng ký
              </Link>
            </div>
            <div className="login-area account-wrapper">
              <h6>Đăng nhập tài khoản của bạn</h6>
              <form onSubmit={handleSubmit(handleLogin)}>
                <div className="inputs-wrapper w-100">
                  <input
                    type="text"
                    className={`w-100 ${errors.username ? "error-border" : ""}`}
                    placeholder="Tên đăng nhập"
                    {...register("username")}
                  />
                  {errors.username && <p>{errors.username.message}</p>}
                </div>
                <div className="inputs-wrapper w-100">
                  <input
                    type="password"
                    className={`w-100 ${errors.password ? "error-border" : ""}`}
                    placeholder="Mật khẩu"
                    {...register("password")}
                  />
                  {errors.password && <p>{errors.password.message}</p>}
                </div>
                <div className="checkbox-input-wrapper d-flex justify-content-between">
                  <div className="d-flex">
                    <input type="checkbox" name="remember" id="remember" />
                    <label htmlFor="remember">Ghi nhớ tài khoản</label>
                  </div>
                  <Link to="/forgot-password" className="text-muted">
                    Quên mật khẩu?
                  </Link>
                </div>
                <div className="submit-btn login">
                  <input
                    type="submit"
                    style={{ color: "#ffffff" }}
                    className="w-100"
                    value={loginLoading ? "Đang xử lý..." : "Đăng nhập"}
                    disabled={loginLoading}
                  />
                </div>
                <div className="social-media">
                  <small>Kết nối với:</small>
                  <ul className="d-flex">
                    {SocialMediaData.map((item) => (
                      <li key={item.id}>
                        <a href={item.href} className={item.class}>
                          {item.icon}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginSection;
