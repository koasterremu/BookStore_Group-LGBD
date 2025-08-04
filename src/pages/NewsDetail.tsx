import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getNewsById } from "../services/newService"; // Hàm API lấy tin tức theo ID
interface NewsDetailParams {
  id: string;
}

interface NewsItem {
  _id: number;
  title: string;
  content: string;
  publishDate: string;
  image: string;
}
const NewDetail: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const { id } = useParams<NewsDetailParams>();
  const [news, setNews] = useState<NewsItem | null>(null);

  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        console.log("Fetching news with ID:", id); // In ID ra để kiểm tra
        const data = await getNewsById(id);
        setNews(data.payload);
      } catch (error) {
        console.error("Error fetching news detail:", error);
      }
    };

    fetchNewsDetail();
  }, [id]);

  if (!news) {
    return <p>Loading...</p>;
  }

  // Inline styles
  const breadcrumbStyle: React.CSSProperties = {
    padding: "10px 0",
  };

  const articleStyle: React.CSSProperties = {
    padding: "20px 0",
  };

  const imageStyle: React.CSSProperties = {
    width: "100%",
    height: "auto",
    borderRadius: "5px",
    marginBottom: "20px",
  };
  return (
    <div className="about-content">
      <div className="main">
        {/* ===== breadcrumb ===== */}
        <section id="breadcrumb">
          <div className="container">
            <ul className="breadcrumb-content d-flex m-0 p-0">
              <li>
                <Link to="/">Trang chủ</Link>
              </li>
              <li>
                <span>Chi tiết bài viết</span>
              </li>
            </ul>
          </div>
        </section>

        <div className="about-content">
          <div className="main">

            {/* ===== content ===== */}
            <section id="article" style={articleStyle}>
              <div className="container">
                <div className="row">
                  <div className="col-lg-8 col-md-12">
                    <h1>{news.title}</h1>
                    <p>
                      <strong>Ngày đăng:</strong>{" "}
                      {new Date(news.publishDate).toLocaleDateString()}
                    </p>
                    <img src={news.image} alt={news.title} style={imageStyle} />
                    <div
                      className="news-content"
                      dangerouslySetInnerHTML={{ __html: news.content }}
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewDetail;
