"use client";
import React from "react";
import ShopDetailsBox from "./shop-details-box";

// prop type
type IProps = {
  product: any;
};

const ShopDetailsUpper = ({ product }: IProps) => {
  
  // ✅ NORMALIZE PRODUCT (FINAL SAFE VERSION)
  const normalizedProduct = {
    _id: String(product?._id || product?.id || ""), // 🔥 always string
    name: product?.name || product?.title || "Product",
    brand: product?.brand || "No Brand",
    reviews: Array.isArray(product?.reviews) ? product.reviews : [],
    images: Array.isArray(product?.images) ? product.images : [],
    price: Number(product?.price || 0),
    discountPrice: Number(product?.discountPrice || product?.sale_price || 0),
    stock: Number(product?.stock || 0),
    category: product?.category || null,
  };

  // ❗ Prevent invalid product (important)
  if (!normalizedProduct._id) {
    return null;
  }

  const { name, brand, reviews, _id } = normalizedProduct;

  return (
    <div className="tpdetails__product mb-30">

      {/* TITLE */}
      <div className="tpdetails__title-box">
        <h3 className="tpdetails__title">{name}</h3>

        <ul className="tpdetails__brand">

          {/* BRAND */}
          <li>
            Brand: <span>{brand}</span>
          </li>

          {/* REVIEWS */}
          <li>
            <i className="icon-star_outline1"></i>
            <i className="icon-star_outline1"></i>
            <i className="icon-star_outline1"></i>
            <i className="icon-star_outline1"></i>
            <i className="icon-star_outline1"></i>
            <b>{reviews.length} Reviews</b>
          </li>

          {/* PRODUCT ID */}
          <li>
            ID: <span>{_id}</span>
          </li>

        </ul>
      </div>

      {/* ✅ FIXED (NO EXTRA PROPS) */}
      <ShopDetailsBox product={normalizedProduct} />
    </div>
  );
};

export default ShopDetailsUpper;