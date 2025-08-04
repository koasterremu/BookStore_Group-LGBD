import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { VscChevronRight } from "react-icons/vsc";
import { ShowSidebarCategories } from "../../../redux/actions/primaryActions";
import { useDispatch } from "react-redux";
import { getAllCategories } from "../../../services/categoryService"; // Import hàm gọi API

const Department: React.FC = () => {
  const dispatch = useDispatch();
  const [categories, setCategories] = useState<any[]>([]); // State để lưu dữ liệu danh mục
  const [loading, setLoading] = useState<boolean>(true); // State để kiểm tra trạng thái loading

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories(1, 1000); // Gọi API với page=1, size=1000
        setCategories(data.content); // Cập nhật state với dữ liệu danh mục
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false); // Kết thúc loading dù thành công hay lỗi
      }
    };

    fetchCategories();
  }, []);

  const handleCloseCategories = (
    e: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLAnchorElement>
  ) => {
    dispatch(ShowSidebarCategories(false));
  };

  if (loading) {
    return <div>Đang tải danh mục...</div>; // Hiển thị trạng thái loading
  }

  return (
    <div className="department d-flex">
      <div className="icon">
        <span>
          <GiHamburgerMenu color="#ffffff" />
        </span>
      </div>

      <div className="text" style={{ color: "#ffffff" }}>
        <h6>Danh mục sản phẩm</h6>
      </div>
      <div className="title" style={{ color: "#ffffff" }}>
        <h6>Danh mục sản phẩm</h6>
        <button type="button" onClick={handleCloseCategories}>
          ✕
        </button>
      </div>
      {/* ===== Departments ===== */}
      <ul
        className="departments"
        style={{
          maxHeight: "400px",
          overflowY: "auto",
          scrollbarWidth: "thin", // Dành cho Firefox
          scrollbarColor: "#cccccc transparent",
        }}
      >
        {categories.map((item: any) =>
          item.submenu ? (
            <li key={item.categoryId}>
              <Link
                to="/shop"
                onClick={handleCloseCategories}
                className="d-flex justify-content-between"
              >
                <p className="m-0 p-0">
                  <span>
                    {/* Nếu cần, hiển thị biểu tượng hoặc hình ảnh tại đây */}
                    <img
                      src={item.image}
                      alt={item.categoryName}
                      style={{ width: "24px", height: "24px" }}
                    />
                  </span>{" "}
                  {item.categoryName}
                </p>
                <span className="right-arrow">
                  <VscChevronRight />
                </span>
              </Link>
              {/* Thêm logic submenu nếu có */}
            </li>
          ) : (
            <li key={item.categoryId}>
              <Link to="/shop" onClick={handleCloseCategories}>
                <span>
                  {/* Hiển thị hình ảnh danh mục */}
                  <img
                    src={item.image}
                    alt={item.categoryName}
                    style={{ width: "24px", height: "24px" }}
                  />
                </span>{" "}
                {item.categoryName}
              </Link>
            </li>
          )
        )}
      </ul>
    </div>
  );
};

export default Department;
