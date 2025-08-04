import React, { useState, useEffect } from "react";
import { Button } from "antd"; // Import Button từ Ant Design
import { HiArrowNarrowLeft } from "react-icons/hi";

interface IProps {
  handleShippingSubmit: () => void;
  handlePrev: () => void; // Thêm hàm xử lý quay lại
  selectedAddress: any; // Nhận selectedAddress từ component Checkout
}

const CheckoutInfo: React.FC<IProps> = (props) => {
  const [address, setAddress] = useState<any>({
    recipientName: "",
    phoneNumber: "",
    address: "",
    ward: "",
    district: "",
    city: "",
  });

  // Khi selectedAddress thay đổi, cập nhật form với giá trị từ địa chỉ đã chọn
  useEffect(() => {
    if (props.selectedAddress) {
      const selectedAddr = props.selectedAddress;
      setAddress({
        recipientName: selectedAddr.recipientName || "",
        phoneNumber: selectedAddr.phoneNumber || "",
        address: selectedAddr.address || "",
        ward: selectedAddr.ward || "",
        district: selectedAddr.district || "",
        city: selectedAddr.city || "",
        email: selectedAddr.email || "",
      });
    }
  }, [props.selectedAddress]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="checkout-info">
      <form
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault(); // Ngăn load lại trang
          props.handleShippingSubmit();
        }}
      >
        <div className="row">
          <div className="col-12">
            <div className="title text-center">
              <h1 style={{ marginTop: "20px" }}>Thông tin thanh toán</h1>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-8 offset-lg-2">
            <div className="checkout-info-area">
              <div className="shipping-address">
                <h5>Thông tin người nhận</h5>
                <div className="row">
                  <div className="col-12">
                    <div className="input-wrapper">
                      <label>Người nhận</label>
                      <input
                        type="text"
                        placeholder="Người nhận"
                        name="recipientName"
                        value={address.recipientName}
                        onChange={handleInputChange}
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="input-wrapper">
                      <label>Số điện thoại</label>
                      <input
                        type="text"
                        placeholder="Số điện thoại"
                        name="phoneNumber"
                        value={address.phoneNumber}
                        onChange={handleInputChange}
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="input-wrapper">
                      <label>Email</label>
                      <input
                        type="text"
                        placeholder="Email"
                        name="email"
                        value={address.email}
                        onChange={handleInputChange}
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="input-wrapper">
                      <label>Địa chỉ nhận hàng</label>
                      <input
                        type="text"
                        placeholder="Địa chỉ"
                        name="address"
                        value={address.address}
                        onChange={handleInputChange}
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="input-wrapper">
                      <input
                        type="text"
                        placeholder="Phường/Xã"
                        name="ward"
                        value={address.ward}
                        onChange={handleInputChange}
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="input-wrapper">
                      <input
                        type="text"
                        placeholder="Quận/Huyện"
                        name="district"
                        value={address.district}
                        onChange={handleInputChange}
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="input-wrapper">
                      <input
                        type="text"
                        placeholder="Thành phố"
                        name="city"
                        value={address.city}
                        onChange={handleInputChange}
                        className="form-control"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-8 offset-lg-2">
            <div className="bottom-links d-flex justify-content-between">
              <Button
                onClick={props.handlePrev} // Gọi hàm quay lại khi nhấn nút
                style={{
                  backgroundColor: "#fff",
                  color: "#000",
                  border: "1px solid #000",
                  padding: "8px 16px",
                }}
              >
                <HiArrowNarrowLeft /> Quay lại
              </Button>
              <input
                type="submit"
                value="Tiếp tục đến vận chuyển"
                className="btn btn-primary"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutInfo;
