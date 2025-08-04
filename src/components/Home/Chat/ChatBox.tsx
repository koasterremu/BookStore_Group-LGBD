import React, { useRef, useState, useEffect } from "react";
import { Input, Button } from "antd";
import { SendOutlined } from "@ant-design/icons";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/reducers";

interface ChatBoxProps {
  onClose: () => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({ onClose }) => {
  const [inputMessage, setInputMessage] = useState<string>("");
  const [msgList, setMsgList] = useState<any[]>([]);
  const user = useSelector((state: RootState) => state.user.user);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [msgList]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() === "") return;

    if (!user || !user.userId) {
      console.error("User or userId is missing from Redux");
      return;
    }

    const userMessage = {
      content: inputMessage,
      sender: {
        id: user.userId,
        username: user.username,
        fullName: user.fullName,
        avatar: user.avatar,
        userId: user.userId,
      },
      timestamp: new Date().toISOString(),
    };

    setMsgList((prev) => [...prev, userMessage]);
    setInputMessage("");
    try {
      const aiResponse = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: inputMessage }],
          max_tokens: 800,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer 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`, // Replace with your actual key
          },
        }
      );

      const aiMessage = aiResponse.data.choices[0].message.content;
      const botMessage = {
        content: aiMessage,
        sender: {
          id: "AI",
          username: "ChatGPT",
          fullName: "ChatBot AI",
          avatar: "https://i.pinimg.com/originals/21/a1/aa/21a1aa2537400d0232efd93e108fd953.gif ",
          userId: "AI",
        },
        timestamp: new Date().toISOString(),
      };

      setMsgList((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error calling ChatGPT API:", error);
    }

    setInputMessage("");
  };

  const parseMarkdownToHTML = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
      .replace(/\*(.*?)\*/g, "<i>$1</i>")
      .replace(/`(.*?)`/g, "<code>$1</code>")
      .replace(/^### (.*$)/gm, "<h3>$1</h3>")
      .replace(/^## (.*$)/gm, "<h2>$1</h2>")
      .replace(/^# (.*$)/gm, "<h1>$1</h1>")
      .replace(/\n- (.*?)/g, "<li>$1</li>")
      .replace(/\n/g, "<br>");
  };

  return (
    <div style={styles.chatContainer}>
      <div style={styles.header}>
        <div>
          <img
            src="https://i.pinimg.com/originals/21/a1/aa/21a1aa2537400d0232efd93e108fd953.gif"
            alt="User Avatar"
            style={styles.avatar}
          />
          <span>ChatBot AI</span>
        </div>
        <Button style={{ color: "#ffffff" }} type="text" onClick={onClose}>
          X
        </Button>
      </div>
      <div style={styles.messageList}>
        {msgList.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.messageWrapper,
              justifyContent:
                msg.sender.userId === user.userId ? "flex-end" : "flex-start", // Căn trái hoặc phải
            }}
          >
            {msg.sender.userId !== user.userId && (
              <img
                src={msg.sender.avatar}
                alt="Avatar"
                style={styles.avatarInMessage}
              />
            )}
            <div
              style={{
                ...styles.message,
                backgroundColor:
                  msg.sender.userId === user.userId ? "#f8c2c4" : "#f1f1f1", // Màu nền khác nhau cho người gửi và nhận
              }}
            >
              <div style={styles.messageHeader}>
                <span style={styles.senderName}>{msg.sender.fullName} - </span>
                <span style={styles.messageTimestamp}>
                  {" "}
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </span>
              </div>
              <div style={styles.messageText}>
                {msg.sender.userId === "AI" ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: parseMarkdownToHTML(msg.content),
                    }}
                  />
                ) : (
                  msg.content
                )}
              </div>
            </div>
          </div>
        ))}
        {/* Thêm ref vào phần tử cuối cùng của danh sách tin nhắn */}
        <div ref={messagesEndRef}></div>
      </div>
      <div style={styles.inputContainer}>
        <Input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Đặt câu hỏi"
          style={styles.input}
          onPressEnter={handleSendMessage} // Thêm sự kiện gửi tin nhắn khi nhấn Enter
        />
        <Button
          type="primary"
          style={{ color: "#ffffff", backgroundColor: "#d91f28" }}
          shape="circle"
          icon={<SendOutlined />}
          onClick={handleSendMessage}
        />
      </div>
    </div>
  );
};

const styles = {
  chatContainer: {
    position: "fixed" as "fixed",
    bottom: "20px",
    right: "20px",
    width: "550px",
    height: "500px",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column" as "column",
    zIndex: 1000,
  },
  header: {
    padding: "10px",
    backgroundColor: "#d91f28",
    color: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  avatar: {
    borderRadius: "50%",
    marginRight: "10px",
    width: "40px",
    height: "40px",
  },
  avatarInMessage: {
    borderRadius: "50%",
    width: "30px",
    height: "30px",
    marginRight: "10px",
  },
  messageList: {
    flex: 1,
    padding: "10px",
    overflowY: "auto" as "auto",
  },
  messageWrapper: {
    display: "flex",
    marginBottom: "10px",
    alignItems: "flex-start",
  },
  message: {
    backgroundColor: "#f1f1f1",
    padding: "10px",
    borderRadius: "10px",
    maxWidth: "60%",
    wordWrap: "break-word" as "break-word",
  },
  messageHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "5px",
    fontWeight: "bold" as "bold",
    fontSize: "14px",
  },
  senderName: {
    color: "#333",
  },
  messageTimestamp: {
    fontSize: "12px",
    color: "#888",
  },
  messageText: {
    fontSize: "14px",
    color: "#333",
  },
  inputContainer: {
    padding: "20px",
    display: "flex",
    alignItems: "center",
  },
  input: {
    flex: 1,
    marginRight: "10px",
    borderRadius: "20px",
    height: "40px",
  },
};

export default ChatBox;
