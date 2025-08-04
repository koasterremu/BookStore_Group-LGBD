import React, { useState } from "react";
import { Link } from "react-router-dom";
import { getAllProducts } from "../../../services/productService"; // Import hàm gọi API
import { formatCurrency } from "../../../utils/currencyFormatter"; // Import hàm formatCurrency
import Rating from "../../Other/Rating";

const Search: React.FC = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [products, setProducts] = useState<any[]>([]); // Lưu danh sách sản phẩm tìm được
  const [showSearchResult, setShowSearchResult] = useState<boolean>(false);
  const [showCloseBtn, setShowCloseBtn] = useState<boolean>(false);
  const [showSpinner, setShowSpinner] = useState<boolean>(false);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);

    // Nếu giá trị tìm kiếm trống hoặc null, ẩn kết quả tìm kiếm
    if (!value.trim()) {
      setShowSearchResult(false);
      setShowCloseBtn(false);
      setShowSpinner(false);
      return;
    }

    setShowSpinner(true);
    setShowSearchResult(false);
    setShowCloseBtn(false);

    try {
      const response = await getAllProducts(value, null, null, 1, 10); // Gọi API tìm kiếm sản phẩm
      setProducts(response.payload.content); // Lưu kết quả tìm kiếm vào state
      setShowSearchResult(true);
      setShowCloseBtn(true);
    } catch (error) {
      console.error("Error fetching products", error);
    } finally {
      setShowSpinner(false);
    }
  };

  const handleCloseBtnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setShowSearchResult(false);
    setSearchValue("");
    setShowCloseBtn(false);
  };

  const closeSearchUnder992 = () => {
    if (window.innerWidth < 992) {
      setShowSearchResult(false);
    }
  };

  return (
    <div className="search">
      {/* ======= search-form ======= */}
      <form
        className="d-flex"
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => e.preventDefault()}
      >
        <input
          type="text"
          value={searchValue}
          placeholder="Nhập từ khóa..."
          onChange={handleChange}
        />
        <button style={{ width: "180px" }} type="submit">
          Tìm kiếm
        </button>
        <button
          type="button"
          className="close-search-area"
          onClick={() => setShowSearchResult(false)}
        >
          ✕
        </button>
        <button
          type="button"
          className={showCloseBtn ? "close-btn" : "d-none"}
          onClick={handleCloseBtnClick}
        >
          ✕
        </button>
        <div className={showSpinner ? "lds-dual-ring" : "d-none"}></div>
      </form>
      {/* ======= search-result ======= */}
      <div className={showSearchResult ? "search-result-wrapper" : "d-none"}>
        {products.length > 0 ? (
          <div className="search-result">
            {products.map((product) => {
              const defaultImage = product.images.find(
                (image: any) => image.isDefault
              )?.imageUrl;

              // Tính giá sau khi giảm nếu có discount
              const discountPrice =
                product.discount && product.discount > 0
                  ? product.price - (product.price * product.discount) / 100
                  : product.price;

              return (
                <div key={product._id} className="product-item d-flex">
                  <div className="img">
                    <img src={defaultImage} alt={product.productName} />
                  </div>
                  <div className="info">
                    <Link
                      to={`/product-details/${product._id}`}
                      onClick={() => {
                        setShowSearchResult(false);
                        setShowCloseBtn(false);
                        setSearchValue("");
                        closeSearchUnder992();
                      }}
                    >
                      <h6>{product.productName}</h6>
                    </Link>
                    <div
                      className="rating-area box"
                      style={{ display: "inline-block" }}
                    >
                      <Rating value={product.avgRating} />
                    </div>

                    <div className="product-price">
                      {product.discount ? (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          {/* Giá gốc gạch ngang */}
                          <p
                            style={{
                              margin: "0",
                              color: "gray",
                              textDecoration: "line-through",
                              marginRight: "10px", // Tạo khoảng cách giữa giá gốc và giá đã giảm
                            }}
                          >
                            {formatCurrency(product.price)}
                          </p>
                          {/* Giá sau khi giảm */}
                          <p
                            style={{
                              margin: "0",
                              color: "red",
                              fontWeight: "bold",
                            }}
                          >
                            {formatCurrency(discountPrice)}
                          </p>
                        </div>
                      ) : (
                        <p style={{ margin: "0", fontWeight: "bold" }}>
                          {formatCurrency(product.price)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="my-2">Không tìm thấy sản phẩm nào.</p>
        )}
      </div>
    </div>
  );
};

export default Search;
