import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { SortByCategory } from "../../../../redux/actions/productActions";
import { GetTitle, IsLoading } from "../../../../redux/actions/primaryActions";
import { getAllCategories } from "../../../../services/categoryService";

interface CategoriesProps {
  setSelectedCategory: (categoryId: number | null) => void;
}

const Categories: React.FC<CategoriesProps> = ({ setSelectedCategory }) => {
  const dispatch = useDispatch();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  ); // State để lưu danh mục đang được chọn

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        setCategories(response.content);
      } catch (error) {
        console.error("Error fetching categories", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="categories">
      <div className="categories-title">
        <h5>Danh mục</h5>
      </div>
      <div className="categories-list">
        {loading ? (
          <p>Đang tải...</p>
        ) : (
          <ul>
            <li
              onClick={() => {
                // Nếu đã chọn "Tất cả sản phẩm" rồi thì không xử lý lại
                if (selectedCategoryId === null) return;

                setSelectedCategory(null); // Chọn tất cả (bỏ lọc theo danh mục)
                setSelectedCategoryId(null); // Gỡ bỏ trạng thái chọn category
                dispatch(GetTitle("Tất cả sản phẩm"));
                dispatch(IsLoading(true));
              }}
              style={{
                fontWeight: selectedCategoryId === null ? "bold" : "normal", // In đậm khi không có category nào được chọn
                pointerEvents: selectedCategoryId === null ? "none" : "auto", // Vô hiệu hóa click khi đã chọn
                opacity: 1, // Giảm độ đậm chữ khi không cho phép click
              }}
            >
              <a href="#/">Tất cả sản phẩm</a>
            </li>
            {categories.map((category: any) => (
              <li
                key={category._id}
                onClick={() => {
                  // Nếu đã chọn danh mục này, không cho phép click lại
                  if (selectedCategoryId === category._id) return;

                  setSelectedCategory(category._id);
                  setSelectedCategoryId(category._id); // Cập nhật category được chọn
                  dispatch(GetTitle(category.categoryName));
                  dispatch(SortByCategory(category.categoryName));
                  dispatch(IsLoading(true));
                }}
                style={{
                  fontWeight:
                    selectedCategoryId === category._id
                      ? "bold"
                      : "normal", // In đậm danh mục đang được chọn
                  pointerEvents:
                    selectedCategoryId === category._id ? "none" : "auto", // Vô hiệu hóa click nếu đã chọn danh mục
                  opacity: 1, // Giảm độ đậm nếu đã chọn
                }}
              >
                <a href="#/">
                  <img
                    src={category.image}
                    alt={category.categoryName}
                    style={{
                      width: "30px",
                      height: "30px",
                      marginRight: "10px",
                      borderRadius: "10px",
                    }}
                  />
                  {category.categoryName}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Categories;
