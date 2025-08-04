import React, { useEffect, useState } from "react";
import TopCategoriesList from "./TopCategoriesList/TopCategoriesList";
import ConsumerElectronics from "./ConsumerElectronics/ConsumerElectronics";
import Clothings from "./Clothings/Clothings";
import GardenAndKitchen from "./GardenAndKitchen/GardenAndKitchen";
import { getAllCategories } from "../../../services/categoryService"; // Import hàm API
import { ITopCategoriesData } from "../../../types/types";

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<ITopCategoriesData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [mouseCategoryId, setMouseCategoryId] = useState<number | null>(null);
  const [keyboardCategoryId, setKeyboardCategoryId] = useState<number | null>(
    null
  );
  const [headphonesCategoryId, setHeadphonesCategoryId] = useState<
    number | null
  >(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories(1, 12); // Gọi API lấy 6 danh mục
        const formattedCategories = data.content.map((category: any) => ({
          id: category._id,
          title: category.categoryName,
          img: category.image,
        }));

        setCategories(formattedCategories);

        // Tìm danh mục có title là "Chuột" và lấy id
        const mouseCategory = formattedCategories.find(
          (category: { title: string }) => category.title === "Sách Thiếu Nhi"
        );
        if (mouseCategory) {
          setMouseCategoryId(mouseCategory.id); // Lưu id của danh mục "Chuột"
        }

        // Tìm danh mục có title là "Bàn phím" và lấy id
        const keyboardCategory = formattedCategories.find(
          (category: { title: string }) => category.title === "Sách Học Ngoại Ngữ"
        );
        if (keyboardCategory) {
          setKeyboardCategoryId(keyboardCategory.id); // Lưu id của danh mục "Bàn phím"
        }

        // Tìm danh mục có title là "Tai nghe" và lấy id
        const headphonesCategory = formattedCategories.find(
          (category: { title: string }) => category.title === "Sách Văn Học"
        );
        if (headphonesCategory) {
          setHeadphonesCategoryId(headphonesCategory.id); // Lưu id của danh mục "Tai nghe"
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <div>Đang tải...</div>; // Hoặc hiển thị spinner
  }

  return (
    <section id="categories">
      <div className="container">
        <TopCategoriesList categories={categories} />{" "}
        {/* Truyền categories qua props */}
        {mouseCategoryId && (
          <ConsumerElectronics title={"Sách Thiếu Nhi"} categoryId={mouseCategoryId} />
        )}{" "}
        {/* Truyền id của danh mục "Chuột" vào ConsumerElectronics */}
        {keyboardCategoryId && (
          <ConsumerElectronics title={"Sách Học Ngoại Ngữ"} categoryId={keyboardCategoryId} />
        )}{" "}
        {/* Truyền id của danh mục "Bàn phím" vào ConsumerElectronics */}
        {headphonesCategoryId && (
          <ConsumerElectronics title={"Sách Văn Học"} categoryId={headphonesCategoryId} />
        )}{" "}

      </div>
    </section>
  );
};

export default Categories;
