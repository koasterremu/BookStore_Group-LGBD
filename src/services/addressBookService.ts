import axios from "axios";

// Lấy URL của Backend từ file .env
const API_URL = process.env.REACT_APP_API_URL;

// Hàm lấy token từ localStorage
const getToken = (): string | null => {
  const token = localStorage.getItem("auth_token");
  return token ? token : null;
};

// Hàm lấy tất cả AddressBook theo User ID
export const getAddressBooksByUserId = async (userId: any): Promise<any> => {
  try {
    const response = await axios.get(`${API_URL}/addressbook/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`, // Thêm token vào header
      },
    });
    return response.data.payload;
  } catch (error: any) {
    console.error("Error fetching address books by user ID", error);
    throw error;
  }
};

// Hàm tạo mới AddressBook
export const createAddressBook = async (
  userId: any,
  recipientName: string,
  phoneNumber: string,
  address: string,
  ward: string,
  district: string,
  city: string,
  email: string // Thêm trường email
): Promise<any> => {
  try {
    const addressData = {
      recipientName,
      phoneNumber,
      address,
      ward,
      district,
      city,
      email, // Thêm email vào dữ liệu tạo mới
    };

    const response = await axios.post(
      `${API_URL}/addressbook/user/${userId}`,
      addressData,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`, // Thêm token vào header
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.payload;
  } catch (error: any) {
    console.error("Error creating address book", error);
    throw error;
  }
};

// Hàm cập nhật AddressBook theo ID
export const updateAddressBook = async (
  addressBookId: any,
  recipientName: string,
  phoneNumber: string,
  address: string,
  ward: string,
  district: string,
  city: string,
  email: string // Thêm trường email
): Promise<any> => {
  try {
    const addressData = {
      recipientName,
      phoneNumber,
      address,
      ward,
      district,
      city,
      email, // Thêm email vào dữ liệu cập nhật
    };

    const response = await axios.put(
      `${API_URL}/addressbook/${addressBookId}`,
      addressData,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`, // Thêm token vào header
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.payload;
  } catch (error: any) {
    console.error("Error updating address book", error);
    throw error;
  }
};

// Hàm xóa AddressBook theo ID
export const deleteAddressBook = async (addressBookId: any): Promise<any> => {
  try {
    const response = await axios.delete(
      `${API_URL}/addressbook/${addressBookId}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`, // Thêm token vào header
        },
      }
    );

    return response.data.payload;
  } catch (error: any) {
    console.error("Error deleting address book", error);
    throw error;
  }
};

// API URL cho Tỉnh, Quận, Phường
const PROVINCE_API_URL = "https://provinces.open-api.vn/api/p/";

export const fetchProvinces = async () => {
  try {
    const response = await axios.get(PROVINCE_API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching provinces", error);
    throw error;
  }
};

export const fetchDistrictsByProvince = async (provinceCode: string) => {
  try {
    const response = await axios.get(
      `${PROVINCE_API_URL}${provinceCode}?depth=2`
    );
    return response.data.districts;
  } catch (error) {
    console.error("Error fetching districts", error);
    throw error;
  }
};

export const fetchWardsByDistrict = async (districtCode: string) => {
  try {
    const response = await axios.get(
      `https://provinces.open-api.vn/api/d/${districtCode}?depth=2`
    );
    return response.data.wards;
  } catch (error) {
    console.error("Error fetching wards", error);
    throw error;
  }
};
