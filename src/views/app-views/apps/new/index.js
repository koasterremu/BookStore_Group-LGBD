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
import { getAllNews, deleteNews } from "services/newService"; // Import service cho news
import { debounce } from "lodash";
import CreateNewModal from "./CreateNewModal"; // Modal cho tạo mới tin tức
import EditNewModal from "./EditNewModal"; // Modal cho chỉnh sửa tin tức

export default function NewManagement() {
  const [news, setNews] = useState([]); // State lưu trữ danh sách tin tức
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [totalPages, setTotalPages] = useState(1); // Tổng số trang
  const [loading, setLoading] = useState(false); // Trạng thái loading cho bảng
  const [searchTerm, setSearchTerm] = useState(""); // Từ khóa tìm kiếm
  const [editNewsData, setEditNewsData] = useState(null); // Dữ liệu để chỉnh sửa tin tức
  const [isCreateOpen, setIsCreateOpen] = useState(false); // Trạng thái của modal tạo mới tin tức
  const [isEditOpen, setIsEditOpen] = useState(false); // Trạng thái của modal chỉnh sửa tin tức
  const limit = 5; // Số lượng tin tức trên mỗi trang

  // Hàm lấy tin tức
  const fetchNews = useCallback(
    async (search = searchTerm, page = currentPage) => {
      setLoading(true); // Bắt đầu loading
      try {
        const data = await getAllNews(page, limit, search); // Gọi API lấy tin tức
        setNews(data.content);
        setTotalPages(data.totalPages);
      } catch (error) {
        message.error("Lỗi khi lấy tin tức.");
      } finally {
        setLoading(false); // Dừng loading
      }
    },
    [currentPage, limit, searchTerm]
  );

  // Hàm debounce tìm kiếm
  const debouncedFetchNews = useCallback(
    debounce((value) => {
      setCurrentPage(1); // Reset về trang đầu tiên khi tìm kiếm
      fetchNews(value, 1); // Gọi hàm lấy tin tức với trang 1
    }, 800),
    [fetchNews]
  );

  // Lấy tin tức khi trang hoặc từ khóa tìm kiếm thay đổi
  useEffect(() => {
    fetchNews(searchTerm, currentPage); // Gọi lại khi trang hoặc từ khóa tìm kiếm thay đổi
  }, [fetchNews, currentPage]);

  // Hàm xóa tin tức
  const confirmDeleteNews = async (newsId) => {
    try {
      await deleteNews(newsId); // Gọi API xóa tin tức
      message.success("Đã xóa tin tức.");
      fetchNews(); // Lấy lại tin tức sau khi xóa
    } catch (error) {
      message.error("Lỗi khi xóa tin tức.");
    }
  };

  // Hàm xử lý thay đổi trang
  const handlePageChange = (page) => {
    setCurrentPage(page); // Cập nhật trang hiện tại
  };

  // Hàm xử lý khi click vào nút "Sửa"
  const handleEditClick = (record) => {
    setEditNewsData(record); // Lưu trữ dữ liệu tin tức để chỉnh sửa
    setIsEditOpen(true); // Mở modal chỉnh sửa
  };

  // Cấu hình các cột cho bảng Ant Design
  const columns = [
    {
      title: "Tiêu Đề",
      dataIndex: "title",
      key: "title",
    },
    // {
    //   title: "Nội Dung",
    //   dataIndex: "content",
    //   key: "content",
    //   render: (text) => (
    //     <div
    //       dangerouslySetInnerHTML={{
    //         __html: text,
    //       }}
    //       style={{
    //         maxHeight: "300px",
    //         maxWidth: "600px",
    //         overflowY: "auto",
    //       }}
    //     />
    //   ), // Hiển thị nội dung HTML
    // },
    {
      title: "Ngày đăng",
      dataIndex: "publishDate",
      key: "publishDate",
      render: (text) => new Date(text).toLocaleString("vi-VN"), // Định dạng ngày
    },
    {
      title: "Hình Ảnh",
      dataIndex: "image",
      key: "image",
      render: (text) => (
        <img
          src={text || "https://via.placeholder.com/50"}
          alt="Tin tức"
          width={80}
          height={80}
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
            title="Bạn có chắc muốn xóa tin tức này?"
            onConfirm={() => confirmDeleteNews(record._id)}
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
        {/* Ô tìm kiếm và nút thêm mới tin tức */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <Input
            placeholder="Tìm kiếm tin tức..."
            allowClear
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value); // Cập nhật từ khóa tìm kiếm
              debouncedFetchNews(e.target.value); // Gọi hàm tìm kiếm
            }}
            style={{ width: "75%" }}
          />
          <Button type="primary" onClick={() => setIsCreateOpen(true)}>
            Thêm Mới Tin Tức
          </Button>
        </div>

        {/* Loading spinner */}
        {loading ? (
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <Spin size="large" />
          </div>
        ) : (
          <>
            {/* Bảng tin tức */}
            <Table
              columns={columns}
              dataSource={news}
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
      <CreateNewModal
        visible={isCreateOpen}
        onCancel={() => setIsCreateOpen(false)}
        refreshNews={fetchNews} // Hàm cập nhật danh sách tin tức
      />

      <EditNewModal
        visible={isEditOpen}
        newsData={editNewsData}
        refreshNews={fetchNews} // Hàm cập nhật danh sách tin tức
        onCancel={() => setIsEditOpen(false)}
      />
    </Card>
  );
}
