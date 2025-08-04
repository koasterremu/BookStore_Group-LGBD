import React, { useEffect, useState } from "react";
import { getAllNews } from "../../../services/newService"; // Đường dẫn tới API của bạn
import { Row, Col } from "react-bootstrap";

interface NewsItem {
  _id: number;
  title: string;
  content: string;
  publishDate: string;
  image: string;
}

const NewsSection: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await getAllNews(1, 5, "");
        setNews(data.content);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    fetchNews();
  }, []);

  // Inline style cho các phần tử
  const sectionStyle: React.CSSProperties = {
    padding: "40px 0",
  };

  const newsItemStyle: React.CSSProperties = {
    border: "1px solid #ddd",
    padding: "15px",
    borderRadius: "10px",
    transition: "box-shadow 0.3s ease",
  };

  const newsItemHoverStyle: React.CSSProperties = {
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  };

  const imgStyle: React.CSSProperties = {
    width: "100%",
    height: "auto",
    borderRadius: "5px",
    marginBottom: "15px",
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "10px",
  };

  return (
    <section id="news-section" style={sectionStyle}>
      <div className="container">
        <Row>
          {news.map((item) => (
            <Col
              key={item._id}
              lg={4}
              md={6}
              sm={12}
              className="mb-4"
              style={newsItemStyle}
            >
              <div className="news-item" style={newsItemStyle}>
                <div className="news-img">
                  <img src={item.image} alt={item.title} style={imgStyle} />
                </div>
                <div className="news-content">
                  <h5 style={titleStyle}>{item.title}</h5>
                  {/* <p
                    dangerouslySetInnerHTML={{
                      __html: item.content.substring(0, 200) + "...",
                    }}
                  /> */}
                  <p>
                    <strong>Ngày đăng: </strong>
                    {new Date(item.publishDate).toLocaleDateString()}
                  </p>
                  <a href={`/news/${item._id}`} className="btn btn-primary">
                    Xem thêm
                  </a>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
};

export default NewsSection;
