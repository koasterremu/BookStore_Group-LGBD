import React, { useState } from "react";
import { Link } from "react-router-dom";
import { HiArrowNarrowLeft } from "react-icons/hi";
import { RootState } from "../../redux/reducers";
import { useSelector, useDispatch } from "react-redux";
import { AddToCart, MakeIsInCartTrue } from "../../redux/actions/cartActions";
import { RemoveFromWishlist } from "../../redux/actions/wishlistActions";
import { MakeIsInWishlistFalse } from "../../redux/actions/productActions";
import { toast } from "react-toastify";
import { formatCurrency } from "../../utils/currencyFormatter"; // Hàm format tiền tệ
import { Modal } from "react-bootstrap"; // Import Modal
import ImgSlider from "../ProductDetails/PrimaryInfo/ImgSlider"; // Component for image slider
import ProductInfo from "../ProductDetails/PrimaryInfo/ProductInfo"; // Component for product information

const WishlistSection: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const cartState = useSelector((state: RootState) => state.cart);
  const wishlistState = useSelector((state: RootState) => state.wishlist);
  const cart = cartState.cart;
  const wishlist = wishlistState.wishlist;
  const dispatch = useDispatch();

  const handleClose = () => setShowModal(false);
  const handleShow = (product: any) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  cart.forEach((cartProduct: any) => {
    wishlist.forEach((product: any) => {
      if (cartProduct._id === product._id) {
        product.isInCart = cartProduct.isInCart;
      }
    });
  });

  return (
    <section id="wishlist">
      <div className="container">
        <div className="row">
          <div className="col-12">
            {/* ======= tiêu đề ======= */}
            <div className="title text-center">
              <h1>Danh sách yêu thích</h1>
            </div>
          </div>
        </div>
        {wishlist.length > 0 ? (
          <>
            <div className="row">
              {/* ======= sản phẩm trong danh sách yêu thích ======= */}
              <div className="col-12">
                <div className="wishlist-product-item">
                  <table className="w-100">
                    {/* ======= tiêu đề bảng ======= */}
                    <thead>
                      <tr>
                        <th>Xóa</th>
                        <th>Hình ảnh</th>
                        <th>Tên</th>
                        <th>Giá</th>
                        <th>Thêm vào giỏ hàng</th>
                      </tr>
                    </thead>
                    {/* ======= nội dung bảng ======= */}
                    <tbody>
                      {wishlist.map((product: any) => {
                        // Lấy ảnh mặc định từ product.images
                        const defaultImage = product.images.find(
                          (img: any) => img.isDefault
                        )?.imageUrl;

                        // Tính toán giá sau khi giảm
                        const discountPrice =
                          product.price -
                          (product.price * product.discount) / 100;

                        return (
                          <tr key={product._id}>
                            <td>
                              {/* ===== nút xóa ===== */}
                              <div className="remove-btn">
                                <button
                                  type="button"
                                  onClick={(
                                    e: React.MouseEvent<HTMLButtonElement>
                                  ) => {
                                    dispatch(
                                      RemoveFromWishlist(product._id)
                                    );
                                    dispatch(
                                      MakeIsInWishlistFalse(product._id)
                                    );
                                    toast.error(
                                      '"' +
                                        product.productName +
                                        '" đã được xóa khỏi danh sách yêu thích.'
                                    );
                                  }}
                                >
                                  ✕
                                </button>
                              </div>
                            </td>
                            <td className="img-td">
                              {/* ===== hình ảnh sản phẩm ===== */}
                              <div className="product-img">
                                <Link
                                  to={`/product-details/${product._id}`}
                                >
                                  <img
                                    src={defaultImage}
                                    className="img-fluid"
                                    alt={product.productName}
                                  />
                                </Link>
                              </div>
                            </td>
                            <td>
                              {/* ===== tên sản phẩm ===== */}
                              <div className="product-name">
                                <Link
                                  style={{ color: "#d91f28" }}
                                  to={`/product-details/${product._id}`}
                                >
                                  {product.productName}
                                </Link>
                              </div>
                            </td>
                            <td>
                              {/* ===== giá sản phẩm với discount ===== */}
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
                                  <p
                                    style={{ margin: "0", fontWeight: "bold" }}
                                  >
                                    {formatCurrency(product.price)}
                                  </p>
                                )}
                              </div>
                            </td>
                            <td className="btn-td">
                              {product.isInCart ? (
                                // ===== đã thêm vào giỏ hàng ===== //
                                <div className="add-to-cart-btn d-flex">
                                  <button
                                    type="button"
                                    className="disabledBtn"
                                    disabled
                                  >
                                    Đã thêm vào giỏ hàng
                                  </button>
                                </div>
                              ) : (
                                // ===== thêm vào giỏ hàng hoặc hiển thị modal ===== //
                                <div className="add-to-cart-btn d-flex">
                                  <button
                                    type="button"
                                    style={{ color: "#ffffff" }}
                                    onClick={(
                                      e: React.MouseEvent<HTMLButtonElement>
                                    ) => {
                                      if (product.variations.length > 0) {
                                        handleShow(product); // Hiển thị modal nếu có variations
                                      } else {
                                        dispatch(AddToCart(product));
                                        dispatch(
                                          MakeIsInCartTrue(product._id)
                                        );
                                        toast.success(
                                          '"' +
                                            product.productName +
                                            '" đã thêm vào giỏ hàng.'
                                        );
                                      }
                                    }}
                                  >
                                    Thêm vào giỏ hàng
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        ) : (
          // ======= thông báo khi danh sách rỗng ======= //
          <>
            <div className="empty-alert-wrapper">
              <p className="m-0">
                Danh sách yêu thích của bạn hiện đang trống.
              </p>
            </div>
            <div className="back-to-shop-link">
              <Link to="/shop" className="d-flex align-items-center">
                <span>
                  <HiArrowNarrowLeft color={"#ffffff"} />
                </span>
                <p style={{ color: "#ffffff" }} className="m-0">
                  Quay lại
                </p>
              </Link>
            </div>
          </>
        )}
      </div>

      {/* ======= Modal để hiển thị thông tin sản phẩm có variations ======= */}
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
    </section>
  );
};

export default WishlistSection;
