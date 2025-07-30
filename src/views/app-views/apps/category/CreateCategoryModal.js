import React, { useState } from "react";
import { Modal, Form, Input, Spin, message } from "antd";
import { createCategory } from "services/categoryService"; // Import hàm gọi API

const CreateCategoryModal = ({ visible, onCancel, refreshCategories }) => {
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

    // Gọi API tạo danh mục
    try {
      await createCategory(values.categoryName, values.description, imageFile);
      refreshCategories(); // Gọi lại để cập nhật danh sách danh mục
      form.resetFields();
      setImageFile(null);
      setImagePreviewUrl("https://via.placeholder.com/150"); // Reset preview URL
      onCancel(); // Đóng modal sau khi thành công
      message.success("Thêm danh mục thành công");
    } catch (error) {
      message.error("Thêm danh mục thất bại");
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
      title="Thêm Mới Danh Mục"
      okText="Thêm"
      cancelText="Hủy"
      onCancel={onCancel}
      onOk={() => form.submit()}
      getPopupContainer={(trigger) => trigger.parentNode} // Đặt getPopupContainer
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="categoryName"
          label="Tên Danh Mục"
          rules={[{ required: true, message: "Vui lòng nhập tên danh mục!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="Mô Tả"
          rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item
          name="image"
          label="Hình Ảnh"
          rules={[{ required: true, message: "Vui lòng chọn hình ảnh!" }]} // Thêm rule cho hình ảnh
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
          alt="Hình Ảnh Xem Trước"
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

export default CreateCategoryModal;
