import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Card, Button, Tooltip, Modal, Badge, Typography, Tag } from "antd";
import { FiBarChart2 } from "react-icons/fi";
import { BsHeart, BsBag } from "react-icons/bs";
import { AiOutlineSearch } from "react-icons/ai";
import { toast } from "react-toastify";
import { RootState } from "../../redux/reducers/index";
import ProductInfo from "../ProductDetails/PrimaryInfo/ProductInfo";
import ImgSlider from "../ProductDetails/PrimaryInfo/ImgSlider";
import Rating from "../Other/Rating";
import { AddToCart, MakeIsInCartTrue } from "../../redux/actions/cartActions";
import {
  AddToWishlist,
  MakeIsInWishlistTrueInWishlist,
} from "../../redux/actions/wishlistActions";
import {
  AddToCompare,
  MakeIsInCompareTrueInCompare,
} from "../../redux/actions/compareActions";
import { formatCurrency } from "../../utils/currencyFormatter";

const { Text, Paragraph } = Typography;

interface IImage {
  imageId: number;
  imageUrl: string;
  isDefault: boolean;
}

interface ProductProps {
  product: any;
}

const ProductCard: React.FC<ProductProps> = ({ product }) => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [hoverImage, setHoverImage] = useState<string | null>(null);

  const cart = useSelector((state: RootState) => state.cart.cart);
  const wishlist = useSelector((state: RootState) => state.wishlist.wishlist);
  const compare = useSelector((state: RootState) => state.compare.compare);

  const isInCart = cart.some(
    (cartProduct: { _id: any }) =>
      cartProduct._id === product._id
  );
  const isInWishlist = wishlist.some(
    (wishlistProduct: { _id: any }) =>
      wishlistProduct._id === product._id
  );
  const isInCompare = compare.some(
    (compareProduct: { _id: any }) =>
      compareProduct._id === product._id
  );

  const defaultImage =
    product.images?.find((image: IImage) => image.isDefault)?.imageUrl ||
    "/placeholder-image.jpg";
  const hoverImageSrc = product.images?.[1]?.imageUrl || defaultImage;
  const isOutOfStock = product.stock <= 0;

  return (
    <>
      <Badge.Ribbon
        text={
          isOutOfStock
            ? "Hết hàng"
            : product.discount > 0
            ? `-${product.discount}%`
            : ""
        }
        color={isOutOfStock ? "red" : "#d91f28"}
        style={{ fontSize: "14px", fontWeight: "bold" }}
      >
        <Card
          hoverable
          cover={
            <Link to={`/product-details/${product._id}`}>
              <div
                style={{
                  width: "100%",
                  height: "200px",
                  overflow: "hidden",
                  borderRadius: "6px",
                  position: "relative",
                }}
                onMouseEnter={() => setHoverImage(hoverImageSrc)}
                onMouseLeave={() => setHoverImage(null)}
              >
                <img
                  src={hoverImage || defaultImage}
                  alt={product.productName}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "opacity 0.4s ease-in-out",
                    opacity: hoverImage ? 0.7 : 1, // Hiệu ứng mờ dần khi hover
                  }}
                />
              </div>
            </Link>
          }
          style={{
            opacity: isOutOfStock ? 0.6 : 1,
            pointerEvents: isOutOfStock ? "none" : "auto",
            borderRadius: "10px",
            overflow: "hidden",
            padding: "10px",
          }}
        >
          {/* Hiển thị category bằng Tag đẹp hơn */}
          <Tag
            color="#d91f28"
            style={{ fontSize: "12px", marginBottom: "4px", color: "white" }}
          >
            {product.category.categoryName}
          </Tag>

          {/* Tên sản phẩm tối đa 2 dòng */}
          <Paragraph
            ellipsis={{ rows: 2, expandable: false }}
            strong
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              lineHeight: "1.4",
              color: "#333",
            }}
          >
            <Link
              to={`/product-details/${product._id}`}
              style={{ color: "#333" }}
            >
              {product.productName}
            </Link>
          </Paragraph>

          {/* Giá sản phẩm */}
          <div
            style={{ display: "flex", alignItems: "center", marginTop: "4px" }}
          >
            <Text strong style={{ color: "#d91f28", fontSize: "12px" }}>
              {formatCurrency(product.price * (1 - product.discount / 100))}
            </Text>
            {product.discount > 0 && (
              <Text
                delete
                style={{
                  fontSize: "12px",
                  color: "#999",
                  marginLeft: "8px",
                }}
              >
                {formatCurrency(product.price)}
              </Text>
            )}
          </div>

          {/* Đánh giá */}
          <Rating value={product.avgRating} />

          {/* Hành động */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "8px",
              marginTop: "10px",
            }}
          >
            <Tooltip title="Xem chi tiết">
              <Button
                style={{ borderColor: "#d91f28", color: "#d91f28" }}
                shape="circle"
                icon={<AiOutlineSearch />}
                onClick={() => setShowModal(true)}
              />
            </Tooltip>

            {isOutOfStock ? (
              <Tooltip
                title={isOutOfStock ? "Đã hết hàng" : "Đã thêm vào giỏ hàng"}
              >
                <Button shape="circle" icon={<BsBag />} disabled />
              </Tooltip>
            ) : (
              <Tooltip title="Thêm vào giỏ hàng">
                <Button
                  shape="circle"
                  style={{ borderColor: "#d91f28", color: "#d91f28" }}
                  icon={<BsBag />}
                  onClick={() => {
                    if (product.variations.length > 0) {
                      // Nếu có biến thể, mở modal chọn biến thể
                      setShowModal(true);
                    } else {
                      // Nếu không có biến thể, thêm trực tiếp vào giỏ hàng
                      dispatch(AddToCart(product));
                      dispatch(MakeIsInCartTrue(product._id));
                      toast.success(
                        `"${product.productName}" đã được thêm vào giỏ hàng`
                      );
                    }
                  }}
                />
              </Tooltip>
            )}

            {isInWishlist ? (
              <Tooltip title="Đã thêm vào yêu thích">
                <Button shape="circle" icon={<BsHeart />} disabled />
              </Tooltip>
            ) : (
              <Tooltip title="Thêm vào yêu thích">
                <Button
                  shape="circle"
                  style={{ borderColor: "#d91f28", color: "#d91f28" }}
                  icon={<BsHeart />}
                  onClick={() => {
                    dispatch(AddToWishlist(product));
                    dispatch(MakeIsInWishlistTrueInWishlist(product._id));
                    toast.success(
                      `"${product.productName}" đã thêm vào yêu thích`
                    );
                  }}
                />
              </Tooltip>
            )}

            {isInCompare ? (
              <Tooltip title="Đã thêm vào so sánh">
                <Button shape="circle" icon={<FiBarChart2 />} disabled />
              </Tooltip>
            ) : (
              <Tooltip title="Thêm vào so sánh">
                <Button
                  shape="circle"
                  style={{ borderColor: "#d91f28", color: "#d91f28" }}
                  icon={<FiBarChart2 />}
                  onClick={() => {
                    dispatch(AddToCompare(product));
                    dispatch(MakeIsInCompareTrueInCompare(product._id));
                    toast.success(
                      `"${product.productName}" đã thêm vào so sánh`
                    );
                  }}
                />
              </Tooltip>
            )}
          </div>
        </Card>
      </Badge.Ribbon>

      {/* Modal Xem nhanh */}
      <Modal
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
        centered
        width={800}
      >
        <div className="modal-product-info" style={{ padding: "20px" }}>
          <div className="row">
            <div className="col-lg-6">
              <ImgSlider product={product} />
            </div>
            <div className="col-lg-6">
              <ProductInfo product={product} />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ProductCard;
