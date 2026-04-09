"use client";
import React from "react";
import Image, { StaticImageData } from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, EffectFade } from "swiper/modules";
// internal
import { hero_slider_data } from "@/data/hero-slider-data";
import shape_1 from "@/assets/img/slider/slider-shape-1.png";
import shape_2 from "@/assets/img/slider/slider-shape-2.png";
import shape_3 from "@/assets/img/slider/slider-shape-3.png";
import shape_4 from "@/assets/img/slider/slider-shape-4.png";
import Link from "next/link";

// slider setting
const slider_setting = {
  slidesPerView: 1,
  effect: "fade",
  autoplay: {
    delay: 3500,
    disableOnInteraction: true,
  },
  navigation: {
    nextEl: ".tpslider__arrow-prv",
    prevEl: ".tpslider__arrow-nxt",
  },
  pagination: {
    el: ".slider-pagination",
    clickable: true,
  },
};

// img style
const img_style = {
  width: "100%",
  height: "100%",
};

function ShapeImg({ img, cls }: { img: StaticImageData; cls: string }) {
  return (
    <Image
      className={cls}
      src={img}
      alt="shape"
      style={{ width: "auto", height: "auto" }}
    />
  );
}

const HeroBanner = () => {
  return (
    <>
      <section className="slider-area tpslider-delay">
        <Swiper
          {...slider_setting}
          modules={[Navigation, EffectFade]}
          className="swiper-container slider-active"
        >
          {hero_slider_data.map((item) => (
            <SwiperSlide key={item.id}>
              <div
                className="tpslider pt-90 pb-0 grey-bg"
                style={{backgroundImage: `url(/assets/img/slider/shape-bg.jpg)`}}
              >
                <div className="container">
                  <div className="row align-items-center">
                    <div className="col-xxl-5 col-lg-6 col-md-6 col-12 col-sm-6">
                      <div className="tpslider__content pt-20">
                        <span className="tpslider__sub-title mb-35">
                          {item.subtitle}
                        </span>
                        <h2
                          className="tpslider__title mb-30"
                          dangerouslySetInnerHTML={{ __html: item.title }}
                        ></h2>
                        <p dangerouslySetInnerHTML={{ __html: item.sm_desc }}></p>
                        <div className="tpslider__btn">
                          <Link className="tp-btn" href="/shop">
                            Shop Now
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="col-xxl-7 col-lg-6 col-md-6 col-12 col-sm-6">
                      <div className="tpslider__thumb p-relative pt-15">
                        <Image
                          className="tpslider__thumb-img"
                          src={item.bg_img}
                          width={746}
                          height={485}
                          alt="slider-bg"
                          style={img_style}
                        />
                        <div className="tpslider__shape d-none d-md-block">
                          <ShapeImg img={shape_1} cls="tpslider__shape-one" />
                          <ShapeImg img={shape_2} cls="tpslider__shape-two" />
                          <ShapeImg img={shape_3} cls="tpslider__shape-three" />
                          <ShapeImg img={shape_4} cls="tpslider__shape-four" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}

          <div className="tpslider__arrow d-none  d-xxl-block">
            <button className="tpsliderarrow tpslider__arrow-prv">
              <i className="icon-chevron-left"></i>
            </button>
            <button className="tpsliderarrow tpslider__arrow-nxt">
              <i className="icon-chevron-right"></i>
            </button>
          </div>
          <div className="slider-pagination d-xxl-none"></div>
        </Swiper>
      </section>
    </>
  );
};

export default HeroBanner;
