import React from "react";
import ProductCard from "../../ProductCard/ProductCard";
import Pagination from "./Pagination";
import { RiEqualizerLine } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { ShowSidebarFilter } from "../../../redux/actions/primaryActions";
import { Select, Button, Row, Col, Typography } from "antd";

const { Title, Text } = Typography;

const ProductsSide: React.FC<any> = ({
  products,
  totalPagesNum,
  currentPage,
  setCurrentPage,
  sortField,
  sortDirection,
  setSortField,
  setSortDirection,
}) => {
  const dispatch = useDispatch();

  const handleFilterBtnClick = () => {
    dispatch(ShowSidebarFilter(true));
  };

  return (
    <div className="products-side">
      {/* Header */}
      <Row
        justify="space-between"
        align="middle"
        style={{ marginBottom: "20px" }}
      >
        <Col>
          <Text strong style={{ fontSize: "16px" }}>
            {products.length} Sản phẩm
          </Text>
        </Col>
        <Col>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <Text strong>Sắp xếp theo:</Text>
            <Select
              value={sortField}
              onChange={setSortField}
              style={{ width: 250 }}
            >
              <Select.Option value="productName">
                Tên sản phẩm (A-Z)
              </Select.Option>
              <Select.Option value="price">Giá</Select.Option>
            </Select>
            <Select
              value={sortDirection}
              onChange={setSortDirection}
              style={{ width: 120 }}
            >
              <Select.Option value="asc">Tăng dần</Select.Option>
              <Select.Option value="desc">Giảm dần</Select.Option>
            </Select>
          </div>
        </Col>
        {/* <Col>
          <Button
            type="primary"
            icon={<RiEqualizerLine />}
            onClick={handleFilterBtnClick}
            style={{
              background: "#80001C",
              border: "none",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 16px",
              borderRadius: "6px",
            }}
          >
            Bộ lọc
          </Button>
        </Col> */}
      </Row>

      {/* Danh sách sản phẩm */}
      <div className="products">
        <div className="row">
          {products.map((product: any) => (
            <div
              key={product._id}
              className="col-xxl-3 col-xl-4 col-lg-4 col-md-4 col-sm-6"
            >
              <div style={{ marginBottom: "10px" }}>
                <ProductCard product={product} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <Pagination
        pages={totalPagesNum}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
      />
    </div>
  );
};

export default ProductsSide;
