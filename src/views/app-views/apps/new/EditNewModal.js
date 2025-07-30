import React, { useEffect, useState } from "react";
import { Modal, Form, Input, message, Spin } from "antd"; // Import các thành phần cần thiết
import { Editor } from "@tinymce/tinymce-react"; // Import TinyMCE
import { updateNews } from "services/newService"; // Import hàm gọi API

const EditNewModal = ({ visible, newsData, onCancel, refreshNews }) => {
  const [form] = Form.useForm();
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null); // State để lưu trữ URL hình ảnh
  const [loading, setLoading] = useState(false); // Thêm state để quản lý loading
  const [content, setContent] = useState(""); // State để lưu nội dung HTML
  const [contentError, setContentError] = useState(""); // State để lưu thông báo lỗi nội dung

  useEffect(() => {
    if (newsData) {
      form.setFieldsValue({
        title: newsData.title,
        description: newsData.description,
      });
      setImagePreviewUrl(newsData.image); // Set URL cho ảnh hiện tại
      setContent(newsData.content); // Set nội dung hiện tại
    }
  }, [newsData, form]);

  useEffect(() => {
    if (visible) {
      setContentError(""); // Reset thông báo lỗi khi modal mở
    }
  }, [visible]);

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

    // Kiểm tra nội dung
    if (!content) {
      setContentError("Vui lòng nhập nội dung!");
      setLoading(false);
      return; // Nếu không có nội dung, không thực hiện tiếp
    } else {
      setContentError(""); // Reset thông báo lỗi nếu có nội dung
    }

    // Gọi API cập nhật tin tức
    try {
      await updateNews(
        newsData._id, // ID của tin tức cần cập nhật
        values.title,
        content, // Nội dung từ Editor
        imageFile
      );
      message.success("Chỉnh sửa tin tức thành công.");
      refreshNews(); // Gọi lại để cập nhật danh sách tin tức
      form.resetFields();
      setImageFile(null); // Reset imageFile sau khi thành công
      setImagePreviewUrl(null); // Reset preview URL
      setContent(""); // Reset nội dung
      onCancel(); // Đóng modal sau khi thành công
    } catch (error) {
      message.error("Lỗi khi chỉnh sửa tin tức.");
      console.error("Error updating news:", error);
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
      title="Chỉnh Sửa Tin Tức"
      okText="Lưu"
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
        <Form.Item
          name="content"
          label="Nội Dung"
        >
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

export default EditNewModal;
