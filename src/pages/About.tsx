import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import NewSection from "../components/About/OurTeam/OurTeam";

const About: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
                <span>Bài viết</span>
              </li>
            </ul>
          </div>
        </section>
        {/* ===== content ===== */}
        <NewSection />
      </div>
    </div>
  );
};

export default About;
