import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Spin,
  Switch,
  Tabs,
  notification,
  Button,
  Select,
  Row,
  Col,
  message,
} from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { Editor } from "@tinymce/tinymce-react";
import { updateProduct } from "services/productService"; // Đảm bảo rằng bạn có API để cập nhật sản phẩm

const { TabPane } = Tabs;
const { Option } = Select;

const EditProductModal = ({
  visible,
  onCancel,
  refreshProducts,
  categories,
  brands,
  productData, // Dữ liệu sản phẩm để chỉnh sửa
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [variations, setVariations] = useState([]);
  const [content, setContent] = useState("");

  useEffect(() => {
    if (visible && productData) {
      form.setFieldsValue({
        productName: productData.productName,
        price: productData.price,
        discount: productData.discount,
        badge: productData.badge,
        stock: productData.stock,
        categoryId: productData.category._id,
        brandId: productData.brand._id,
        isNewProduct: productData.isNewProduct,
        isSale: productData.isSale,
        isSpecial: productData.isSpecial,
      });
      setContent(productData.description);
      setVariations(productData.variations || []);
    }
  }, [visible, productData, form]);

  const handleFinish = async (values) => {
    if (!content) {
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
      formData.append("isNewProduct", values.isNewProduct);
      formData.append("isSale", values.isSale);
      formData.append("isSpecial", values.isSpecial);
      formData.append("categoryId", values.categoryId);
      formData.append("brandId", values.brandId);

      if (variations && variations.length > 0) {
        formData.append("variations", JSON.stringify(variations));
      }

      await updateProduct(productData._id, formData); // Gọi API cập nhật sản phẩm
      refreshProducts();
      form.resetFields();
      setVariations([]);
      setContent("");
      onCancel();
      message.success("Cập nhật sản phẩm thành công");
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: "Cập nhật sản phẩm thất bại",
      });
    } finally {
      setLoading(false);
    }
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
      title="Chỉnh Sửa Sản Phẩm"
      okText="Cập Nhật"
      cancelText="Hủy"
      onCancel={onCancel}
      onOk={() => form.submit()}
      getPopupContainer={(trigger) => trigger.parentNode}
      width={800}
    >
      <Spin spinning={loading}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Thông Tin Chung" key="1">
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
              <Form.Item
                label="Mới"
                name="isNewProduct"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
              <Form.Item label="Sale" name="isSale" valuePropName="checked">
                <Switch />
              </Form.Item>
              <Form.Item
                label="Đặc Biệt"
                name="isSpecial"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
              <Form.Item
                label="Danh Mục"
                name="categoryId"
                rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
              >
                <Select placeholder="Chọn danh mục">
                  {categories.map((category) => (
                    <Option
                      key={category._id}
                      value={category._id}
                    >
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
          <TabPane tab="Lựa chọn" key="2">
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

export default EditProductModal;
