import React from 'react';
import "react-image-gallery/styles/scss/image-gallery.scss";
import ImageGallery from 'react-image-gallery';
import { IProductProps, IReactImgGalleryOptions, IReactImgGalleryimages } from '../../../types/types';

const ImgSlider: React.FC<any> = ({ product }) => {
    const options: IReactImgGalleryOptions = {
        showPlayButton: false,
        showFullscreenButton: false,
        autoPlay: true
    };

    // Kiểm tra xem product.images có tồn tại và là một mảng không
    const images: IReactImgGalleryimages[] = product?.images?.map((image: any) => ({
        original: image.imageUrl,   // Sử dụng đường dẫn gốc của ảnh
        thumbnail: image.imageUrl,  // Sử dụng đường dẫn thumbnail (nếu có)
    })) || [];

    return (
        <div className="img-slider">
            <ImageGallery
                items={images}
                {...options}
            />
        </div>
    )
};

export default ImgSlider;
