import React, { useEffect, useState } from "react";
import ProductCard from "../../../ProductCard/ProductCard";
import SectionHeader from "../../Other/SectionHeader";
import OwlCarousel from "react-owl-carousel";
import { Options } from "../../../Other/OwlCarouselOptions";
import { getAllProducts } from "../../../../services/productService"; // Import hàm API

interface ConsumerElectronicsProps {
  categoryId: number; // Nhận categoryId từ props
  title: string;
}

const ConsumerElectronics: React.FC<ConsumerElectronicsProps> = ({
  categoryId,
  title,
}) => {
  const [products, setProducts] = useState<any[]>([]); // State để lưu danh sách sản phẩm
  const [loading, setLoading] = useState<boolean>(true); // State để kiểm tra trạng thái loading

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Gọi API để lấy danh sách sản phẩm theo categoryId
        const data = await getAllProducts("", categoryId, null, 1, 10); // Gọi API với page=1 và limit=10
        setProducts(data.payload.content); // Lưu kết quả vào state
        console.log(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false); // Dừng trạng thái loading sau khi API hoàn tất
      }
    };

    fetchProducts();
  }, [categoryId]); // Gọi lại API khi categoryId thay đổi

  if (loading) {
    return <div>Đang tải sản phẩm...</div>; // Hoặc hiển thị spinner
  }

  return (
    <div className="consumer-electronics">
      {/* ======= Section header ======= */}
      <div className="section-header-wrapper">
        <SectionHeader title={title} /> {/* Tiêu đề đã dịch sang tiếng Việt */}
      </div>
      {/* ======= Owl-carousel ======= */}
      <div className="owl-carousel-wrapper">
        <OwlCarousel className="owl-theme" {...Options}>
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product._id} className="item">
                <ProductCard product={product} />
              </div>
            ))
          ) : (
            <div>Không có sản phẩm nào</div> // Xử lý trường hợp không có sản phẩm
          )}
        </OwlCarousel>
      </div>
    </div>
  );
};

export default ConsumerElectronics;
