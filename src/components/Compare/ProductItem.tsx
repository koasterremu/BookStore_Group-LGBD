import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { AddToCart, MakeIsInCartTrue } from "../../redux/actions/cartActions";
import { RootState } from "../../redux/reducers";
import { RemoveFromCompare } from "../../redux/actions/compareActions";
import { MakeIsInCompareFalse } from "../../redux/actions/productActions";
import { toast } from "react-toastify";
import Rating from "../Other/Rating";
import { formatCurrency } from "../../utils/currencyFormatter"; // Import hàm format tiền tệ
import { Modal } from "react-bootstrap"; // Import Modal từ react-bootstrap (cần cài đặt react-bootstrap)
import ImgSlider from "../ProductDetails/PrimaryInfo/ImgSlider";
import ProductInfo from "../ProductDetails/PrimaryInfo/ProductInfo";

const ProductItem: React.FC<any> = ({ product }) => {
  const cartState = useSelector((state: RootState) => state.cart);
  const cart = cartState.cart;
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false); // State để điều khiển modal
  const [selectedProduct, setSelectedProduct] = useState<any>(null); // State để lưu sản phẩm được chọn

  // Kiểm tra nếu sản phẩm đã có trong giỏ hàng
  cart.map(
    (cartProduct: any) =>
      cartProduct._id === product._id && (product.isInCart = true)
  );

  // Lấy ảnh mặc định (isDefault = true)
  const defaultImage = product.images.find(
    (image: any) => image.isDefault
  )?.imageUrl;

  const handleAddToCart = () => {
    // Kiểm tra nếu có variation thì hiển thị modal
    if (product.variations && product.variations.length > 0) {
      setSelectedProduct(product); // Lưu sản phẩm đã chọn
      setShowModal(true); // Hiển thị modal
    } else {
      // Nếu không có variation, thêm thẳng vào giỏ hàng
      dispatch(AddToCart(product));
      dispatch(MakeIsInCartTrue(product._id));
      toast.success('"' + product.productName + '" đã thêm vào giỏ hàng.');
    }
  };

  const handleClose = () => setShowModal(false); // Đóng modal

  return (
    <div className="compare-product-item">
      <div className="top-part box">
        <div className="remove-btn">
          <button
            type="button"
            onClick={() => {
              dispatch(RemoveFromCompare(product._id));
              dispatch(MakeIsInCompareFalse(product._id));
              toast.error(
                '"' + product.productName + '" đã được xóa khỏi so sánh.'
              );
            }}
          >
            Xóa
          </button>
        </div>
        <div className="product-img d-flex justify-content-center align-items-center">
          <Link to={`/product-details/${product._id}`}>
            <img
              className="img-fluid"
              src={defaultImage}
              alt={product.productName}
            />
          </Link>
        </div>
      </div>
      <div className="middle-part">
        <div className="title">
          <h6>
            <Link
              style={{ color: "#d91f28" }}
              to={`/product-details/${product._id}`}
            >
              {product.productName}
            </Link>
          </h6>
        </div>

        {/* Hiển thị giá theo điều kiện có discount hay không */}
        <div className="price">
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
                {formatCurrency(
                  product.price - (product.price * product.discount) / 100
                )}
              </p>
            </div>
          ) : (
            <p style={{ margin: "0", fontWeight: "bold" }}>
              {formatCurrency(product.price)}
            </p>
          )}
        </div>

        {/* Hiển thị từng variation */}
        {product.variations.map((variation: any) => (
          <div
            key={variation._id}
            className="variation-item"
            style={{ paddingRight: "20px", paddingLeft: "20px" }}
          >
            {/* Hiển thị thông tin variation */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "5px 0",
                borderBottom: "1px solid #ccc",
              }}
            >
              <div>
                <strong>{variation.attributeValue}</strong>
              </div>
              <div>
                <p style={{ fontWeight: "bold", margin: 0 }}>
                  {formatCurrency(variation.price)}
                </p>
                <p style={{ margin: "0", fontSize: "12px", color: "#555" }}>
                  Số lượng: {variation.quantity}
                </p>
              </div>
            </div>
          </div>
        ))}

        <div className="rating-area box">
          <Rating value={product.avgRating} />
        </div>
      </div>
      <div className="bottom-part box d-flex align-items-center">
        <div className="add-to-cart-btn d-flex justify-content-center w-100">
          {product.isInCart ? (
            // ===== Nút đã thêm vào giỏ hàng ===== //
            <button type="button" className="disabledBtn w-100" disabled>
              Đã thêm vào giỏ hàng
            </button>
          ) : (
            // ===== Nút thêm vào giỏ hàng ===== //
            <button
              style={{ color: "#ffffff" }}
              type="button"
              className="w-100"
              onClick={handleAddToCart}
            >
              Thêm vào giỏ hàng
            </button>
          )}
        </div>
      </div>

      {/* Modal hiển thị khi sản phẩm có variation */}
      <Modal show={showModal} onHide={handleClose} className="quick-view-modal">
        <Modal.Body>
          <div className="d-flex justify-content-end">
            <button className="btnClose" onClick={handleClose}>
              ✖
            </button>
          </div>
          <div className="modal-product-info">
            <div className="row">
              <div className="col-lg-6">
                <ImgSlider product={selectedProduct} />
              </div>
              <div className="col-lg-6">
                <ProductInfo product={selectedProduct} />
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ProductItem;
