import React, { useEffect, useState } from "react";
import {
  Modal,
  Avatar,
  Table,
  Switch,
  Button,
  Spin,
  Popconfirm,
  Upload,
  notification,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import {
  changeIsDefault,
  deleteProductImages,
  getProductImages,
  createProductImage, // API để tải lên hình ảnh mới
} from "services/productImageService";

const ProductImageModal = ({ visible, onClose, productId }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Fetch images when the modal opens
  useEffect(() => {
    if (visible && productId) {
      fetchProductImages();
    }
  }, [visible, productId]);

  const fetchProductImages = async () => {
    setLoading(true);
    try {
      const response = await getProductImages(productId); // Gọi API để lấy hình ảnh
      setImages(response);
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: "Lỗi khi lấy hình ảnh sản phẩm.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleDefault = async (imageId) => {
    try {
      await changeIsDefault(imageId, true); // Gọi API để thay đổi trạng thái
      notification.success({
        message: "Thành công",
        description: "Đã thay đổi trạng thái mặc định cho hình ảnh.",
      });
      fetchProductImages(); // Refresh the image list
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: "Lỗi khi thay đổi trạng thái mặc định.",
      });
    }
  };

  const handleDeleteImage = async (imageId) => {
    try {
      await deleteProductImages(imageId); // Gọi API để xóa hình ảnh
      notification.success({
        message: "Thành công",
        description: "Đã xóa hình ảnh.",
      });
      fetchProductImages(); // Refresh the image list
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: "Lỗi khi xóa hình ảnh.",
      });
    }
  };

  // Xử lý khi tải lên hình ảnh mới
  const handleUpload = async (file) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      await createProductImage(productId, formData); // Gọi API để upload hình ảnh
      notification.success({
        message: "Thành công",
        description: "Tải ảnh lên thành công.",
      });
      fetchProductImages(); // Làm mới danh sách hình ảnh sau khi upload thành công
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: "Lỗi khi tải ảnh lên.",
      });
    } finally {
      setUploading(false);
    }
  };

  const columns = [
    {
      title: "Hình Ảnh",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (text) => <Avatar src={text} size={80} />,
    },
    {
      title: "Mặc Định",
      dataIndex: "isDefault",
      key: "isDefault",
      render: (isDefault, record) => (
        <Switch
          checked={isDefault}
          onChange={() => handleToggleDefault(record._id)}
        />
      ),
    },
    {
      title: "Hành Động",
      key: "actions",
      render: (_, record) => (
        <Popconfirm
          title="Bạn có chắc muốn xóa hình ảnh này không?"
          onConfirm={() => handleDeleteImage(record._id)}
          okText="Có"
          cancelText="Không"
        >
          <Button type="link" danger>
            Xóa
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <Modal
      title="Hình ảnh sản phẩm"
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      {loading ? (
        <div style={{ textAlign: "center", margin: "20px 0" }}>
          <Spin />
        </div>
      ) : (
        <>
          {/* Bảng danh sách hình ảnh */}
          <Table
            dataSource={images}
            columns={columns}
            rowKey="imageId"
            pagination={false}
          />

          {/* Phần upload hình ảnh mới */}
          <Upload
            customRequest={({ file }) => handleUpload(file)} // Sử dụng customRequest để xử lý upload
            showUploadList={false} // Không hiển thị danh sách file đã upload
          >
            <Button
              icon={<PlusOutlined />}
              type="dashed"
              loading={uploading}
              style={{ marginTop: 16 }}
            >
              Thêm Ảnh Mới
            </Button>
          </Upload>
        </>
      )}
    </Modal>
  );
};

export default ProductImageModal;
