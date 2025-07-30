import React, { useState, useEffect } from "react";
import InnerAppLayout from "layouts/inner-app-layout";
import ChatContent from "./ChatContent";
import ChatMenu from "./ChatMenu";
import { getAllChatRoomsForAdmin } from "services/chatRoomService"; // Import service để gọi API

const Chat = (props) => {
  const [chatRooms, setChatRooms] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    // Gọi API để lấy danh sách chat room
    const fetchChatRooms = async () => {
      try {
        const rooms = await getAllChatRoomsForAdmin(user.userId);
        setChatRooms(rooms); // Lưu danh sách chat rooms vào state
      } catch (error) {
        console.error("Error fetching chat rooms", error);
      }
    };

    fetchChatRooms();
  }, []);

  return (
    <div className="chat">
      <InnerAppLayout
        sideContent={<ChatMenu chatRooms={chatRooms} {...props} />} // Truyền chatRooms qua props
        mainContent={<ChatContent {...props} />}
        sideContentWidth={450}
        sideContentGutter={false}
        border
      />
    </div>
  );
};

export default Chat;
