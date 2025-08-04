import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { IsLoading, ShowSidebarFilter } from "../redux/actions/primaryActions";
import { Link } from "react-router-dom";
import BrandsSection from "../components/Shop/Brands/Brands";
import Categories from "../components/Shop/FilterSide/Categories/Categories";
import Brands from "../components/Shop/FilterSide/Brands/Brands";
import ProductsSide from "../components/Shop/ProductsSide/ProductsSide";
import { RootState } from "../redux/reducers/index";
import { getAllProducts } from "../services/productService";
import { CircleLoader } from "react-spinners";

const Shop: React.FC = () => {
  const primaryState = useSelector((state: RootState) => state.primary);
  const loading = primaryState.isLoading;
  const showSideFilter = primaryState.showSidebarFilter;
  const dispatch = useDispatch();

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<number | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [totalPagesNum, setTotalPagesNum] = useState<number>(1); // Thêm state cho tổng số trang
  const [currentPage, setCurrentPage] = useState<number>(1); // Thêm state cho trang hiện tại
  const [sortField, setSortField] = useState<string>("productName"); // State cho tiêu chí sắp xếp
  const [sortDirection, setSortDirection] = useState<string>("asc");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fetchProducts = async () => {
    try {
      dispatch(IsLoading(true));
      const response = await getAllProducts(
        "",
        selectedCategory,
        selectedBrand,
        currentPage,
        12,
        sortField,
        sortDirection
      );
      setProducts(response.payload.content);
      setTotalPagesNum(response.payload.totalPages); // Lưu tổng số trang
    } catch (error) {
      console.error("Error fetching products", error);
    } finally {
      dispatch(IsLoading(false));
    }
  };

  // Gọi API khi thay đổi tiêu chí
  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, selectedBrand, currentPage, sortField, sortDirection]);

  // Reset currentPage về 1 khi thay đổi tiêu chí
  useEffect(() => {
    setCurrentPage(1); // Đặt lại trang hiện tại thành 1
  }, [selectedCategory, selectedBrand, sortField, sortDirection]);

  return (
    <div className="shop-content">
      <div className="main">
        <section id="breadcrumb">
          <div className="container">
            <ul className="breadcrumb-content d-flex m-0 p-0">
              <li>
                <Link to="/">Trang chủ</Link>
              </li>
              <li>
                <span>Sản phẩm</span>
              </li>
            </ul>
          </div>
        </section>
        <div className="shop-content-wrapper">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <BrandsSection />
              </div>
            </div>
            <div className="row">
              <div className="col-lg-3">
                <div
                  className={
                    showSideFilter ? "filter-side show-filter" : "filter-side"
                  }
                >
                  <Categories setSelectedCategory={setSelectedCategory} />
                  <Brands setSelectedBrand={setSelectedBrand} />
                </div>
              </div>
              <div className="col-lg-9">
                {loading ? (
                  <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ height: "400px" }}
                  >
                    <CircleLoader color="#36d7b7" size={100} />
                  </div>
                ) : products.length === 0 ? (
                  <small>Không tìm thấy sản phẩm.</small>
                ) : (
                  <ProductsSide
                    products={products}
                    sortField={sortField}
                    sortDirection={sortDirection}
                    setSortField={setSortField}
                    setSortDirection={setSortDirection}
                    totalPagesNum={totalPagesNum}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        <div
          className={showSideFilter ? "dark-bg-color" : "d-none"}
          onClick={() => {
            dispatch(ShowSidebarFilter(false));
          }}
        ></div>
      </div>
    </div>
  );
};

export default Shop;
