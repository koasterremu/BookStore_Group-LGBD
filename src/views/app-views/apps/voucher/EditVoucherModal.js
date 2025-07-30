import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Spin,
  message,
  notification,
  DatePicker,
  Switch,
} from "antd"; // Import các thành phần cần thiết
import moment from "moment"; // Import moment để xử lý ngày
import { updateVoucher } from "services/voucherService"; // Import hàm gọi API

const EditVoucherModal = ({
  visible,
  voucherData,
  onCancel,
  refreshVouchers,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false); // Thêm state để quản lý loading

  useEffect(() => {
    if (voucherData) {
      form.setFieldsValue({
        code: voucherData.code,
        discount: voucherData.discount,
        expirationDate: moment(voucherData.expirationDate), // Định dạng lại ngày
        isUsed: voucherData.isUsed,
      });
    }
  }, [voucherData, form]);

  const handleFinish = async (values) => {
    setLoading(true); // Bắt đầu loading

    // Định dạng expirationDate về dạng ISO string
    const expirationDate = moment(values.expirationDate).toISOString();

    // Tạo đối tượng voucher
    const voucherUpdateData = {
      code: values.code,
      discount: values.discount,
      expirationDate: expirationDate,
      isUsed: values.isUsed,
    };

    // Gọi API cập nhật voucher
    try {
      await updateVoucher(voucherData._id, voucherUpdateData);
      message.success("Chỉnh sửa voucher thành công");
      refreshVouchers(); // Cập nhật danh sách voucher
      form.resetFields(); // Reset các trường trong form
      onCancel(); // Đóng modal
    } catch (error) {
      notification.error({
        message: "Chỉnh sửa voucher thất bại",
        description: "Có lỗi xảy ra khi cập nhật voucher.",
        placement: "topRight", // Vị trí thông báo
      });
      console.error("Error updating voucher:", error);
    } finally {
      setLoading(false); // Kết thúc loading
    }
  };

  return (
    <Modal
      visible={visible}
      title="Chỉnh Sửa Voucher"
      okText="Lưu"
      cancelText="Hủy"
      onCancel={onCancel}
      onOk={() => form.submit()}
      getPopupContainer={(trigger) => trigger.parentNode} // Đặt getPopupContainer
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="code"
          label="Mã Voucher"
          rules={[{ required: true, message: "Vui lòng nhập mã voucher!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="discount"
          label="Giảm Giá (%)"
          rules={[{ required: true, message: "Vui lòng nhập giảm giá!" }]}
        >
          <Input type="number" min={0} max={100} />
        </Form.Item>
        <Form.Item
          name="expirationDate"
          label="Ngày Hết Hạn"
          rules={[{ required: true, message: "Vui lòng chọn ngày hết hạn!" }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item label="Đã Sử Dụng">
          <Form.Item name="isUsed" valuePropName="checked" noStyle>
            <Switch />
          </Form.Item>
        </Form.Item>
      </Form>
      {loading && <Spin style={{ display: "block", margin: "20px auto" }} />}{" "}
      {/* Thêm spinner */}
    </Modal>
  );
};

export default EditVoucherModal;
