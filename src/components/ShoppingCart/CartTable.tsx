import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ICartProps } from "../../types/types";
import { formatCurrency } from "../../utils/currencyFormatter";
import { useDispatch } from "react-redux";
import {
  DeleteFromCart,
  IncreaseProductCount,
  DecreaseProductCount,
} from "../../redux/actions/cartActions";
import { MakeIsInCartFalse } from "../../redux/actions/productActions";
import { WishlistProductIsInCartFalse } from "../../redux/actions/wishlistActions";
import { CompareProductIsInCartFalse } from "../../redux/actions/compareActions";
import { toast } from "react-toastify";
import { Table, Button, Typography, Avatar, Tooltip, Tag } from "antd";
import { BsTrash, BsDash, BsPlus } from "react-icons/bs";

const { Text } = Typography;

const CartTable: React.FC<ICartProps> = (props) => {
  const { cart } = props;
  console.log(cart);
  const [size] = useState<number>(1);
  const dispatch = useDispatch();

  const handleIncrease = (_id: number) => {
    dispatch(IncreaseProductCount(_id));
  };

  const handleDecrease = (_id: number, count: number) => {
    if (count > 1) {
      dispatch(DecreaseProductCount(_id));
    }
  };

  const handleDelete = (product: any) => {
    dispatch(DeleteFromCart(product._id));
    dispatch(MakeIsInCartFalse(product._id));
    dispatch(WishlistProductIsInCartFalse(product._id));
    dispatch(CompareProductIsInCartFalse(product._id));
    toast.error(`"${product.productName}" đã được xóa khỏi giỏ hàng.`);
  };

  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: "product",
      key: "product",
      render: (_: any, product: any) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar
            shape="square"
            size={64}
            src={product?.images[0]?.imageUrl || "/placeholder-image.jpg"}
          />
          <Link
            to={`/product-details/${product?._id}`}
            style={{ marginLeft: "10px", color: "#d91f28", fontWeight: "bold" }}
          >
            {product?.productName}
          </Link>
        </div>
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (_: any, product: any) => {
        const discountedPrice = product.selectedPrice
          ? product.selectedPrice * (1 - product.discount / 100)
          : product.price * (1 - product.discount / 100);

        return (
          <div>
            {product.discount ? (
              <>
                <Text delete style={{ color: "gray", marginRight: "8px" }}>
                  {formatCurrency(product.selectedPrice || product.price)} đ
                </Text>
                <Tag color="blue">-{product.discount}%</Tag>
                <Text strong style={{ color: "#d91f28" }}>
                  {formatCurrency(discountedPrice)} đ
                </Text>
              </>
            ) : (
              <Text strong>
                {formatCurrency(product.selectedPrice || product.price)} đ
              </Text>
            )}
          </div>
        );
      },
    },
    {
      title: "Số lượng",
      dataIndex: "count",
      key: "count",
      render: (_: any, product: any) => (
        <Button.Group>
          <Button
            icon={<BsDash />}
            onClick={() => handleDecrease(product._id, product.count)}
            disabled={product.count === 1}
          />
          <Text style={{ margin: "0 10px", fontSize: "16px" }}>
            {product.count}
          </Text>
          <Button
            icon={<BsPlus />}
            onClick={() => handleIncrease(product._id)}
            style={{ backgroundColor: "#d91f28", color: "#fff" }}
          />
        </Button.Group>
      ),
    },
    {
      title: "Tổng",
      dataIndex: "total",
      key: "total",
      render: (_: any, product: any) => {
        const discountedPrice = product.selectedPrice
          ? product.selectedPrice * (1 - product.discount / 100)
          : product.price * (1 - product.discount / 100);
        return (
          <Text strong>
            {formatCurrency(discountedPrice * product.count)} đ
          </Text>
        );
      },
    },
    {
      title: "Xóa",
      dataIndex: "delete",
      key: "delete",
      render: (_: any, product: any) => (
        <Tooltip title="Xóa sản phẩm">
          <Button
            icon={<BsTrash />}
            danger
            onClick={() => handleDelete(product)}
          />
        </Tooltip>
      ),
    },
  ];

  return <Table columns={columns} dataSource={cart} pagination={false} />;
};

export default CartTable;
