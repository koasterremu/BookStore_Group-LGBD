import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  Spin,
  Switch,
  Tabs,
  Upload,
  notification,
  Button,
  Select,
  Row,
  Col,
  message,
} from "antd";
import { createProduct } from "services/productService";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { Editor } from "@tinymce/tinymce-react";

const { TabPane } = Tabs;
const { Option } = Select;

const CreateProductModal = ({
  visible,
  onCancel,
  refreshProducts,
  categories,
  brands,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [variations, setVariations] = useState([]);
  const [content, setContent] = useState("");
  const [contentError, setContentError] = useState("");

  const [isNewProduct, setIsNewProduct] = useState(false);
  const [isSale, setIsSale] = useState(false);
  const [isSpecial, setIsSpecial] = useState(false);

  const handleFinish = async (values) => {
    if (!content) {
      setContentError("Vui lòng nhập mô tả sản phẩm!");
      notification.error({
        message: "Lỗi",
        description: "Vui lòng nhập mô tả sản phẩm!",
      });
      return;
    }

    if (
      variations.some(
        (v) => !v.attributeName || !v.attributeValue || !v.price || !v.quantity
      )
    ) {
      notification.error({
        message: "Lỗi",
        description: "Vui lòng nhập đầy đủ thông tin cho tất cả các biến thể!",
      });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("productName", values.productName);
      formData.append("price", values.price);
      formData.append("description", content);
      formData.append("discount", values.discount ?? "");
      formData.append("badge", values.badge ?? "");
      formData.append("stock", values.stock);
      formData.append("isNewProduct", isNewProduct);
      formData.append("isSale", isSale);
      formData.append("isSpecial", isSpecial);
      formData.append("categoryId", values.categoryId);
      formData.append("brandId", values.brandId);

      if (images) {
        for (let i = 0; i < images.length; i++) {
          formData.append("images", images[i]);
        }
      }

      if (variations && variations.length > 0) {
        formData.append("variations", JSON.stringify(variations));
      }

      await createProduct(formData);
      refreshProducts();
      form.resetFields();
      setImages([]);
      setVariations([]);
      setContent("");
      setContentError("");
      setIsNewProduct(false);
      setIsSale(false);
      setIsSpecial(false);
      onCancel();
      message.success("Thêm sản phẩm thành công");
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: "Thêm sản phẩm thất bại",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (fileList) => {
    // Chỉ lấy những ảnh mới mà không bao gồm những ảnh đã xóa
    const newImages = fileList.map((file) => file.originFileObj);
    setImages(newImages);
  };

  // Hàm xóa ảnh
  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index); // Xóa hình ảnh
    setImages(newImages); // Cập nhật danh sách hình ảnh
  };

  const addVariation = () => {
    const newVariation = {
      attributeName: "",
      attributeValue: "",
      price: "",
      quantity: "",
    };
    setVariations([...variations, newVariation]);
  };

  const removeVariation = (index) => {
    const updatedVariations = variations.filter((_, i) => i !== index);
    setVariations(updatedVariations);
  };

  const handleVariationChange = (index, field, value) => {
    const updatedVariations = [...variations];
    updatedVariations[index][field] = value;
    setVariations(updatedVariations);
  };

  return (
    <Modal
      visible={visible}
      title="Thêm Sản Phẩm Mới"
      okText="Thêm"
      cancelText="Hủy"
      onCancel={onCancel}
      onOk={() => form.submit()}
      getPopupContainer={(trigger) => trigger.parentNode}
      width={800}
    >
      <Spin spinning={loading}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Thông Tin Sản Phẩm" key="1">
            <Form form={form} layout="vertical" onFinish={handleFinish}>
              <Form.Item
                name="productName"
                label="Tên Sản Phẩm"
                rules={[
                  { required: true, message: "Vui lòng nhập tên sản phẩm!" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item label="Mô Tả" required>
                <Editor
                  apiKey="igjpx91ezhzid8fokbcr4lo6ptz5ak4icvy0f9b6auggb44g"
                  value={content}
                  onEditorChange={setContent}
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
                {contentError && <p style={{ color: "red" }}>{contentError}</p>}
              </Form.Item>
              <Form.Item
                name="price"
                label="Giá"
                rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
              >
                <Input type="number" />
              </Form.Item>
              <Form.Item name="discount" label="Giảm Giá">
                <Input type="number" />
              </Form.Item>
              <Form.Item
                name="stock"
                label="Số Lượng"
                rules={[{ required: true, message: "Vui lòng nhập số lượng!" }]}
              >
                <Input type="number" />
              </Form.Item>
              <Form.Item name="badge" label="Nhãn">
                <Input />
              </Form.Item>
              <Form.Item label="Mới" valuePropName="checked">
                <Switch checked={isNewProduct} onChange={setIsNewProduct} />
              </Form.Item>
              <Form.Item label="Sale" valuePropName="checked">
                <Switch checked={isSale} onChange={setIsSale} />
              </Form.Item>
              <Form.Item label="Đặc Biệt" valuePropName="checked">
                <Switch checked={isSpecial} onChange={setIsSpecial} />
              </Form.Item>
              <Form.Item
                label="Danh Mục"
                name="categoryId"
                rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
              >
                <Select placeholder="Chọn danh mục">
                  {categories.map((category) => (
                    <Option key={category._id} value={category._id}>
                      {category.categoryName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="Nhà Xuất Bản"
                name="brandId"
                rules={[
                  { required: true, message: "Vui lòng chọn nhà xuất bản!" },
                ]}
              >
                <Select placeholder="Chọn nhà xuất bản">
                  {brands.map((brand) => (
                    <Option key={brand._id} value={brand._id}>
                      {brand.brandName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Form>
          </TabPane>
          <TabPane tab="Hình Ảnh" key="2">
            <Upload
              multiple
              beforeUpload={(file) => {
                // Tự động thêm hình ảnh mới vào danh sách
                setImages((prevImages) => [...prevImages, file]);
                return false; // Ngăn không cho upload tự động
              }}
              showUploadList={false}
            >
              <Button icon={<PlusOutlined />}>Tải lên Hình Ảnh</Button>
            </Upload>
            <div>
              {images.map((image, index) => (
                <div
                  key={index}
                  style={{ display: "inline-block", margin: "10px" }}
                >
                  <img
                    src={URL.createObjectURL(image)} // Tạo URL cho hình ảnh
                    alt={`img-${index}`}
                    style={{ width: "100px", height: "100px" }}
                  />
                  <Button onClick={() => removeImage(index)} type="link" danger>
                    Xóa
                  </Button>
                </div>
              ))}
            </div>
          </TabPane>

          <TabPane tab="Lựa chọn" key="3">
            <div>
              <Button
                type="dashed"
                onClick={addVariation}
                style={{ marginBottom: 16 }}
              >
                <PlusOutlined />
              </Button>
              {variations.map((variation, index) => (
                <Row key={index} gutter={16} style={{ marginBottom: 8 }}>
                  <Col span={5}>
                    <Input
                      placeholder="Tên thuộc tính"
                      value={variation.attributeName}
                      onChange={(e) =>
                        handleVariationChange(
                          index,
                          "attributeName",
                          e.target.value
                        )
                      }
                      required
                    />
                  </Col>
                  <Col span={5}>
                    <Input
                      placeholder="Giá trị thuộc tính"
                      value={variation.attributeValue}
                      onChange={(e) =>
                        handleVariationChange(
                          index,
                          "attributeValue",
                          e.target.value
                        )
                      }
                      required
                    />
                  </Col>
                  <Col span={5}>
                    <Input
                      placeholder="Giá"
                      type="number"
                      value={variation.price}
                      onChange={(e) =>
                        handleVariationChange(index, "price", e.target.value)
                      }
                      required
                    />
                  </Col>
                  <Col span={5}>
                    <Input
                      placeholder="Số lượng"
                      type="number"
                      value={variation.quantity}
                      onChange={(e) =>
                        handleVariationChange(index, "quantity", e.target.value)
                      }
                      required
                    />
                  </Col>
                  <Col span={2}>
                    <MinusCircleOutlined
                      onClick={() => removeVariation(index)}
                      style={{ marginTop: 8 }}
                    />
                  </Col>
                </Row>
              ))}
            </div>
          </TabPane>
        </Tabs>
      </Spin>
    </Modal>
  );
};

export default CreateProductModal;
