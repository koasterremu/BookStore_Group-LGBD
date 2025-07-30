import React from "react";
import {
  SIDE_NAV_WIDTH,
  SIDE_NAV_COLLAPSED_WIDTH,
  NAV_TYPE_TOP,
} from "constants/ThemeConstant";
import { APP_NAME } from "configs/AppConfig";
import { connect } from "react-redux";
import utils from "utils";
import { Grid } from "antd";

const { useBreakpoint } = Grid;

const getLogoWidthGutter = (props, isMobile) => {
  const { navCollapsed, navType } = props;
  const isNavTop = navType === NAV_TYPE_TOP ? true : false;
  if (isMobile && !props.mobileLogo) {
    return 0;
  }
  if (isNavTop) {
    return "auto";
  }
  if (navCollapsed) {
    return `${SIDE_NAV_COLLAPSED_WIDTH}px`;
  } else {
    return `${SIDE_NAV_WIDTH}px`;
  }
};

const getLogoDisplay = (isMobile, mobileLogo) => {
  if (isMobile && !mobileLogo) {
    return "d-none";
  } else {
    return "logo";
  }
};

export const Logo = (props) => {
  const isMobile = !utils.getBreakPoint(useBreakpoint()).includes("lg");
  return (
    <div
      className={getLogoDisplay(isMobile, props.mobileLogo)}
      style={{ width: `${getLogoWidthGutter(props, isMobile)}` }}
    >
      <span
        style={{
          fontSize: isMobile ? "16px" : "24px", // Thay đổi kích thước text theo breakpoint
          fontWeight: "bold",
          // color: logoType === "light" ? "#fff" : "#333", // Đổi màu tùy thuộc vào loại logo (light/dark)
          textAlign: "center",
          display: "block",
          padding: "10px",
        }}
      >
        Book Story
      </span>
    </div>
  );
};

const mapStateToProps = ({ theme }) => {
  const { navCollapsed, navType, logoType } = theme;
  return { navCollapsed, navType, logoType };
};

export default connect(mapStateToProps)(Logo);
