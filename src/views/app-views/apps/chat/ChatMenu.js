import React, { useState, useEffect } from "react";
import { Badge, Input } from "antd";
import AvatarStatus from "components/shared-components/AvatarStatus";
import { COLOR_1 } from "constants/ChartConstant";
import { SearchOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";

const ChatMenu = ({ match, location, chatRooms }) => {
  const [list, setList] = useState(chatRooms || []); // Sử dụng chatRooms từ props
  const [searchText, setSearchText] = useState("");
  let history = useHistory();

  useEffect(() => {
    setList(chatRooms); // Cập nhật list khi props chatRooms thay đổi
  }, [chatRooms]);

  const openChat = (id) => {
    const data = list.map((elm) => {
      if (elm.id === id) {
        elm.unread = 0; // Reset unread count khi mở chat
      }
      return elm;
    });
    setList(data);
    history.push(`${match.url}/${id}`);
  };

  const searchOnChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchText(query);
    const filteredData = chatRooms.filter((item) =>
      item.customer.fullName.toLowerCase().includes(query)
    );
    setList(filteredData);
  };

  const id = parseInt(location.pathname.match(/\/([^/]+)\/?$/)?.[1] || null);

  return (
    <div className="chat-menu">
      <div className="chat-menu-toolbar">
        <Input
          placeholder="Search"
          onChange={searchOnChange}
          prefix={<SearchOutlined className="font-size-lg mr-2" />}
        />
      </div>
      <div className="chat-menu-list">
        {list.map((chatRoom, i) => (
          <div
            key={`chat-item-${chatRoom.id}`}
            onClick={() => openChat(chatRoom.id)}
            className={`chat-menu-list-item ${
              i === list.length - 1 ? "last" : ""
            } ${chatRoom.id === id ? "selected" : ""}`}
          >
            <AvatarStatus
              src={chatRoom.customer.avatar}
              name={chatRoom.customer.fullName}
              subTitle={
                chatRoom.messages.length > 0
                  ? chatRoom.messages[chatRoom.messages.length - 1].content
                  : "No messages"
              }
            />
            <div className="text-right">
              <div className="chat-menu-list-item-time">
                {chatRoom.messages.length > 0
                  ? new Date(
                      chatRoom.messages[chatRoom.messages.length - 1].timestamp
                    ).toLocaleTimeString()
                  : ""}
              </div>
              {chatRoom.unread === 0 ? (
                <span></span>
              ) : (
                <Badge
                  count={chatRoom.unread}
                  style={{ backgroundColor: COLOR_1 }}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatMenu;
