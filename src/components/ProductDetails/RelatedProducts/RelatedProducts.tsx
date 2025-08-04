import React, { useEffect, useState } from "react";
import ProductCard from "../../ProductCard/ProductCard";
import OwlCarousel from "react-owl-carousel";
import { Options } from "../../Other/OwlCarouselOptions";
import { IProductProps } from "../../../types/types";
import { getAllProducts } from "../../../services/productService"; // Import API

const RelatedProducts: React.FC<any> = ({ product }) => {
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]); // State để lưu danh sách sản phẩm liên quan
  const [loading, setLoading] = useState<boolean>(true); // State để xử lý loading

  // Lấy categoryId từ product
  const categoryId = product?.category?._id;

  // Hàm gọi API lấy sản phẩm liên quan
  const fetchRelatedProducts = async () => {
    try {
      setLoading(true);
      const response = await getAllProducts(
        "",
        categoryId,
        null,
        1,
        10,
        "productName",
        "asc"
      );
      const filteredProducts = response.payload.content.filter(
        (relatedProduct: any) => relatedProduct._id !== product._id
      );
      setRelatedProducts(filteredProducts);
    } catch (error) {
      console.error("Error fetching related products", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (categoryId) {
      fetchRelatedProducts(); // Gọi API khi component được render
    }
  }, [categoryId]);

  return (
    <>
      {!loading && relatedProducts.length !== 0 ? (
        <section id="related-products">
          <div className="container">
            <div className="related-products-content">
              <div className="row">
                <div className="col-12">
                  <div className="title">
                    <h3>Sản phẩm liên quan</h3>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <div className="related-products-slider">
                    <OwlCarousel className="owl-theme" {...Options}>
                      {relatedProducts.map((relatedProduct: any) => (
                        <div key={relatedProduct._id} className="item">
                          <ProductCard product={relatedProduct} />
                        </div>
                      ))}
                    </OwlCarousel>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <p>Không có sản phẩm liên quan.</p>
      )}
    </>
  );
};

export default RelatedProducts;
