import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { updateProfile } from "../../services/userService";
import { Tabs } from "antd";
import PasswordChange from "./PasswordChange";
import AddressBook from "./AddressBook";
import { useSelector, useDispatch } from "react-redux"; // Import useSelector và useDispatch
import { RootState } from "../../redux/reducers"; // Import RootState
import { updateUserProfile } from "../../redux/actions/userActions"; // Import action updateUserProfile

toast.configure();

const ProfileSection: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useDispatch(); // Dispatch action

  // Lấy thông tin người dùng từ Redux
  const userData = useSelector((state: RootState) => state.user.user);

  // Validation schema
  const validationSchema = Yup.object().shape({
    fullName: Yup.string().required("Họ và tên là bắt buộc"),
    email: Yup.string()
      .email("Email không hợp lệ")
      .required("Email là bắt buộc"),
    phoneNumber: Yup.string().required("Số điện thoại là bắt buộc"),
    address: Yup.string().required("Địa chỉ là bắt buộc"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  // Reset form với thông tin từ Redux khi component mount
  useEffect(() => {
    if (userData) {
      setImagePreview(userData.avatar);
      reset({
        username: userData.username,
        fullName: userData.fullName,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        address: userData.address,
      });
    }
  }, [userData, reset]);

  const handleUpdateProfile = async (data: any) => {
    if (!userData) return;
    setIsLoading(true);

    try {
      // Gọi API để cập nhật thông tin người dùng (bao gồm avatar nếu có)
      await updateProfile(userData.userId, data, selectedImage);

      // Hiển thị thông báo thành công
      toast.success(
        "Cập nhật thông tin thành công! Vui lòng đăng nhập lại để làm mới thông tin"
      );

      // Cập nhật thông tin người dùng trong Redux
      dispatch(updateUserProfile({ ...userData, ...data }));
    } catch (error) {
      // Hiển thị thông báo lỗi nếu có lỗi xảy ra
      toast.error("Cập nhật thông tin không thành công. Vui lòng thử lại.");
      console.error("Error updating profile", error);
    } finally {
      // Tắt trạng thái loading
      setIsLoading(false);
    }
  };

  // Hàm xử lý khi người dùng chọn ảnh đại diện mới
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <section
      id="profile"
      style={{ padding: "20px", maxWidth: "700px", margin: "0 auto" }}
    >
      <Tabs
        defaultActiveKey="1"
        tabBarStyle={{ color: "#d91f28" }}
        tabBarGutter={30}
      >
        <Tabs.TabPane tab="Thông tin cá nhân" key="1">
          <div
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "20px",
              }}
            >
              <div
                style={{ cursor: "pointer", position: "relative" }}
                onClick={() => document.getElementById("avatarInput")?.click()}
              >
                <img
                  src={imagePreview || "https://via.placeholder.com/100"}
                  alt="Avatar"
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    border: "2px solid #ccc",
                  }}
                />
                <p
                  style={{
                    marginTop: "10px",
                    color: "#d91f28",
                    fontSize: "14px",
                    textAlign: "center",
                  }}
                >
                  Thay đổi avatar
                </p>
              </div>
            </div>
            <input
              id="avatarInput"
              type="file"
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
            <form onSubmit={handleSubmit(handleUpdateProfile)}>
              <div style={{ marginBottom: "15px" }}>
                <label>Họ và tên</label>
                <input
                  type="text"
                  style={{ width: "100%", padding: "10px" }}
                  {...register("fullName")}
                />
                {errors.fullName && (
                  <p style={{ color: "red", fontSize: "12px" }}>
                    {errors.fullName.message}
                  </p>
                )}
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label>Email</label>
                <input
                  type="email"
                  style={{ width: "100%", padding: "10px" }}
                  {...register("email")}
                />
                {errors.email && (
                  <p style={{ color: "red", fontSize: "12px" }}>
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label>Số điện thoại</label>
                <input
                  type="text"
                  style={{ width: "100%", padding: "10px" }}
                  {...register("phoneNumber")}
                />
                {errors.phoneNumber && (
                  <p style={{ color: "red", fontSize: "12px" }}>
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label>Địa chỉ</label>
                <input
                  type="text"
                  style={{ width: "100%", padding: "10px" }}
                  {...register("address")}
                />
                {errors.address && (
                  <p style={{ color: "red", fontSize: "12px" }}>
                    {errors.address.message}
                  </p>
                )}
              </div>

              <div style={{ textAlign: "center" }}>
                <input
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
                  value={isLoading ? "Đang cập nhật..." : "Cập nhật thông tin"}
                />
              </div>
            </form>
          </div>
        </Tabs.TabPane>

        <Tabs.TabPane tab="Đổi mật khẩu" key="2">
          <PasswordChange userId={userData?.userId} />
        </Tabs.TabPane>

        <Tabs.TabPane tab="Quản lý địa chỉ" key="3">
          <AddressBook userId={userData?.userId} />
        </Tabs.TabPane>
      </Tabs>
    </section>
  );
};

export default ProfileSection;
