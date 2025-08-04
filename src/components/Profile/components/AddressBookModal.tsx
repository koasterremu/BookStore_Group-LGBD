import React, { useState, useEffect } from "react";
import { Form, Input, Modal, Select } from "antd";
import {
  fetchProvinces,
  fetchDistrictsByProvince,
  fetchWardsByDistrict,
} from "../../../services/addressBookService";

const { Option } = Select;

interface AddressBookModalProps {
  visible: boolean;
  isEditMode: boolean;
  onCancel: () => void;
  onSave: (values: any) => void;
  initialValues?: any;
}

const AddressBookModal: React.FC<AddressBookModalProps> = ({
  visible,
  isEditMode,
  onCancel,
  onSave,
  initialValues,
}) => {
  const [form] = Form.useForm();
  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<any>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<any>(null);

  useEffect(() => {
    fetchProvincesFromAPI();
    if (isEditMode && initialValues) {
      // Khi update, chỉ cần load provinces mà không cần hiển thị lại
      setSelectedProvince({
        name: initialValues.city,
        code: initialValues.cityCode,
      });
      fetchDistrictsFromAPI(initialValues.cityCode);
      setSelectedDistrict({
        name: initialValues.district,
        code: initialValues.districtCode,
      });
      fetchWardsFromAPI(initialValues.districtCode);
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [isEditMode, initialValues]);

  const fetchProvincesFromAPI = async () => {
    const data = await fetchProvinces();
    setProvinces(data);
  };

  const fetchDistrictsFromAPI = async (provinceCode: string) => {
    if (!provinceCode) {
      return;
    }
    const data = await fetchDistrictsByProvince(provinceCode);
    setDistricts(data);
  };

  const fetchWardsFromAPI = async (districtCode: string) => {
    if (!districtCode) {
      return;
    }
    const data = await fetchWardsByDistrict(districtCode);
    setWards(data);
  };

  const handleProvinceChange = (value: string, option: any) => {
    setSelectedProvince({ name: option.children, code: value });
    setDistricts([]);
    setWards([]);
    fetchDistrictsFromAPI(value);
  };

  const handleDistrictChange = (value: string, option: any) => {
    setSelectedDistrict({ name: option.children, code: value });
    setWards([]);
    fetchWardsFromAPI(value);
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      const addressData = {
        ...values,
        city: selectedProvince.name,
        cityCode: selectedProvince.code,
        district: selectedDistrict.name,
        districtCode: selectedDistrict.code,
      };
      onSave(addressData);
    });
  };

  return (
    <Modal
      title={isEditMode ? "Cập nhật địa chỉ" : "Thêm địa chỉ mới"}
      visible={visible}
      onCancel={onCancel}
      onOk={handleSave} // Gọi handleSave khi submit
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="recipientName"
          label="Tên người nhận"
          rules={[{ required: true, message: "Vui lòng nhập tên người nhận!" }]}
        >
          <Input placeholder="Tên người nhận" style={{ height: "40px" }} />
        </Form.Item>
        <Form.Item
          name="phoneNumber"
          label="Số điện thoại"
          rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
        >
          <Input placeholder="Số điện thoại" style={{ height: "40px" }} />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            {
              required: true,
              type: "email",
              message: "Vui lòng nhập email hợp lệ!",
            },
          ]}
        >
          <Input placeholder="Email" style={{ height: "40px" }} />
        </Form.Item>
        <Form.Item
          name="address"
          label="Địa chỉ"
          rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
        >
          <Input placeholder="Địa chỉ" style={{ height: "40px" }} />
        </Form.Item>
        <Form.Item
          name="city"
          label="Tỉnh/Thành phố"
          rules={[{ required: true, message: "Vui lòng chọn tỉnh/thành phố!" }]}
        >
          <Select
            placeholder="Chọn Tỉnh/Thành phố"
            style={{ height: "40px" }}
            onChange={handleProvinceChange}
          >
            {provinces.map((province) => (
              <Option key={province.code} value={province.code}>
                {province.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="district"
          label="Quận/Huyện"
          rules={[{ required: true, message: "Vui lòng chọn quận/huyện!" }]}
        >
          <Select
            placeholder="Chọn Quận/Huyện"
            style={{ height: "40px" }}
            onChange={handleDistrictChange}
            disabled={!selectedProvince}
          >
            {districts.map((district) => (
              <Option key={district.code} value={district.code}>
                {district.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="ward"
          label="Phường/Xã"
          rules={[{ required: true, message: "Vui lòng chọn phường/xã!" }]}
        >
          <Select
            placeholder="Chọn Phường/Xã"
            style={{ height: "40px" }}
            disabled={!selectedDistrict}
          >
            {wards.map((ward) => (
              <Option key={ward.code} value={ward.name}>
                {ward.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddressBookModal;
