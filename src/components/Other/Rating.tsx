import React from "react";
import { IRatingProps } from "../../types/types";

const Rating: React.FC<IRatingProps> = ({ value, color }) => {
  // Làm tròn đến 1 chữ số thập phân
  const roundedValue = Math.round(value * 10) / 10;

  // Hàm để xác định loại icon sao cần hiển thị
  const getStarClass = (rate: number) => {
    if (roundedValue >= rate) {
      return "fas fa-star"; // Full star
    } else if (roundedValue >= rate - 0.5) {
      return "fas fa-star-half-alt"; // Half star
    } else {
      return "far fa-star"; // Empty star
    }
  };

  return (
    <div className="rating d-flex justify-content-between">
      {[1, 2, 3, 4, 5].map((rate) => (
        <span key={rate}>
          <i style={{ color }} className={getStarClass(rate)}></i>
        </span>
      ))}
    </div>
  );
};

Rating.defaultProps = {
  color: "#FFA41C",
};

export default Rating;
