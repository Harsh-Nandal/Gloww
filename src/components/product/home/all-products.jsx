"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import ProductSingle from "../product-single/product-single";

// slider setting
const slider_setting = {
  slidesPerView: 6,
  spaceBetween: 20,
  observer: true,
  observeParents: true,
  autoplay: {
    delay: 5000,
    disableOnInteraction: true,
  },
  breakpoints: {
    1200: { slidesPerView: 6 },
    992: { slidesPerView: 4 },
    768: { slidesPerView: 3 },
    576: { slidesPerView: 1 },
    0: { slidesPerView: 1 },
  },
  navigation: {
    nextEl: ".tpproduct-btn__nxt",
    prevEl: ".tpproduct-btn__prv",
  },
};

// tabs
const tabs = ["All Products", "Fruit Drink", "Fresh Fruits", "Vegetables"];

const AllProducts = ({ style_2 = false, style_3 = false }) => {
  const [activeTab, setActiveTab] = useState("All Products");
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ FETCH + TRANSFORM DATA
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();

        let finalData = [];

        if (Array.isArray(data)) {
          finalData = data;
        } else if (data.products) {
          finalData = data.products;
        }

        // ✅ FIX IMAGE STRUCTURE HERE
        const formattedProducts = finalData.map((p) => ({
          ...p,
          image: {
            original: p.images?.[0] || "/placeholder.png",
          },
        }));

        setProducts(formattedProducts);
        setAllProducts(formattedProducts);

      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // tabs (no filtering because category is ID)
  const handleFilter = (tab) => {
    setActiveTab(tab);
    setProducts(allProducts);
  };

  return (
    <section
      className={`weekly-product-area ${
        style_2
          ? "whight-product pt-75 pb-75"
          : style_3
          ? "whight-product tpproduct__padding pt-75 pb-75 pl-65 pr-65 fix"
          : "grey-bg pb-70"
      }`}
    >
      <div className={`${style_3 ? "container-fluid" : "container"}`}>

        {/* Heading */}
        <div className="row">
          <div className="col-lg-12 text-center">
            <div className="tpsection mb-20">
              <h4 className="tpsection__sub-title">~ Special Products ~</h4>
              <h4 className="tpsection__title">Weekly Food Offers</h4>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="row">
          <div className="col-lg-12">
            <div className="tpnavtab__area pb-40">

              <nav>
                <div className="nav nav-tabs">
                  {tabs.map((tab, index) => (
                    <button
                      key={index}
                      className={`nav-link ${
                        activeTab === tab ? "active" : ""
                      }`}
                      onClick={() => handleFilter(tab)}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </nav>

              {/* Slider */}
              <div className="tpproduct__arrow p-relative">
                {loading ? (
                  <p className="text-center">Loading products...</p>
                ) : (
                  <Swiper
                    {...slider_setting}
                    modules={[Navigation]}
                    className="swiper-container tpproduct-active tpslider-bottom p-relative"
                  >
                    {products.length > 0 ? (
                      products.map((product) => (
                        <SwiperSlide key={product._id}>
                          <ProductSingle product={product} />
                        </SwiperSlide>
                      ))
                    ) : (
                      <p>No products found</p>
                    )}
                  </Swiper>
                )}

                {/* Arrows */}
                <div className="tpproduct-btn">
                  <div className="tpprduct-arrow tpproduct-btn__prv">
                    <a href="#"><i className="icon-chevron-left"></i></a>
                  </div>
                  <div className="tpprduct-arrow tpproduct-btn__nxt">
                    <a href="#"><i className="icon-chevron-right"></i></a>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="row">
          <div className="col-lg-12">
            <div className="tpproduct__all-item text-center">
              <span>
                Discover thousands of other quality products.
                <Link href="/shop">
                  Shop All Products <i className="icon-chevrons-right"></i>
                </Link>
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default AllProducts;