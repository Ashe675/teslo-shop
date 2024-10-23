"use client";
import Image from "next/image";

import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";

import "./slideshow.css";
import { Autoplay, FreeMode, Pagination } from "swiper/modules";

interface Props {
  images: string[];
  title: string;
  className?: string;
}

export const ProductMobileSlideshow = ({ images, title, className }: Props) => {
  return (
    <div className={className}>
      <Swiper
        style={
          {
            width: "100vw",
            height: "500px",
            "--swiper-pagination-color": "#fff",
          } as React.CSSProperties
        }
        pagination={true}
        autoplay={{
          delay: 2500,
        }}
        modules={[FreeMode, Pagination, Autoplay]}
        className="mySwiper2"
      >
        {images.map((img) => (
          <SwiperSlide key={img}>
            <Image
              alt={title}
              src={`/products/${img}`}
              width={600}
              height={500}
              className="object-fill"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
