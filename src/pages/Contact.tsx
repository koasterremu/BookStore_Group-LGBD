import React, { useEffect } from 'react';
import { Link } from "react-router-dom";
import Map from '../components/Contact/Map/Map';
import ContactItems from '../components/Contact/ContactItems/ContactItems';

const Contact: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="contact-content">
            <div className="main">
                {/* ===== breadcrumb ===== */}
                <section id="breadcrumb">
                    <div className="container">
                        <ul className="breadcrumb-content d-flex m-0 p-0">
                            <li>
                                <Link to="/">Trang chủ</Link>
                            </li>
                            <li>
                                <span>Liên hệ</span>
                            </li>
                        </ul>
                    </div>
                </section>
                {/* ===== content ===== */}
                <Map />
                <ContactItems />
            </div>
        </div>
    )
};

export default Contact;