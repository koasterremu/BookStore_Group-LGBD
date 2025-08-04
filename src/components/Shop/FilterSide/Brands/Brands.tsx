import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { SortByBrand } from "../../../../redux/actions/productActions";
import { GetTitle, IsLoading } from "../../../../redux/actions/primaryActions";
import { getAllBrands } from "../../../../services/brandService";

interface BrandsProps {
  setSelectedBrand: (brandId: number | null) => void;
}

const Brands: React.FC<BrandsProps> = ({ setSelectedBrand }) => {
  const dispatch = useDispatch();
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null); // State để lưu nhà xuất bản đang được chọn

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await getAllBrands();
        setBrands(response.content);
      } catch (error) {
        console.error("Error fetching brands", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  return (
    <div className="brands">
      <div className="brands-title">
        <h5>Nhà xuất bản</h5>
      </div>
      <div className="brands-list">
        {loading ? (
          <p>Đang tải...</p>
        ) : (
          <ul>
            <li
              onClick={() => {
                // Nếu đã chọn tất cả (selectedBrandId là null) thì không cho phép click lại
                if (selectedBrandId === null) return;

                setSelectedBrand(null); // Chọn tất cả nhà xuất bản
                setSelectedBrandId(null); // Xóa trạng thái nhà xuất bản đã chọn
                dispatch(GetTitle("Tất cả nhà xuất bản"));
                dispatch(IsLoading(true));
              }}
              style={{
                fontWeight: selectedBrandId === null ? "bold" : "normal", // In đậm khi tất cả nhà xuất bản được chọn
                pointerEvents: selectedBrandId === null ? "none" : "auto", // Vô hiệu hóa click khi đã chọn tất cả
                opacity: 1, // Giảm độ đậm của chữ khi không cho phép click
              }}
            >
              <label className="d-flex align-items-center">
                Tất cả nhà xuất bản
              </label>
            </li>
            {brands.map((brand: any) => (
              <li
                key={brand._id}
                onClick={() => {
                  // Nếu đã chọn nhà xuất bản này, không cho phép click lại
                  if (selectedBrandId === brand._id) return;

                  setSelectedBrand(brand._id);
                  setSelectedBrandId(brand._id); // Cập nhật nhà xuất bản đã chọn
                  dispatch(GetTitle(brand.brandName));
                  dispatch(SortByBrand(brand.brandName));
                  dispatch(IsLoading(true));
                }}
                style={{
                  fontWeight:
                    selectedBrandId === brand._id ? "bold" : "normal", // In đậm nhà xuất bản đang được chọn
                  pointerEvents:
                    selectedBrandId === brand._id ? "none" : "auto", // Vô hiệu hóa click nếu đã chọn nhà xuất bản
                  opacity: 1, // Giảm độ đậm nếu đã chọn
                }}
              >
                <label
                  htmlFor={brand.brandName}
                  className="d-flex align-items-center"
                >
                  {brand.brandName}
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Brands;
