import React from "react";
import ChairsImg from "../../../assets/img/home-ads/chairs.jpeg";
import ChargerImg from "../../../assets/img/home-ads/charger.jpeg";
import SpeakerImg from "../../../assets/img/home-ads/speaker.jpeg";
import { Link } from "react-router-dom";
import { IAdsData1 } from "../../../types/types";

const HomeAds1: React.FC = () => {
  const AdsData1: IAdsData1[] = [
    { id: 1, img: "https://cdn0.fahasa.com/media/wysiwyg/Thang-11-2024/NgoaiVan_T11_BLACKFRIDAY_310x210.jpg" },
    { id: 2, img: "https://cdn0.fahasa.com/media/wysiwyg/Thang-11-2024/TrangBlackfridayT11_ResizeSmallBanner_310x210_1.png" },
    { id: 3, img: "https://cdn0.fahasa.com/media/wysiwyg/Thang-11-2024/SmallBanner_T11_Alphabooks_smallbanner_310x210.jpg" },
  ];

  return (
    <section id="ads-1">
      <div className="container">
        <div className="row">
          {AdsData1.map((item) => (
            <div key={item.id} className="col-lg-4">
              <div className="ads-img">
                <Link to="/shop">
                  <img
                    src={item.img}
                    alt="ads-img"
                    style={{
                      width: "416px",
                      height: "224px",
                      objectFit: "cover",
                    }}
                  />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeAds1;
