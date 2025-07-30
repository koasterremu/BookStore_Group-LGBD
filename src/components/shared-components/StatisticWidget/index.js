import React from "react";
import { Card } from "antd";
import PropTypes from "prop-types";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";

const StatisticWidget = ({
  title,
  value,
  status,
  subtitle,
  prefix,
  imgSrc,
}) => {
  return (
    <Card>
      {/* Flex container to align everything horizontally */}
      <div className="d-flex align-items-center justify-content-between">
        {/* Image aligned to the left */}
        {imgSrc && (
          <img
            src={imgSrc}
            alt="icon"
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              marginRight: "16px", // Space between image and content
            }}
          />
        )}
        {/* Title and content section */}
        <div style={{ flex: 1 }}>
          {" "}
          {/* Flex-grow content to fill remaining space */}
          {title && <h4 className="mb-0">{title}</h4>}
          <div
            className={`${prefix ? "d-flex align-items-center" : ""} ${
              title ? "mt-3" : ""
            }`}
          >
            {prefix ? <div className="mr-2">{prefix}</div> : null}
            <div>
              <div className="d-flex align-items-center">
                <h1 className="mb-0 font-weight-bold">{value}</h1>
                {status ? (
                  <span
                    className={`font-size-md font-weight-bold ml-3 ${
                      status !== 0 && status >= 0
                        ? "text-success"
                        : "text-danger"
                    }`}
                  >
                    {status}%
                    {status !== 0 && status >= 0 ? (
                      <ArrowUpOutlined />
                    ) : (
                      <ArrowDownOutlined />
                    )}
                  </span>
                ) : null}
              </div>
              {subtitle && (
                <div className="text-gray-light mt-1">{subtitle}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

StatisticWidget.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  value: PropTypes.string,
  subtitle: PropTypes.string,
  status: PropTypes.number,
  prefix: PropTypes.element,
  imgSrc: PropTypes.string, // Image source
};

export default StatisticWidget;
