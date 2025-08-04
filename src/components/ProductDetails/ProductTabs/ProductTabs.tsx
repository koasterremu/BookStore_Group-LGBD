import React, { useState } from "react";
import Description from "./Description";
import Reviews from "./Reviews";
import { ITabList } from "../../../types/types";

const ProductTabs: React.FC<any> = ({ product }) => {
  const [clickedBtn, setClickedBtn] = useState<string>("Mô tả");

  // Chỉ giữ lại 2 tab: Mô tả và Đánh giá
  const TabList: ITabList[] = [
    { id: 1, title: "Mô tả" }, // Tab Mô tả
    { id: 2, title: "Đánh giá", reviewCount: product?.reviewCount },
    { id: 3, title: "" },
    { id: 4, title: "" },
  ];

  return (
    <div className="product-tabs">
      {/* ======= Danh sách tab ======= */}
      <div className="tab-list">
        <ul>
          {TabList.map((tabListItem) => (
            <li
              key={tabListItem.id}
              className={tabListItem.title === clickedBtn ? "active-btn" : ""}
            >
              <button
                type="button"
                onClick={(e: React.MouseEvent<HTMLButtonElement>): void => {
                  setClickedBtn(tabListItem.title);
                }}
              >
                {tabListItem.reviewCount
                  ? tabListItem.title + " (" + tabListItem.reviewCount + ")"
                  : tabListItem.title}
              </button>
            </li>
          ))}
        </ul>
      </div>
      {/* ======= Nội dung tab ======= */}
      <div className="tab-content-wrapper">
        <div
          className={clickedBtn === "Mô tả" ? "description-wrapper" : "d-none"}
        >
          <Description product={product} />
        </div>
        <div
          className={clickedBtn === "Đánh giá" ? "reviews-wrapper" : "d-none"}
        >
          <Reviews product={product} />
        </div>
      </div>
    </div>
  );
};

export default ProductTabs;
