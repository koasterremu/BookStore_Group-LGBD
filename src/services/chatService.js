import axios from "axios";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
// Lấy URL của Backend từ file .env
const API_URL = "http://localhost:8080";

// Hàm lấy token từ localStorage
const getToken = () => {
  const token = localStorage.getItem("auth_token");
  return token ? token : null;
};

// Hàm kết nối WebSocket
export const connectWebSocket = (stompClient, onMessageReceived) => {
  const socket = new SockJS(`${API_URL}/ws`);
  stompClient = Stomp.over(socket);

  stompClient.connect(
    {
      Authorization: `Bearer ${getToken()}`, // Thêm token vào WebSocket headers
    },
    (frame) => {
      console.log("Connected: " + frame);
      stompClient.subscribe("/topic/chatroom", (messageOutput) => {
        const message = JSON.parse(messageOutput.body);
        console.log("Received message from WebSocket: ", message);
        onMessageReceived(message);
      });
    },
    (error) => {
      console.error("WebSocket connection error: ", error);
    }
  );
};

// Hàm gửi tin nhắn qua API
export const sendMessageAPI = async (chatRoomId, message) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/messages/chatroom/${chatRoomId}`,
      message,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`, // Thêm token vào header
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error sending message via API:", error);
    throw error;
  }
};

// Hàm lấy tin nhắn của phòng chat
export const getMessagesByChatRoom = async (chatRoomId) => {
  try {
    const response = await axios.get(
      `${API_URL}/api/messages/chatroom/${chatRoomId}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`, // Thêm token vào header
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching messages", error);
    throw error;
  }
};
