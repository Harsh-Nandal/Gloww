"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useAppDispatch } from "@/redux/hook";
import { add_cart_product } from "@/redux/features/cart";

const FALLBACK_IMAGE = "/assets/img/product/placeholder.jpg";

type IProps = {
  product: any;
};

const ShopDetailsBox = ({ product }: IProps) => {
  const dispatch = useAppDispatch();

  const images = product?.images || [];
  const price = product?.price || 0;
  const sale_price = product?.discountPrice || 0;
  const stock = product?.stock || 0;
  const category = product?.category;
  const brand = product?.brand;

  const [qty, setQty] = useState(1);

  const getImage = (imgs: any) => {
    if (!Array.isArray(imgs) || imgs.length === 0) {
      return FALLBACK_IMAGE;
    }
    return imgs[0];
  };

  const [activeImg, setActiveImg] = useState(getImage(images));

  const handleActiveImg = (img: string) => {
    setActiveImg(img);
  };

  // ✅ FIXED ADD TO CART
  const handleAddToCart = () => {
    if (qty <= 0) return;

    dispatch(
      add_cart_product({
        ...product,
        quantity: qty, // ✅ PASS FULL QTY
      })
    );

    setQty(1);
  };

  return (
    <div className="tpdetails__box">
      <div className="row">

        {/* LEFT */}
        <div className="col-lg-6">
          <div className="tpproduct-details__nab">

            <div className="tpproduct-details__thumb-img mb-10">
              <Image src={activeImg} alt="product" width={500} height={500} />
            </div>

            <nav>
              <div className="nav nav-tabs justify-content-center">
                {images.map((img: string, index: number) => (
                  <button
                    key={index}
                    className={`nav-link ${img === activeImg ? "active" : ""}`}
                    onClick={() => handleActiveImg(img)}
                  >
                    <Image src={img} alt="thumb" width={60} height={60} />
                  </button>
                ))}
              </div>
            </nav>

          </div>
        </div>

        {/* RIGHT */}
        <div className="col-lg-6">
          <div className="product__details">

            {/* PRICE */}
            <div className="product__details-price-box">
              <h5>₹{sale_price || price}</h5>
              {sale_price > 0 && <del>₹{price}</del>}
            </div>

            {/* QUANTITY */}
            <div className="product__details-cart">
              <div className="d-flex align-items-center mb-15">
                <b>Qty:</b>

                <div className="product__details-count mr-10">

                  <span onClick={() => setQty((prev) => Math.max(1, prev - 1))}>
                    <i className="far fa-minus"></i>
                  </span>

                  <input type="text" value={qty} readOnly />

                  <span
                    onClick={() =>
                      setQty((prev) =>
                        stock ? Math.min(stock, prev + 1) : prev + 1
                      )
                    }
                  >
                    <i className="far fa-plus"></i>
                  </span>
                </div>

                {/* ADD TO CART */}
                <button onClick={handleAddToCart} className="tp-btn">
                  Add to Cart
                </button>
              </div>
            </div>

            {/* INFO */}
            <div className="product__details-stock mb-25">
              <ul>
                <li>Availability: <i>{stock} In stock</i></li>

                <li>
                  Category:{" "}
                  <span>
                    {typeof category === "object"
                      ? category?.name || "Category"
                      : "Category"}
                  </span>
                </li>

                <li>Brand: <span>{brand}</span></li>
              </ul>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default ShopDetailsBox;