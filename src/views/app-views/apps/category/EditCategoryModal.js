import React, { useEffect, useState } from "react";
import { Modal, Form, Input, message, Spin } from "antd";
import { updateCategory } from "services/categoryService"; // Import hàm gọi API

const EditCategoryModal = ({
  visible,
  categoryData,
  onEdit,
  onCancel,
  refreshCategories,
}) => {
  const [form] = Form.useForm();
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null); // State để lưu trữ URL hình ảnh
  const [loading, setLoading] = useState(false); // Thêm state để quản lý loading

  useEffect(() => {
    if (categoryData) {
      form.setFieldsValue({
        categoryName: categoryData.categoryName,
        description: categoryData.description,
      });
      setImagePreviewUrl(categoryData.image); // Set URL cho ảnh hiện tại
    }
  }, [categoryData, form]);

  const handleFinish = async (values) => {
    // Bắt đầu loading
    setLoading(true);

    // Kiểm tra xem người dùng có tải lên hình ảnh mới không
    if (!imageFile && !imagePreviewUrl) {
      form.setFields([
        {
          name: "image",
          errors: ["Vui lòng chọn hình ảnh."],
        },
      ]);
      setLoading(false);
      return;
    }

    // Kiểm tra kích thước file hình ảnh
    if (imageFile && imageFile.size > 500 * 1024) {
      form.setFields([
        {
          name: "image",
          errors: ["Kích thước file hình ảnh không được vượt quá 500KB."],
        },
      ]);
      setLoading(false);
      return;
    }

    // Gọi API cập nhật danh mục
    try {
      await updateCategory(
        categoryData._id,
        values.categoryName,
        values.description,
        imageFile
      );
      message.success("Chỉnh sửa danh mục thành công.");
      refreshCategories(); // Gọi lại để cập nhật danh sách danh mục
      form.resetFields();
      setImageFile(null); // Reset imageFile sau khi thành công
      setImagePreviewUrl(null); // Reset preview URL
      onCancel(); // Đóng modal sau khi thành công
    } catch (error) {
      message.error("Lỗi khi chỉnh sửa danh mục.");
      console.error("Error updating category:", error);
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

    // Kiểm tra kích thước file hình ảnh
    if (file.size > 500 * 1024) {
      form.setFields([
        {
          name: "image",
          errors: ["Kích thước file hình ảnh không được vượt quá 500KB."],
        },
      ]);
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
      title="Chỉnh Sửa Danh Mục"
      okText="Lưu"
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
        <Form.Item label="Hình Ảnh" required>
          <Input
            type="file"
            onChange={handleImageChange}
            accept=".jpg,.jpeg,.png" // Chỉ cho phép các định dạng ảnh
            style={{ display: "block" }} // Hiển thị như block để dễ dàng quản lý
          />
          <Form.Item
            name="image"
            style={{ display: "none" }} // Ẩn item này nhưng vẫn cần để sử dụng rule
          >
            <Input />
          </Form.Item>
        </Form.Item>
        {imagePreviewUrl && (
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
        )}
      </Form>
      {loading && <Spin style={{ display: "block", margin: "20px auto" }} />}{" "}
      {/* Thêm spinner */}
    </Modal>
  );
};

export default EditCategoryModal;
