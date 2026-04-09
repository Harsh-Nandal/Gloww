"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Rating } from "react-simple-star-rating";
import { averageRating, discountPercentage, isHot } from "@/utils/utils";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { add_cart_product } from "@/redux/features/cart";
import { add_to_wishlist } from "@/redux/features/wishlist";
import { add_to_compare } from "@/redux/features/compare";

// fallback image
const FALLBACK_IMAGE = "/assets/img/product/placeholder.jpg";

const imgStyle = {
  width: "100%",
  height: "100%",
};

type IProps = {
  product: any; // 🔥 flexible for DB
};

const ProductListItem = ({ product }: IProps) => {
  // ✅ MAP DB → UI FIELDS
  const id = product?._id;
  const title = product?.name;
  const price = product?.price || 0;
  const sale_price = product?.discountPrice || 0;
  const quantity = product?.stock || 0;
  const updated_at = product?.updatedAt;
  const reviews = product?.reviews || [];

  // ✅ IMAGE FIX (MAIN CHANGE)
  const getImage = (images: any): string => {
    if (!images || !Array.isArray(images) || images.length === 0) {
      return FALLBACK_IMAGE;
    }
    return images[0]; // first image
  };

  const mainImage = getImage(product?.images);

  let discount = 0;
  if (sale_price && price) {
    discount = discountPercentage(price, sale_price);
  }

  const [isItemAddToCart, setIsItemAddToCart] = useState(false);
  const [isCompareAdd, setIsCompareAdd] = useState(false);
  const [isWishlistAdd, setIsWishlistAdd] = useState(false);

  const { cart_products } = useAppSelector((state) => state.cart);
  const { wishlist } = useAppSelector((state) => state.wishlist);
  const { compare_products } = useAppSelector((state) => state.compare);

  const dispatch = useAppDispatch();

useEffect(() => {
  if (!id) return;

  const currentId = String(id);

  const exists = (list: unknown): boolean => {
    if (!Array.isArray(list)) return false;

    return list.some((item: any) => {
      return item?._id && String(item._id) === currentId;
    });
  };

  setIsItemAddToCart(exists(cart_products));
  setIsWishlistAdd(exists(wishlist));
  setIsCompareAdd(exists(compare_products));

}, [cart_products, compare_products, wishlist, id]);

  return (
    <div className="tplist__product d-flex align-items-center justify-content-between mb-20">

      {/* IMAGE */}
      <div className="tplist__product-img">
        <Link href={`/shop-details/${id}`}>
          <Image
            src={mainImage}
            alt={title || "product"}
            width={222}
            height={221}
            style={imgStyle}
          />
        </Link>

        <div className="tpproduct__info bage">
          {discount > 0 && (
            <span className="tpproduct__info-discount bage__discount">
              -{discount.toFixed(0)}%
            </span>
          )}
          {isHot(updated_at) && (
            <span className="tpproduct__info-hot bage__hot">HOT</span>
          )}
        </div>
      </div>

      {/* CONTENT */}
      <div className="tplist__content">
        <h4 className="tplist__content-title">
          <Link href={`/shop-details/${id}`}>{title}</Link>
        </h4>

        <div className="tplist__rating mb-5">
          <Rating
            allowFraction
            size={16}
            initialValue={averageRating(reviews)}
            readonly
          />
        </div>
      </div>

      {/* PRICE + ACTIONS */}
      <div className="tplist__price justify-content-end">
        <h4 className="tplist__instock">
          Availability: <span>{quantity} in stock</span>
        </h4>

        <h3 className="tplist__count mb-15">
          ₹{sale_price || price}
        </h3>

        {isItemAddToCart ? (
          <Link href="/cart" className="tp-btn-2 mb-10">
            View Cart
          </Link>
        ) : (
          <button
            className="tp-btn-2 mb-10"
            onClick={() => dispatch(add_cart_product(product))}
          >
            Add to Cart
          </button>
        )}

        <div className="tplist__shopping">
          <button
            className="pointer"
            onClick={() => dispatch(add_to_wishlist(product))}
          >
            <i className={"icon-heart icons" + (isWishlistAdd ? " active" : "")}></i>
            wishlist
          </button>

          <button
            className="pointer"
            onClick={() => dispatch(add_to_compare(product))}
          >
            <i className={"icon-layers" + (isCompareAdd ? " active" : "")}></i>
            Compare
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductListItem;