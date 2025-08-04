import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductDetailsContent from "../components/ProductDetails/ProductDetailsContent";
import RelatedProducts from "../components/ProductDetails/RelatedProducts/RelatedProducts";
import { getProductById } from "../services/productService"; // Import API call

const ProductDetails: React.FC<any> = (props) => {
  const propsId = props.match.params.id; // Lấy ID từ props
  console.log(propsId);
  const [loading, setLoading] = useState<boolean>(true); // Mặc định là loading
  const [theProduct, setTheProduct] = useState<any>(null); // State để lưu trữ sản phẩm

  // Fetch sản phẩm từ API khi component mount
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const product = await getProductById(propsId); // Gọi API lấy sản phẩm
        setTheProduct(product); // Lưu sản phẩm vào state
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false); // Tắt loading sau khi API hoàn thành
      }
    };

    window.scrollTo(0, 0); // Scroll về đầu trang
    fetchProduct(); // Gọi hàm lấy sản phẩm
  }, [propsId]); // Chỉ gọi khi propsId thay đổi

  return (
    <div className="product-details-content">
      <div className="main">
        {/* ===== breadcrumb ===== */}
        <section id="breadcrumb">
          <div className="container">
            <ul className="breadcrumb-content d-flex m-0 p-0">
              <li>
                <Link to="/">Trang chủ</Link>
              </li>
              <li>
                <Link to="/shop">Cửa hàng</Link>
              </li>
              <li>
                <span>Chi tiết sản phẩm</span>
              </li>
            </ul>
          </div>
        </section>

        {/* ===== content ===== */}
        {loading ? (
          <div className="container">
            <div className="loading-wrapper">
              <p>Loading...</p>
            </div>
          </div>
        ) : (
          <>
            {theProduct ? (
              <ProductDetailsContent product={theProduct} />
            ) : (
              <div className="container">
                <p>Không tìm thấy sản phẩm.</p>
              </div>
            )}
            <RelatedProducts product={theProduct} />
          </>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
