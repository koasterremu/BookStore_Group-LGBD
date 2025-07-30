import {
  Table,
  Button,
  Popconfirm,
  Pagination,
  Input,
  message,
  Spin,
  Card,
} from "antd";
import React, { useEffect, useState, useCallback } from "react";
import { getAllCategories, deleteCategory } from "services/categoryService";
import { debounce } from "lodash"; // Import debounce từ lodash
import CreateCategoryModal from "./CreateCategoryModal"; // Import modal tạo mới
import EditCategoryModal from "./EditCategoryModal"; // Import modal chỉnh sửa

export default function CategoryManagement() {
  const [categories, setCategories] = useState([]); // State lưu trữ danh mục
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [totalPages, setTotalPages] = useState(1); // Tổng số trang
  const [loading, setLoading] = useState(false); // Trạng thái loading cho bảng
  const [searchTerm, setSearchTerm] = useState(""); // Từ khóa tìm kiếm
  const [editCategoryData, setEditCategoryData] = useState(null); // Dữ liệu để chỉnh sửa danh mục
  const [isCreateOpen, setIsCreateOpen] = useState(false); // Trạng thái của modal tạo mới danh mục
  const [isEditOpen, setIsEditOpen] = useState(false); // Trạng thái của modal chỉnh sửa danh mục
  const limit = 5; // Số lượng danh mục trên mỗi trang

  // Hàm lấy danh mục
  const fetchCategories = useCallback(
    async (search = searchTerm, page = currentPage) => {
      setLoading(true); // Bắt đầu loading
      try {
        const data = await getAllCategories(page, limit, search); // Gọi API lấy danh mục
        setCategories(data.content);
        setTotalPages(data.totalPages);
      } catch (error) {
        message.error("Lỗi khi lấy danh mục.");
      } finally {
        setLoading(false); // Dừng loading
      }
    },
    [currentPage, limit]
  );

  // Hàm debounce tìm kiếm
  const debouncedFetchCategories = useCallback(
    debounce((value) => {
      setCurrentPage(1); // Reset về trang đầu tiên khi tìm kiếm
      fetchCategories(value, 1); // Gọi hàm lấy danh mục với trang 1
    }, 800),
    [fetchCategories]
  );

  // Lấy danh mục khi trang hoặc từ khóa tìm kiếm thay đổi
  useEffect(() => {
    fetchCategories(searchTerm, currentPage); // Gọi lại khi trang hoặc từ khóa tìm kiếm thay đổi
  }, [fetchCategories, currentPage]);

  // Hàm xóa danh mục
  const confirmDeleteCategory = async (categoryId) => {
    try {
      await deleteCategory(categoryId); // Gọi API xóa danh mục
      message.success("Đã xóa danh mục.");
      fetchCategories(); // Lấy lại danh mục sau khi xóa
    } catch (error) {
      message.error("Lỗi khi xóa danh mục.");
    }
  };

  // Hàm xử lý thay đổi trang
  const handlePageChange = (page) => {
    setCurrentPage(page); // Cập nhật trang hiện tại
  };

  // Hàm xử lý khi click vào nút "Sửa"
  const handleEditClick = (record) => {
    setEditCategoryData(record); // Lưu trữ dữ liệu danh mục để chỉnh sửa
    setIsEditOpen(true); // Mở modal chỉnh sửa
  };

  // Cấu hình các cột cho bảng Ant Design
  const columns = [
    {
      title: "Tên Danh Mục",
      dataIndex: "categoryName",
      key: "categoryName",
    },
    {
      title: "Hình Ảnh",
      dataIndex: "image",
      key: "image",
      render: (text) => (
        <img
          src={text || "https://via.placeholder.com/50"}
          alt="Danh mục"
          width={50}
          height={50}
          style={{ borderRadius: "10%" }}
        />
      ),
    },
    {
      title: "Hành Động",
      key: "actions",
      align: "center", // Canh giữa cột Hành Động
      render: (text, record) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            type="primary"
            size="small"
            onClick={() => handleEditClick(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa danh mục này?"
            onConfirm={() => confirmDeleteCategory(record._id)}
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
        {/* Ô tìm kiếm và nút thêm mới danh mục */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <Input
            placeholder="Tìm kiếm danh mục..."
            allowClear
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value); // Cập nhật từ khóa tìm kiếm
              debouncedFetchCategories(e.target.value); // Gọi hàm tìm kiếm
            }}
            style={{ width: "75%" }}
          />
          <Button type="primary" onClick={() => setIsCreateOpen(true)}>
            Thêm Mới Danh Mục
          </Button>
        </div>

        {/* Loading spinner */}
        {loading ? (
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <Spin size="large" />
          </div>
        ) : (
          <>
            {/* Bảng danh mục */}
            <Table
              columns={columns}
              dataSource={categories}
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

      <CreateCategoryModal
        visible={isCreateOpen}
        onCancel={() => setIsCreateOpen(false)}
        refreshCategories={fetchCategories}
      />

      {/* Modal chỉnh sửa danh mục */}
      <EditCategoryModal
        visible={isEditOpen}
        categoryData={editCategoryData}
        refreshCategories={fetchCategories}
        onCancel={() => setIsEditOpen(false)}
      />
    </Card>
  );
}
