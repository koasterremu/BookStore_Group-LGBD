import React, { useEffect, useState } from "react";
import Countdown from "./Countdown";
import { Link } from "react-router-dom";
import ProductCard from "../../ProductCard/ProductCard";
import OwlCarousel from "react-owl-carousel";
import { Options } from "../../Other/OwlCarouselOptions";
import { getFilteredProducts } from "../../../services/productService"; // Giả sử API này được đặt ở đây

const DealOfTheDay: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]); // State để lưu danh sách sản phẩm
  const [loading, setLoading] = useState<boolean>(true); // State để kiểm tra trạng thái loading

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Gọi API với các điều kiện: isSpecial là true, còn lại là false
        const filteredProducts = await getFilteredProducts(false, false, true);
        setProducts(filteredProducts.payload.content); // Cập nhật state
        setLoading(false); // Kết thúc trạng thái loading khi API hoàn thành
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm Deal trong ngày", error);
        setLoading(false); // Kết thúc trạng thái loading ngay cả khi có lỗi
      }
    };

    fetchProducts();
  }, []); // useEffect sẽ chỉ chạy một lần khi component mount

  if (loading) {
    return <div>Đang tải...</div>; // Hoặc bạn có thể hiển thị một spinner hoặc thông báo loading
  }

  if (products.length === 0) {
    return <div>Không có sản phẩm nào</div>; // Xử lý khi không có sản phẩm nào
  }

  return (
    <section id="deal-of-the-day">
      <div className="container">
        {/* ======= Tiêu đề phần ======= */}
        <div className="section-header-wrapper">
          <div className="section-header">
            <div className="left-side d-flex">
              <div className="title">
                <h4>Ưu đãi trong ngày</h4>
              </div>
              <div className="countdown-wrapper">
                <Countdown />
              </div>
            </div>
            <div className="right-side">
              <div className="view-all">
                <Link to="/shop">Xem tất cả</Link>
              </div>
            </div>
          </div>
        </div>
        {/* ======= Slider ======= */}
        <div className="slider-wrapper">
          <OwlCarousel className="owl-theme" {...Options}>
            {products.map((product) => (
              <div key={product._id} className="item">
                <ProductCard product={product} />
              </div>
            ))}
          </OwlCarousel>
        </div>
      </div>
    </section>
  );
};

export default DealOfTheDay;
