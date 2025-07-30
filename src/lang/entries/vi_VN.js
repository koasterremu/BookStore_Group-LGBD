import antdViVN from "antd/es/locale/vi_VN"; // Nhập ngôn ngữ Ant Design cho tiếng Việt
import viMsg from "../locales/vi_VI.json"; // Nhập các chuỗi dịch tiếng Việt

const ViLang = {
  antd: antdViVN, // Thêm cấu hình ngôn ngữ của Ant Design
  locale: "vi-VN", // Đặt mã ngôn ngữ
  messages: {
    ...viMsg, // Thêm các thông điệp từ file vi_VI.json
  },
};

export default ViLang;
