import React, { useState, useEffect } from "react";
import { Button, message } from "antd";
import { MessageOutlined } from "@ant-design/icons";
import Banner from "../components/Home/Banner/Banner";
import Advantages from "../components/Home/Advantages/Advantages";
import DealOfTheDay from "../components/Home/DealOfTheDay/DealOfTheDay";
import HomeAds1 from "../components/Home/Ads/HomeAds1";
import Categories from "../components/Home/Categories/Categories";
import HomeAds2 from "../components/Home/Ads/HomeAds2";
import Recomend from "../components/Home/Other/Recomend";
import ChatBox from "../components/Home/Chat/ChatBox";
import { createChatRoom } from "../services/chatRoomService"; // Import hàm gọi API
import { useHistory } from "react-router-dom";

const Home: React.FC = () => {
  const [showChatBox, setShowChatBox] = useState(false); // State để điều khiển ChatBox
  const [messages, setMessages] = useState<any[]>([]); // State để lưu trữ tin nhắn
  const history = useHistory();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Hàm để mở/đóng ChatBox
  const toggleChatBox = async () => {
    setShowChatBox(!showChatBox);
  };

  // Hàm để đóng ChatBox
  const closeChatBox = () => {
    setShowChatBox(false);
  };

  return (
    <div className="home-content">
      <div className="main">
        <Banner />
        <Advantages />
        <Recomend />
        <DealOfTheDay />
        <HomeAds1 />
        <Categories />
        <HomeAds2 />
        {/* Button mở chat ở góc dưới bên phải */}
      </div>
    </div>
  );
};

// Các style cho Button
const styles = {
  chatButton: {
    position: "fixed" as "fixed",
    bottom: "50px",
    right: "90px",
    zIndex: 1000,
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    color: "#ffffff",
    backgroundColor: "#d91f28", // Thay đổi màu nền
    width: "50px", // Tăng chiều rộng
    height: "50px", // Tăng chiều cao
    display: "flex",
    alignItems: "center",
    justifyContent: "center", // Đảm bảo icon căn giữa
  },
};

export default Home;
