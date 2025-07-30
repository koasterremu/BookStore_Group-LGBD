import {
  Table,
  Button,
  Popconfirm,
  Pagination,
  Input,
  message,
  Spin,
  Card,
  Switch,
} from "antd";
import React, { useEffect, useState, useCallback } from "react";
import {
  getAllVouchers,
  deleteVoucher,
  changeVoucherStatus,
} from "services/voucherService"; // Import service cho voucher
import { debounce } from "lodash";
import moment from "moment";
import CreateVoucherModal from "./CreateVoucherModal"; // Modal cho tạo mới voucher
import EditVoucherModal from "./EditVoucherModal"; // Modal cho chỉnh sửa voucher

export default function VoucherManagement() {
  const [vouchers, setVouchers] = useState([]); // State lưu trữ danh sách voucher
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [totalPages, setTotalPages] = useState(1); // Tổng số trang
  const [loading, setLoading] = useState(false); // Trạng thái loading cho bảng
  const [searchTerm, setSearchTerm] = useState(""); // Từ khóa tìm kiếm
  const [editVoucherData, setEditVoucherData] = useState(null); // Dữ liệu để chỉnh sửa voucher
  const [isCreateOpen, setIsCreateOpen] = useState(false); // Trạng thái của modal tạo mới voucher
  const [isEditOpen, setIsEditOpen] = useState(false); // Trạng thái của modal chỉnh sửa voucher
  const limit = 5; // Số lượng voucher trên mỗi trang

  // Hàm lấy voucher
  const fetchVouchers = useCallback(
    async (search = searchTerm, page = currentPage) => {
      setLoading(true); // Bắt đầu loading
      try {
        const data = await getAllVouchers(page, limit, search); // Gọi API lấy voucher
        setVouchers(data.content);
        setTotalPages(data.totalPages);
      } catch (error) {
        message.error("Lỗi khi lấy voucher.");
      } finally {
        setLoading(false); // Dừng loading
      }
    },
    [currentPage, limit]
  );

  // Hàm debounce tìm kiếm
  const debouncedFetchVouchers = useCallback(
    debounce((value) => {
      setCurrentPage(1); // Reset về trang đầu tiên khi tìm kiếm
      fetchVouchers(value, 1); // Gọi hàm lấy voucher với trang 1
    }, 800),
    [fetchVouchers]
  );

  // Lấy voucher khi trang hoặc từ khóa tìm kiếm thay đổi
  useEffect(() => {
    fetchVouchers(searchTerm, currentPage); // Gọi lại khi trang hoặc từ khóa tìm kiếm thay đổi
  }, [fetchVouchers, currentPage]);

  // Hàm xóa voucher
  const confirmDeleteVoucher = async (id) => {
    try {
      await deleteVoucher(id); // Gọi API xóa voucher
      message.success("Đã xóa voucher.");
      fetchVouchers(); // Lấy lại voucher sau khi xóa
    } catch (error) {
      message.error("Lỗi khi xóa voucher.");
    }
  };

  // Hàm thay đổi trạng thái voucher
  const handleChangeStatus = async (id) => {
    try {
      await changeVoucherStatus(id); // Gọi API thay đổi trạng thái voucher
      message.success("Đã thay đổi trạng thái voucher.");
      fetchVouchers(); // Cập nhật lại danh sách voucher
    } catch (error) {
      message.error("Lỗi khi thay đổi trạng thái voucher.");
    }
  };

  // Hàm xử lý thay đổi trang
  const handlePageChange = (page) => {
    setCurrentPage(page); // Cập nhật trang hiện tại
  };

  // Hàm xử lý khi click vào nút "Sửa"
  const handleEditClick = (record) => {
    setEditVoucherData(record); // Lưu trữ dữ liệu voucher để chỉnh sửa
    setIsEditOpen(true); // Mở modal chỉnh sửa
  };

  // Cấu hình các cột cho bảng Ant Design
  const columns = [
    {
      title: "Mã Voucher",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Giảm Giá (%)",
      dataIndex: "discount",
      key: "discount",
    },
    {
      title: "Ngày Hết Hạn",
      dataIndex: "expirationDate",
      key: "expirationDate",
      render: (text) => moment(text).format("DD/MM/YYYY"), // Định dạng ngày
    },
    {
      title: "Đã Sử Dụng",
      dataIndex: "isUsed",
      key: "isUsed",
      render: (text, record) => (
        <Switch
          checked={text}
          onChange={() => handleChangeStatus(record._id)}
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
            title="Bạn có chắc muốn xóa voucher này?"
            onConfirm={() => confirmDeleteVoucher(record._id)}
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
        {/* Ô tìm kiếm và nút thêm mới voucher */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <Input
            placeholder="Tìm kiếm voucher..."
            allowClear
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value); // Cập nhật từ khóa tìm kiếm
              debouncedFetchVouchers(e.target.value); // Gọi hàm tìm kiếm
            }}
            style={{ width: "75%" }}
          />
          <Button type="primary" onClick={() => setIsCreateOpen(true)}>
            Thêm Mới Voucher
          </Button>
        </div>

        {/* Loading spinner */}
        {loading ? (
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <Spin size="large" />
          </div>
        ) : (
          <>
            {/* Bảng voucher */}
            <Table
              columns={columns}
              dataSource={vouchers}
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
      <CreateVoucherModal
        visible={isCreateOpen}
        onCancel={() => setIsCreateOpen(false)}
        refreshVouchers={fetchVouchers} // Hàm cập nhật danh sách voucher
      />
      <EditVoucherModal
        visible={isEditOpen}
        voucherData={editVoucherData}
        refreshVouchers={fetchVouchers} // Hàm cập nhật danh sách voucher
        onCancel={() => setIsEditOpen(false)}
      />
    </Card>
  );
}
