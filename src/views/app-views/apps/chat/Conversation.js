import React from "react";
import { Avatar, Divider, Input, Form, Button, Menu } from "antd";
import {
  SendOutlined,
  PaperClipOutlined,
  SmileOutlined,
  UserOutlined,
  DeleteOutlined,
  AudioMutedOutlined,
} from "@ant-design/icons";
import { Scrollbars } from "react-custom-scrollbars";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import axios from "axios";
import Flex from "components/shared-components/Flex";
import EllipsisDropdown from "components/shared-components/EllipsisDropdown";

const menu = () => (
  <Menu>
    <Menu.Item key="0">
      <UserOutlined />
      <span>User Info</span>
    </Menu.Item>
    <Menu.Item key="1">
      <AudioMutedOutlined />
      <span>Mute Chat</span>
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key="3">
      <DeleteOutlined />
      <span>Delete Chat</span>
    </Menu.Item>
  </Menu>
);

export class Conversation extends React.Component {
  formRef = React.createRef();
  chatBodyRef = React.createRef();
  stompClient = null;

  state = {
    info: {},
    msgList: [],
    newMessage: "",
  };

  componentDidMount() {
    this.getConversation(this.getUserId());
    this.connectWebSocket();
  }

  componentDidUpdate(prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      this.getConversation(this.getUserId());
    }
    this.scrollToBottom();
  }

  // Kết nối WebSocket
  // Kết nối WebSocket
  connectWebSocket = () => {
    const socket = new SockJS("http://localhost:8080/ws");
    this.stompClient = Stomp.over(socket);

    this.stompClient.connect(
      {},
      (frame) => {
        console.log("Connected: " + frame); // In ra frame để kiểm tra kết nối

        this.stompClient.subscribe("/topic/chatroom", (messageOutput) => {
          const message = JSON.parse(messageOutput.body);
          console.log("Received message from WebSocket: ", message); // Kiểm tra tin nhắn nhận từ WebSocket

          this.setState({
            msgList: [...this.state.msgList, message],
          });
        });
      },
      (error) => {
        console.error("WebSocket connection error: ", error);
      }
    );
  };

  getUserId() {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.userId || null;
  }
  getChatRoomId() {
    const { id } = this.props.match.params;
    return parseInt(parseInt(id));
  }
  // Gọi API để lấy danh sách tin nhắn của phòng chat
  getConversation = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/messages/chatroom/${this.getChatRoomId()}`
      );
      this.setState({
        msgList: response.data,
      });
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Hiển thị nội dung tin nhắn và kiểu tin nhắn (text, file, image)
  getMsgType = (msg) => {
    return <span>{msg.content}</span>;
  };

  // Cuộn xuống cuối khi có tin nhắn mới
  scrollToBottom = () => {
    this.chatBodyRef.current.scrollToBottom();
  };

  onSend = async (values) => {
    if (values.newMsg && this.stompClient) {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user || !user.userId) {
        console.error("User or userId is missing from localStorage");
        return;
      }

      const newMsgData = {
        content: values.newMsg,
        sender: { id: user.userId },
        timestamp: new Date().toISOString(),
      };
      const newMsgDataSocket = {
        content: values.newMsg,
        sender: {
          id: user.userId, // Gán userId lấy từ localStorage
          username: user.username, // Gán username nếu cần
          fullName: user.fullName, // Gán fullName
          avatar: user.avatar, // Gán avatar nếu cần
          userId: user.userId,
        },
        timestamp: new Date().toISOString(),
      };

      // Gửi tin nhắn qua WebSocket
      this.stompClient.send(
        "/app/chat.sendMessage",
        {},
        JSON.stringify(newMsgDataSocket)
      );

      // Gửi tin nhắn qua API để lưu vào cơ sở dữ liệu
      try {
        axios
          .post(
            `http://localhost:8080/api/messages/chatroom/${this.getChatRoomId()}?userId=${
              user.userId
            }`,
            newMsgData
          )
          .then((response) => {
            console.log("Message sent successfully", response.data);
          })
          .catch((error) => {
            console.error("Error sending message", error);
          });

        // this.setState({
        //   msgList: [...this.state.msgList, response.data],
        // });

        this.formRef.current.setFieldsValue({
          newMsg: "",
        });
      } catch (error) {
        console.error("Error sending message via API:", error);
      }
    }
  };

  emptyClick = (e) => {
    e.preventDefault();
  };

  chatContentHeader = (name) => (
    <div className="chat-content-header">
      <h4 className="mb-0">{name}</h4>
      <div>
        <EllipsisDropdown menu={menu} />
      </div>
    </div>
  );

  chatContentBody = (messages) => (
    <div className="chat-content-body">
      <Scrollbars ref={this.chatBodyRef} autoHide>
        {messages.map((msg, i) => (
          <div
            key={`msg-${i}`}
            className={`msg ${
              msg.sender.userId === this.getUserId()
                ? "msg-sent"
                : "msg-recipient"
            }`}
          >
            <div className="mr-2">
              <Avatar src={msg.sender.avatar} />
            </div>
            <div className="bubble">
              <div className="bubble-wrapper">
                <div className="message-header">
                  <strong>{msg.sender.fullName} - </strong>
                  <span className="timestamp">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                {this.getMsgType(msg)}
              </div>
            </div>
          </div>
        ))}
      </Scrollbars>
    </div>
  );

  chatContentFooter = () => (
    <div className="chat-content-footer">
      <Form
        name="msgInput"
        ref={this.formRef}
        onFinish={this.onSend}
        className="w-100"
      >
        <Form.Item name="newMsg" className="mb-0">
          <Input
            autoComplete="off"
            placeholder="Type a message..."
            suffix={
              <div className="d-flex align-items-center">
                <a
                  href="/#"
                  className="text-dark font-size-lg mr-3"
                  onClick={this.emptyClick}
                >
                  <SmileOutlined />
                </a>
                <a
                  href="/#"
                  className="text-dark font-size-lg mr-3"
                  onClick={this.emptyClick}
                >
                  <PaperClipOutlined />
                </a>
                <Button
                  shape="circle"
                  type="primary"
                  size="small"
                  htmlType="submit"
                >
                  <SendOutlined />
                </Button>
              </div>
            }
          />
        </Form.Item>
      </Form>
    </div>
  );

  render() {
    const { msgList } = this.state;
    return (
      <div className="chat-content">
        {this.chatContentBody(msgList)}
        {this.chatContentFooter()}
      </div>
    );
  }
}

export default Conversation;
