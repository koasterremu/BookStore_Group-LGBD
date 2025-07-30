import React from "react";
import LoginForm from "../../components/LoginForm";
import { Card, Row, Col } from "antd";

const backgroundStyle = {
  backgroundImage: "url(/img/others/img-17.jpg)",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
};

const textStyle = {
  fontSize: "36px", // kích thước chữ
  fontWeight: "bold", // độ đậm
  color: "#000", // màu đen
};

const LoginOne = (props) => {
  return (
    <div className="h-100" style={backgroundStyle}>
      <div className="container d-flex flex-column justify-content-center h-100">
        <Row justify="center">
          <Col xs={20} sm={20} md={20} lg={7}>
            <Card>
              <div className="my-4">
                <div className="text-center">
                  {/* Thay img bằng TextLogo */}
                  <div style={textStyle}>Book Story</div>
                </div>
                <Row justify="center">
                  <Col xs={24} sm={24} md={20} lg={20}>
                    <LoginForm {...props} />
                  </Col>
                </Row>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default LoginOne;
