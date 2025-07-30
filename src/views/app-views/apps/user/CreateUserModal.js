import React, { useState } from "react";
import { Modal, Form, Input, Select, Spin, message, notification } from "antd";
import { createUser } from "services/userService"; // Import hàm gọi API

const { Option } = Select;

const CreateUserModal = ({ visible, onCancel, refreshUsers }) => {
  const [form] = Form.useForm();
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(
    "https://via.placeholder.com/150" // URL hình ảnh mặc định
  ); // State để lưu trữ URL hình ảnh
  const [loading, setLoading] = useState(false); // Thêm state để quản lý loading

  const handleFinish = async (values) => {
    // Kiểm tra xem người dùng có tải lên hình ảnh không
    if (!imageFile) {
      return; // Nếu không có file hình ảnh, không thực hiện tiếp
    }

    // Kiểm tra kích thước file hình ảnh
    if (imageFile.size > 500 * 1024) {
      form.setFields([
        {
          name: "image",
          errors: ["Kích thước file hình ảnh không được vượt quá 500KB."],
        },
      ]);
      return;
    }

    // Bắt đầu loading
    setLoading(true);

    // Gọi API tạo người dùng
    try {
      const response = await createUser(values, imageFile);

      // Kiểm tra thông báo từ response message
      const { message: apiMessage } = response;

      if (apiMessage.includes("Username đã tồn tại")) {
        notification.error({
          message: "Lỗi",
          description: "Tên đăng nhập đã tồn tại. Vui lòng chọn tên khác.",
        });
        return;
      } else if (apiMessage.includes("Email đã tồn tại")) {
        notification.error({
          message: "Lỗi",
          description: "Email đã tồn tại. Vui lòng chọn email khác.",
        });
        return;
      } else if (apiMessage.includes("Số điện thoại đã tồn tại")) {
        notification.error({
          message: "Lỗi",
          description: "Số điện thoại đã tồn tại. Vui lòng chọn số khác.",
        });
        return;
      } else if (apiMessage.includes("Tạo người dùng thành công")) {
        // Hiển thị thông báo thành công
        message.success("Thêm người dùng thành công.");
        refreshUsers(); // Gọi lại để cập nhật danh sách người dùng
        form.resetFields();
        setImageFile(null);
        setImagePreviewUrl("https://via.placeholder.com/150"); // Reset preview URL
        onCancel(); // Đóng modal sau khi thành công
      } else {
        message.error("Có lỗi xảy ra khi thêm người dùng");
      }
    } finally {
      // Kết thúc loading
      setLoading(false);
    }
  };

  // Hàm xử lý khi chọn file hình ảnh
  const handleImageChange = (event) => {
    const file = event.target.files[0]; // Lấy file đầu tiên từ input
    const isImage =
      file && (file.type === "image/jpeg" || file.type === "image/png");

    if (!isImage) {
      form.setFields([
        {
          name: "image",
          errors: ["Vui lòng tải lên file ảnh có định dạng .jpg hoặc .png."],
        },
      ]);
      setImageFile(null); // Reset imageFile nếu không hợp lệ
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreviewUrl(reader.result); // Set URL cho preview
    };
    reader.readAsDataURL(file); // Đọc file dưới dạng URL
  };

  return (
    <Modal
      visible={visible}
      title="Thêm Mới Người Dùng"
      okText="Thêm"
      cancelText="Hủy"
      onCancel={onCancel}
      onOk={() => form.submit()}
      getPopupContainer={(trigger) => trigger.parentNode} // Đặt getPopupContainer
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="username"
          label="Tên Đăng Nhập"
          rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="Mật Khẩu"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="fullName"
          label="Họ và Tên"
          rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Vui lòng nhập email!" },
            { type: "email", message: "Email không hợp lệ!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="phoneNumber"
          label="Số Điện Thoại"
          rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="address"
          label="Địa Chỉ"
          rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="role"
          label="Vai Trò"
          rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
        >
          <Select placeholder="Chọn vai trò">
            <Option value="ADMIN">Admin</Option>
            <Option value="STAFF">Nhân viên</Option>
            <Option value="CUSTOMER">Khách hàng</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="image"
          label="Ảnh Đại Diện"
          rules={[{ required: true, message: "Vui lòng chọn ảnh đại diện!" }]}
        >
          <Input
            type="file"
            onChange={handleImageChange}
            accept=".jpg,.jpeg,.png" // Chỉ cho phép các định dạng ảnh
            style={{ display: "block" }} // Hiển thị như block để dễ dàng quản lý
          />
        </Form.Item>
        <img
          src={imagePreviewUrl}
          alt="Ảnh Xem Trước"
          style={{
            width: "50%",
            height: "auto",
            marginTop: "10px",
            borderRadius: "10%",
          }}
        />
      </Form>
      {loading && <Spin style={{ display: "block", margin: "20px auto" }} />}{" "}
      {/* Thêm spinner */}
    </Modal>
  );
};

export default CreateUserModal;
