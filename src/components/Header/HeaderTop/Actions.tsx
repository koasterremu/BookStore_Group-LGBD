import React from "react";
import DropdownCart from "./DropdownCart";
import { FiBarChart2 } from "react-icons/fi";
import { BsHeart, BsBag } from "react-icons/bs";
import { IoIosSearch } from "react-icons/io";
import UserIcon from "../../../assets/img/other/user-icon.png";
import { Link, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../redux/reducers/index";
import {
  ShowSearchArea,
  ShowOrHideDropdownCart,
} from "../../../redux/actions/primaryActions";
import { IActionDataTypes } from "../../../types/types";
import { ActionType } from "../../../redux/actions/actionTypes";

const Actions: React.FC = () => {
  const cart = useSelector((state: RootState) => state.cart);
  const wishlist = useSelector((state: RootState) => state.wishlist);
  const compare = useSelector((state: RootState) => state.compare);
  const user = useSelector((state: RootState) => state.user.user); // Lấy thông tin user từ Redux
  const dispatch = useDispatch();
  const history = useHistory();

  const showOrHideDropCart = (e: React.MouseEvent<HTMLAnchorElement>) => {
    dispatch(ShowOrHideDropdownCart());
  };

  const ActionsData: IActionDataTypes[] = [
    {
      id: 1,
      href: "/compare",
      sup: compare.compare.length,
      icon: <FiBarChart2 color="#ffffff" />,
      class: "second-link",
    },
    {
      id: 2,
      href: "/wishlist",
      sup: wishlist.wishlist.length,
      icon: <BsHeart />,
      class: "second-link",
    },
    {
      id: 3,
      href: "#/",
      sup: cart.cart.length,
      icon: <BsBag />,
      class: "third-link",
      dropdownContent: <DropdownCart />,
      func: showOrHideDropCart,
    },
  ];

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    dispatch({ type: ActionType.LOGOUT }); // Dispatch action LOGOUT để xóa thông tin user khỏi Redux
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    history.push("/login"); // Chuyển hướng về trang login sau khi đăng xuất
  };

  return (
    <div className="header-top-actions d-flex">
      <div className="left-actions">
        <ul>
          <li>
            <button
              type="button"
              className="search-btnn"
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                dispatch(ShowSearchArea(true));
              }}
            >
              <IoIosSearch />
            </button>
          </li>
          {ActionsData.map((item) => (
            <li key={item.id}>
              <Link
                style={{ color: "#ffffff" }}
                to={item.href}
                className={item.class}
                onClick={item.func}
              >
                {item.icon}
                {item.sup > 0 && <sup>{item.sup}</sup>}{" "}
                {/* Chỉ hiển thị số lượng nếu > 0 */}
              </Link>
              {item.dropdownContent}
            </li>
          ))}
        </ul>
      </div>
      <div className="right-actions d-flex">
        <div className="user-icon">
          {/* Kiểm tra nếu có user và avatar */}
          {user && user.avatar ? (
            <Link to="/profile">
              <img
                src={user.avatar}
                alt={user.fullName}
                style={{
                  width: "40px", // Kích thước của avatar
                  height: "40px", // Kích thước của avatar
                  borderRadius: "50%", // Làm cho avatar thành hình tròn
                  objectFit: "cover", // Đảm bảo hình ảnh bao phủ toàn bộ khung
                }}
              />
            </Link>
          ) : (
            <Link to="/profile">
              <img
                src={"https://i.pinimg.com/originals/94/e4/cb/94e4cb5ae194975f6dc84d1495c3abcd.gif"}
                alt="User Icon"
                style={{
                  width: "40px", // Kích thước của avatar
                  height: "40px", // Kích thước của avatar
                  borderRadius: "50%", // Làm cho avatar thành hình tròn
                  objectFit: "cover", // Đảm bảo hình ảnh bao phủ toàn bộ khung
                }}
              />
            </Link>
          )}
        </div>

        <div
          className="links"
          style={{ display: "flex", alignItems: "center" }}
        >
          {/* Nếu user đã đăng nhập */}
          {user && user.fullName ? (
            <>
              <span
                style={{
                  fontWeight: "bold",
                  maxWidth: "150px", // Giới hạn chiều rộng để đảm bảo fullName nằm trong 1 dòng
                  whiteSpace: "nowrap", // Ngăn không cho text xuống dòng
                  overflow: "hidden", // Ẩn phần vượt quá chiều rộng
                  textOverflow: "ellipsis", // Hiển thị dấu 3 chấm nếu text bị cắt
                  color: "#ffffff",
                }}
              >
                {user.fullName}
              </span>
              <button
                onClick={handleLogout}
                style={{
                  marginLeft: "10px",
                  padding: "5px 10px",
                  fontSize: "14px",
                  cursor: "pointer",
                  color: "#ffffff",
                }}
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link
                style={{
                  fontWeight: "bold",
                  maxWidth: "150px", // Giới hạn chiều rộng để đảm bảo fullName nằm trong 1 dòng
                  whiteSpace: "nowrap", // Ngăn không cho text xuống dòng
                  overflow: "hidden", // Ẩn phần vượt quá chiều rộng
                  textOverflow: "ellipsis", // Hiển thị dấu 3 chấm nếu text bị cắt
                  color: "#ffffff",
                }}
                to="/login"
              >
                Đăng nhập
              </Link>
              <Link style={{ color: "#ffffff" }} to="/register">
                Đăng ký
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Actions;
