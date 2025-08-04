import React, { useState, useEffect } from "react";
import { List, Button, Row, Col } from "antd";
import { toast } from "react-toastify";
import {
  getAddressBooksByUserId,
  createAddressBook,
  updateAddressBook,
  deleteAddressBook,
} from "../../services/addressBookService";
import AddressBookModal from "./components/AddressBookModal";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons"; // Import các icon
import { useHistory } from "react-router-dom"; // Import useHistory

const AddressBook: React.FC<{ userId: number }> = ({ userId }) => {
  const [addressBooks, setAddressBooks] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<any>(null);
  const history = useHistory(); // Sử dụng useHistory

  useEffect(() => {
    fetchAddressBooks();
  }, []);

  const fetchAddressBooks = async () => {
    try {
      const addresses = await getAddressBooksByUserId(userId);
      setAddressBooks(addresses);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách địa chỉ");
      console.error(error);
    }
  };

  const handleSaveAddress = async (values: any) => {
    try {
      if (isEditMode && currentAddress) {
        await updateAddressBook(
          currentAddress._id,
          values.recipientName,
          values.phoneNumber,
          values.address,
          values.ward,
          values.district,
          values.city,
          values.email
        );
        toast.success("Cập nhật địa chỉ thành công!");
      } else {
        await createAddressBook(
          userId,
          values.recipientName,
          values.phoneNumber,
          values.address,
          values.ward,
          values.district,
          values.city,
          values.email
        );
        toast.success("Thêm địa chỉ mới thành công!");
      }
      fetchAddressBooks();
      setIsModalVisible(false);
    } catch (error) {
      toast.error("Lỗi khi lưu địa chỉ");
      console.error(error);
    }
  };

  const handleDeleteAddress = async (addressBookId: number) => {
    try {
      await deleteAddressBook(addressBookId);
      fetchAddressBooks();
      toast.success("Xóa địa chỉ thành công!");
    } catch (error) {
      toast.error("Lỗi khi xóa địa chỉ");
      console.error(error);
    }
  };

  const handleEditAddress = (address: any) => {
    setIsEditMode(true);
    setCurrentAddress(address);
    setIsModalVisible(true);
  };

  const handleCheckoutNavigate = () => {
    history.push("/checkout"); // Điều hướng sang trang checkout
  };

  return (
    <div>
      <Row
        justify="space-between"
        align="middle"
        style={{ marginBottom: "20px" }}
      >
        <Col>
          <h6>Quản lý địa chỉ giao hàng</h6>
        </Col>
        <Col>
          <Button
            style={{ backgroundColor: "#d91f28" }}
            type="primary"
            onClick={() => {
              setIsEditMode(false);
              setCurrentAddress(null);
              setIsModalVisible(true);
            }}
          >
            Thêm địa chỉ mới
          </Button>
        </Col>
      </Row>

      <List
        bordered
        dataSource={addressBooks}
        renderItem={(address) => (
          <List.Item
            actions={[
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => handleEditAddress(address)}
              />,
              // <Button
              //   type="link"
              //   danger
              //   icon={<DeleteOutlined />}
              //   onClick={() => handleDeleteAddress(address._id)}
              // />,
            ]}
          >
            <List.Item.Meta
              title={address.recipientName}
              description={`${address.phoneNumber}, ${address.email}, ${address.address}, ${address.ward}, ${address.district}, ${address.city}`}
            />
          </List.Item>
        )}
      />

      <AddressBookModal
        visible={isModalVisible}
        isEditMode={isEditMode}
        onCancel={() => setIsModalVisible(false)}
        onSave={handleSaveAddress}
        initialValues={currentAddress}
      />

      {/* Button điều hướng sang trang checkout */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Button
          style={{
            backgroundColor: "#d91f28",
            color: "white",
            padding: "10px 20px",
            borderRadius: "5px",
            fontSize: "16px",
          }}
          onClick={handleCheckoutNavigate} // Điều hướng khi bấm nút
        >
          Thanh toán
        </Button>
      </div>
    </div>
  );
};

export default AddressBook;
