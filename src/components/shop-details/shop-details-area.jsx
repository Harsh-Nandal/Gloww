"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Rating } from "react-simple-star-rating";
import { averageRating, isHot } from "@/utils/utils";
import ReviewForm from "../form/review-form";
import { Video } from "../svg";
import VideoPopup from "../common/modal/video-popup";
import ShopDetailsUpper from "./shop-details-upper";
import Link from "next/link";

const FALLBACK_IMAGE = "/assets/img/product/placeholder.jpg";

const ShopDetailsArea = ({ product, navStyle = false, topThumb = false }) => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [recentProducts, setRecentProducts] = useState([]);

  // ✅ MAP DB DATA
  const reviews = product?.reviews || [];
  const price = product?.price || 0;
  const sale_price = product?.discountPrice || 0;
  const description = product?.description || "";
  const additionalInfo = product?.additionalInfo || [];
  const videoId = product?.videoId;

  // ✅ SAFE IMAGE HELPER
  const getImage = (images) => {
    if (!images || !Array.isArray(images) || images.length === 0) {
      return FALLBACK_IMAGE;
    }
    return images[0];
  };

  // ✅ FETCH RECENT PRODUCTS
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setRecentProducts(data.slice(0, 2));
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <section className="shopdetails-area grey-bg pb-50">
        <div className="container">
          <div className="row">

            {/* LEFT SIDE */}
            <div className="col-lg-10 col-md-12">
              <div className="tpdetails__area mr-60 pb-30">

                <ShopDetailsUpper
                  product={product}
                  navStyle={navStyle}
                  topThumb={topThumb}
                />

                <div className="tpdescription__box">

                  {/* TABS */}
                  <div className="tpdescription__box-center d-flex align-items-center justify-content-center">
                    <nav>
                      <div className="nav nav-tabs">
                        <button className="nav-link active">
                          Product Description
                        </button>
                        <button className="nav-link">
                          ADDITIONAL INFORMATION
                        </button>
                        <button className="nav-link">
                          Reviews ({reviews.length})
                        </button>
                      </div>
                    </nav>
                  </div>

                  <div className="tab-content">

                    {/* DESCRIPTION */}
                    <div className="tab-pane fade show active">
                      <div className="tpdescription__video">
                        <h5 className="tpdescription__product-title">
                          PRODUCT DETAILS
                        </h5>
                        <p>{description}</p>

                        {videoId && (
                          <div className="tpdescription__video-wrapper p-relative mt-30 mb-35 w-img">
                            <Image
                              src="/assets/img/product/product-video1.jpg"
                              width={1036}
                              height={302}
                              alt="video"
                            />
                            <div className="tpvideo__video-btn">
                              <button
                                className="tpvideo__video-icon"
                                onClick={() => setIsVideoOpen(true)}
                              >
                                <Video />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* ADDITIONAL INFO */}
                    <div className="tab-pane fade">
                      {additionalInfo.length > 0 && (
                        <ul className="tpdescription__product-info">
                          {additionalInfo.map((info, i) => (
                            <li key={i}>
                              {info.key}: {info.value}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* REVIEWS */}
                    <div className="tab-pane fade">
                      <div className="tpreview__wrapper">
                        <h4>{reviews.length} Reviews</h4>

                        {reviews.map((review, i) => (
                          <div key={i} className="tpreview__comment">
                            <Image
                              src={review?.user || FALLBACK_IMAGE}
                              alt="user"
                              width={70}
                              height={70}
                            />
                            <p>{review?.comment}</p>
                          </div>
                        ))}

                        <ReviewForm />
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDEBAR */}
            <div className="col-lg-2 col-md-12">
              <div className="tpsidebar pb-30">
                <h4 className="tpsidebar__title mb-15">
                  Recent Products
                </h4>

                {recentProducts.map((item) => {
                  const img = getImage(item?.images);

                  return (
                    <div key={item._id} className="tpsidebar__product-item">
                      <div className="tpsidebar__product-thumb p-relative">
                        <Image
                          src={img}
                          alt="product"
                          width={210}
                          height={210}
                        />

                        {isHot(item?.updatedAt) && (
                          <span className="tpproduct__info-hot bage__hot">
                            HOT
                          </span>
                        )}
                      </div>

                      <div className="tpsidebar__product-content">
                        <h4>
                          <Link href={`/shop-details/${item._id}`}>
                            {item?.name}
                          </Link>
                        </h4>

                        <Rating
                          allowFraction
                          size={16}
                          initialValue={averageRating(item?.reviews || [])}
                          readonly
                        />

                        <div className="tpproduct__price">
                          <span>₹{item?.price}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* VIDEO MODAL */}
      {videoId && (
        <VideoPopup
          isVideoOpen={isVideoOpen}
          setIsVideoOpen={setIsVideoOpen}
          videoId={videoId}
        />
      )}
    </>
  );
};

export default ShopDetailsArea;