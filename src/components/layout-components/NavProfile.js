import React, { useEffect, useState } from "react";
import { Menu, Dropdown, Avatar } from "antd";
import {
  EditOutlined,
  SettingOutlined,
  ShopOutlined,
  QuestionCircleOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import Icon from "components/util-components/Icon";
import { signOut } from "redux/actions/Auth";
import { useHistory } from "react-router-dom";

// const menuItem = [
// 	{
// 		title: "Edit Profile",
// 		icon: EditOutlined ,
// 		path: "/"
//     },

//     {
// 		title: "Account Setting",
// 		icon: SettingOutlined,
// 		path: "/"
//     },
//     {
// 		title: "Billing",
// 		icon: ShopOutlined ,
// 		path: "/"
// 	},
//     {
// 		title: "Help Center",
// 		icon: QuestionCircleOutlined,
// 		path: "/"
// 	}
// ]

export const NavProfile = () => {
  const [user, setUser] = useState(null);
  const history = useHistory();
  useEffect(() => {
    // Lấy thông tin người dùng từ localStorage
    const userData = localStorage.getItem("user"); // Giả sử dữ liệu người dùng được lưu trong localStorage với key là "user"
    if (userData) {
      setUser(JSON.parse(userData)); // Chuyển đổi từ chuỗi JSON sang đối tượng
    }
  }, []);
  const signOut = () => {
    localStorage.removeItem("auth_token"); // Xóa token đăng nhập
    localStorage.removeItem("user"); // Xóa thông tin người dùng
    history.push("/auth/login"); // Chuyển hướng về trang đăng nhập
  };
  const profileMenu = (
    <div className="nav-profile nav-dropdown">
      <div className="nav-profile-header">
        <div className="d-flex">
          <Avatar size={45} src={user?.avatar} />
          <div className="pl-3">
            <h4 className="mb-0">{user?.fullName}</h4>
            <span className="text-muted">{user?.role}</span>
          </div>
        </div>
      </div>
      <div className="nav-profile-body">
        <Menu>
          {/* {menuItem.map((el, i) => {
            return (
              <Menu.Item key={i}>
                <a href={el.path}>
                  <Icon className="mr-3" type={el.icon} />
                  <span className="font-weight-normal">{el.title}</span>
                </a>
              </Menu.Item>
            );
          })} */}
          <Menu.Item onClick={signOut}>
            <span>
              <LogoutOutlined className="mr-3" />
              <span className="font-weight-normal">Đăng xuất</span>
            </span>
          </Menu.Item>
        </Menu>
      </div>
    </div>
  );

  return (
    <Dropdown placement="bottomRight" overlay={profileMenu} trigger={["click"]}>
      <Menu className="d-flex align-item-center" mode="horizontal">
        <Menu.Item>
          <Avatar src={user?.avatar} />
        </Menu.Item>
      </Menu>
    </Dropdown>
  );
};

export default NavProfile;
