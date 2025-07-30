import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Spin } from "antd"; // Bỏ message khỏi import
import { Editor } from "@tinymce/tinymce-react"; // Import TinyMCE
import { createNews } from "services/newService"; // Import hàm gọi API

const CreateNewModal = ({ visible, onCancel, refreshNews }) => {
  const [form] = Form.useForm();
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(
    "https://via.placeholder.com/150" // URL hình ảnh mặc định
  ); // State để lưu trữ URL hình ảnh
  const [loading, setLoading] = useState(false); // Thêm state để quản lý loading
  const [content, setContent] = useState(""); // State để lưu nội dung HTML
  const [contentError, setContentError] = useState(""); // State để lưu thông báo lỗi nội dung

  useEffect(() => {
    if (!visible) {
      setContent(""); // Reset nội dung khi modal đóng
      setContentError(""); // Reset thông báo lỗi khi modal đóng
    }
  }, [visible]);

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

    // Kiểm tra nội dung
    if (!content) {
      setContentError("Vui lòng nhập nội dung!");
      return; // Nếu không có nội dung, không thực hiện tiếp
    } else {
      setContentError(""); // Reset thông báo lỗi nếu có nội dung
    }

    // Bắt đầu loading
    setLoading(true);

    // Gọi API tạo tin tức
    try {
      await createNews(values.title, content, imageFile); // Sử dụng content
      refreshNews(); // Gọi lại để cập nhật danh sách tin tức
      form.resetFields();
      setImageFile(null);
      setImagePreviewUrl("https://via.placeholder.com/150"); // Reset preview URL
      setContent(""); // Reset nội dung
      onCancel(); // Đóng modal sau khi thành công
    } catch (error) {
      setContentError("Thêm tin tức thất bại, vui lòng thử lại!"); // Cập nhật thông báo lỗi
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
      title="Thêm Mới Tin Tức"
      okText="Thêm"
      cancelText="Hủy"
      onCancel={onCancel}
      onOk={() => form.submit()}
      getPopupContainer={(trigger) => trigger.parentNode} // Đặt getPopupContainer
      width={800}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="title"
          label="Tiêu Đề"
          rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="content" label="Nội Dung" required>
          <Editor
            apiKey="igjpx91ezhzid8fokbcr4lo6ptz5ak4icvy0f9b6auggb44g" // Thay thế YOUR_API_KEY bằng API key của bạn
            value={content}
            onEditorChange={setContent} // Cập nhật nội dung
            init={{
              height: 300,
              menubar: false,
              plugins: [
                "lists link image charmap print preview anchor",
                "searchreplace visualblocks code fullscreen",
                "insertdatetime media table paste code help wordcount",
              ],
              toolbar:
                "undo redo | styleselect | bold italic | link image | bullist numlist",
            }}
          />
          {contentError && <p style={{ color: "red" }}>{contentError}</p>}{" "}
          {/* Hiển thị thông báo lỗi dưới Editor */}
        </Form.Item>
        <Form.Item
          name="image"
          label="Hình Ảnh"
          rules={[{ required: true, message: "Vui lòng chọn hình ảnh!" }]}
        >
          <Input
            type="file"
            onChange={handleImageChange}
            accept=".jpg,.jpeg,.png"
            style={{ display: "block" }}
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

export default CreateNewModal;
