import React from "react";
import { Link } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import { ITopCategoriesData } from "../../../../types/types"; // Import kiểu dữ liệu

interface TopCategoriesListProps {
  categories: ITopCategoriesData[]; // Khai báo kiểu dữ liệu cho categories
}

const TopCategoriesList: React.FC<TopCategoriesListProps> = ({
  categories,
}) => {
  return (
    <div className="top-categories-list">
      <div className="row">
        <div className="col-12">
          <div className="section-title">
            <h4>Danh Mục Nổi Bật Trong Tháng</h4> {/* Tiêu đề tiếng Việt */}
          </div>
        </div>
      </div>
      <div className="categories-wrapper">
        <Row>
          {categories.map((item) => (
            <Col key={item.id} xl={2} lg={4} md={4} sm={4} xs={6}>
              <Link to={`/shop`}>
                <div className="category-item">
                  <div className="category-img">
                    <img
                      src={item.img}
                      alt={item.title}
                      style={{
                        width: "168px",
                        height: "168px",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <div className="category-title">
                    <h6>{item.title}</h6>
                  </div>
                </div>
              </Link>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default TopCategoriesList;
