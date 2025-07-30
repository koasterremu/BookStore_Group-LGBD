import {
  Table,
  Button,
  Popconfirm,
  Pagination,
  Input,
  message,
  Spin,
  Card,
  Select,
  Avatar,
  Modal,
  List,
} from "antd";
import React, { useEffect, useState, useCallback } from "react";
import { getAllProducts, deleteProduct } from "services/productService";
import { getAllCategories } from "services/categoryService";
import { getAllBrands } from "services/brandService";
import { debounce } from "lodash";
import { formatCurrency } from "utils/formatCurrency";
import CreateProductModal from "./CreateProductModal";
import EditProductModal from "./EditProductModal";
import ProductImageModal from "./ProductImageModal"; // Import modal
import { getProductImages } from "services/productImageService"; // Import service

const { Option } = Select;

export default function ProductManagement() {
  const [products, setProducts] = useState([]); // State để lưu trữ sản phẩm
  const [categories, setCategories] = useState([]); // State để lưu trữ danh mục cho bộ lọc
  const [brands, setBrands] = useState([]); // State để lưu trữ nhà xuất bản cho bộ lọc
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [totalPages, setTotalPages] = useState(1); // Tổng số trang
  const [loading, setLoading] = useState(false); // Trạng thái loading
  const [searchTerm, setSearchTerm] = useState(""); // Từ khóa tìm kiếm
  const [selectedCategory, setSelectedCategory] = useState(null); // Danh mục đã chọn để lọc
  const [selectedBrand, setSelectedBrand] = useState(null); // Nhà Xuất Bản đã chọn để lọc
  const [editProductData, setEditProductData] = useState(null); // Dữ liệu để chỉnh sửa sản phẩm
  const [isCreateOpen, setIsCreateOpen] = useState(false); // Trạng thái của modal tạo sản phẩm
  const [isEditOpen, setIsEditOpen] = useState(false); // Trạng thái của modal chỉnh sửa sản phẩm
  const [isImageModalOpen, setIsImageModalOpen] = useState(false); // Trạng thái của modal hình ảnh
  const [productId, setProductId] = useState("");
  const limit = 5; // Số lượng sản phẩm trên mỗi trang

  // Hàm lấy sản phẩm
  const fetchProducts = useCallback(
    async (
      search = searchTerm,
      page = currentPage,
      categoryId = selectedCategory,
      brandId = selectedBrand
    ) => {
      setLoading(true);
      try {
        const data = await getAllProducts(
          search,
          categoryId,
          brandId,
          page,
          limit
        ); // Gọi API để lấy sản phẩm
        setProducts(data.content);
        setTotalPages(data.totalPages);
      } catch (error) {
        message.error("Lỗi khi lấy sản phẩm.");
      } finally {
        setLoading(false);
      }
    },
    [currentPage, limit, selectedCategory, selectedBrand]
  );

  // Hàm lấy danh mục và nhà xuất bản
  const fetchCategoriesAndBrands = async () => {
    const [categoryData, brandData] = await Promise.all([
      getAllCategories(),
      getAllBrands(),
    ]);
    setCategories(categoryData.content);
    setBrands(brandData.content);
  };

  // Hàm debounce tìm kiếm
  const debouncedFetchProducts = useCallback(
    debounce((value) => {
      setCurrentPage(1);
      fetchProducts(value, 1);
    }, 800),
    [fetchProducts]
  );

  // Lấy sản phẩm khi trang hoặc từ khóa tìm kiếm thay đổi
  useEffect(() => {
    fetchProducts(searchTerm, currentPage);
  }, [fetchProducts, currentPage]);

  // Lấy danh mục và nhà xuất bản khi component mount
  useEffect(() => {
    fetchCategoriesAndBrands(); // Gọi để lấy danh mục và nhà xuất bản
  }, []);

  // Xử lý thay đổi danh mục
  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setCurrentPage(1);
    fetchProducts(searchTerm, 1, value, selectedBrand);
  };

  // Xử lý thay đổi nhà xuất bản
  const handleBrandChange = (value) => {
    setSelectedBrand(value);
    setCurrentPage(1);
    fetchProducts(searchTerm, 1, selectedCategory, value);
  };

  // Hàm xóa sản phẩm
  const confirmDeleteProduct = async (productId) => {
    try {
      await deleteProduct(productId); // Gọi API để xóa sản phẩm
      message.success("Đã xóa sản phẩm.");
      fetchProducts(); // Lấy lại sản phẩm sau khi xóa
    } catch (error) {
      message.error("Lỗi khi xóa sản phẩm.");
    }
  };

  // Xử lý thay đổi trang
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Xử lý khi click vào nút "Sửa"
  const handleEditClick = (record) => {
    console.log(record);
    setEditProductData(record); // Lưu dữ liệu sản phẩm để chỉnh sửa
    setIsEditOpen(true); // Mở modal chỉnh sửa
  };

  // Xử lý khi click vào nút "Sửa Ảnh"
  // Xử lý khi click vào nút "Sửa Ảnh"
  const handleEditImages = async (productId) => {
    try {
      setProductId(productId);
      setIsImageModalOpen(true); // Mở modal hình ảnh
    } catch (error) {
      message.error("Lỗi khi lấy hình ảnh sản phẩm.");
    }
  };

  // Cấu hình các cột cho bảng Ant Design
  const columns = [
    {
      title: "Tên Sản Phẩm",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (text) => `${formatCurrency(text)}`, // Định dạng giá
    },
    {
      title: "Danh Mục",
      dataIndex: ["category", "categoryName"],
      key: "categoryName",
    },
    {
      title: "Nhà Xuất Bản",
      dataIndex: ["brand", "brandName"],
      key: "brandName",
    },
    {
      title: "Hình Ảnh",
      dataIndex: "images",
      key: "images",
      render: (images) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          {" "}
          {/* Sử dụng flex để tạo hàng */}
          {images.slice(0, 3).map((image) => (
            <Avatar
              key={image._id}
              src={image.imageUrl}
              size={40}
              style={{ marginRight: 5 }} // Tạo khoảng cách giữa các hình ảnh
            />
          ))}
          {images.length > 3 && <span>+{images.length - 3}</span>}
        </div>
      ),
    },
    {
      title: "Số Lượng",
      dataIndex: "stock",
      key: "stock",
    },
    {
      title: "Hành Động",
      key: "actions",
      align: "center",
      render: (text, record) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            type="primary"
            size="small"
            onClick={() => handleEditClick(record)}
          >
            Sửa
          </Button>
          <Button
            type="default"
            size="small"
            onClick={() => handleEditImages(record._id)} // Sửa Ảnh
            style={{ marginLeft: "10px" }}
          >
            Sửa Ảnh
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa sản phẩm này?"
            onConfirm={() => confirmDeleteProduct(record._id)}
            okText="Có"
            cancelText="Không"
          >
            <Button size="small" style={{ marginLeft: "10px" }}>
              Xóa
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <Card>
      <div>
        {/* Ô tìm kiếm và các bộ lọc */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <Input
            placeholder="Tìm kiếm sản phẩm..."
            allowClear
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value); // Cập nhật từ khóa tìm kiếm
              debouncedFetchProducts(e.target.value); // Gọi hàm tìm kiếm
            }}
            style={{ width: "40%" }}
          />
          <Select
            placeholder="Chọn Danh Mục"
            onChange={handleCategoryChange}
            style={{ width: "20%", marginLeft: "10px" }}
            allowClear
          >
            {categories.map((category) => (
              <Option key={category._id} value={category._id}>
                {category.categoryName}
              </Option>
            ))}
          </Select>
          <Select
            placeholder="Chọn Nhà Xuất Bản"
            onChange={handleBrandChange}
            style={{ width: "20%", marginLeft: "10px" }}
            allowClear
          >
            {brands.map((brand) => (
              <Option key={brand._id} value={brand._id}>
                {brand.brandName}
              </Option>
            ))}
          </Select>
          <Button type="primary" onClick={() => setIsCreateOpen(true)}>
            Thêm Mới Sản Phẩm
          </Button>
        </div>

        {/* Spinner loading */}
        {loading ? (
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <Spin size="large" />
          </div>
        ) : (
          <>
            {/* Bảng sản phẩm */}
            <Table
              columns={columns}
              dataSource={products}
              pagination={false}
              rowKey={(record) => record._id}
            />

            {/* Phân trang */}
            <Pagination
              current={currentPage}
              total={totalPages * limit}
              pageSize={limit}
              onChange={handlePageChange}
              style={{ marginTop: "20px", textAlign: "center" }}
            />
          </>
        )}
      </div>

      <CreateProductModal
        visible={isCreateOpen}
        onCancel={() => setIsCreateOpen(false)}
        refreshProducts={fetchProducts}
        categories={categories}
        brands={brands}
      />

      {/* Modal chỉnh sửa sản phẩm */}
      <EditProductModal
        visible={isEditOpen}
        productData={editProductData}
        refreshProducts={fetchProducts}
        onCancel={() => setIsEditOpen(false)}
        categories={categories}
        brands={brands}
      />

      {/* Modal hiển thị hình ảnh sản phẩm */}
      <ProductImageModal
        visible={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        productId={productId}
      />
    </Card>
  );
}
