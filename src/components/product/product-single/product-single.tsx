"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Rating } from "react-simple-star-rating";
import { averageRating, discountPercentage, isHot } from "@/utils/utils";
import CountdownTimer from "@/components/common/countdown-timer";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { handleModalProduct, handleOpenModal } from "@/redux/features/utility";
import { add_cart_product } from "@/redux/features/cart";
import { add_to_compare } from "@/redux/features/compare";
import { add_to_wishlist } from "@/redux/features/wishlist";

const FALLBACK_IMAGE = "/assets/img/product/placeholder.jpg";

const imgStyle = {
  width: "100%",
  height: "100%",
};

type IProps = {
  product: any;
  progress?: boolean;
  offer_style?: boolean;
  cls?: string;
  price_space?: string;
};

const ProductSingle = ({
  product,
  progress,
  cls,
  offer_style,
  price_space,
}: IProps) => {

  // ✅ MAP DB → UI
  const id = product?._id;
  const title = product?.name;
  const price = product?.price || 0;
  const sale_price = product?.discountPrice || 0;
  const quantity = product?.stock || 0;
  const updated_at = product?.updatedAt;
  const reviews = product?.reviews || [];
  const sold = product?.sold || 0;

  // ✅ IMAGE FIX
  const getImage = (images: any): string => {
    if (!images || !Array.isArray(images) || images.length === 0) {
      return FALLBACK_IMAGE;
    }
    return images[0];
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
    const checkId = (item: any) => item?._id || item?.id;

    setIsItemAddToCart(
      cart_products.some((i) => checkId(i) === id)
    );

    setIsWishlistAdd(
      wishlist.some((i) => checkId(i) === id)
    );

    setIsCompareAdd(
      compare_products.some((i) => checkId(i) === id)
    );
  }, [cart_products, compare_products, wishlist, id]);

  const handleProductModal = (prd: any) => {
    dispatch(handleModalProduct({ product: prd }));
    dispatch(handleOpenModal());
  };

  return (
    <div
      className={`tpproduct p-relative ${cls || ""} ${progress ? "tpprogress__hover" : ""
        }`}
    >
      {/* IMAGE */}
      <div className="tpproduct__thumb p-relative text-center">
        <Link href={`/shop-details/${id}`}>
          <Image
            src={mainImage}
            alt={title || "product"}
            width={217}
            height={217}
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

        {/* ACTIONS */}
        <div className="tpproduct__shopping">
          <button onClick={() => dispatch(add_to_wishlist(product))}>
            <i className={"icon-heart icons" + (isWishlistAdd ? " active" : "")}></i>
          </button>

          <button onClick={() => dispatch(add_to_compare(product))}>
            <i className={"icon-layers" + (isCompareAdd ? " active" : "")}></i>
          </button>

          <button onClick={() => handleProductModal(product)}>
            <i className="icon-eye"></i>
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="tpproduct__content">
        {/* ❌ removed broken category.parent/child */}

        <h4 className="tpproduct__title">
          <Link href={`/shop-details/${id}`}>{title}</Link>
        </h4>

        <div className="tpproduct__rating mb-5">
          <Rating allowFraction size={16} initialValue={averageRating(reviews)} readonly />
        </div>

        <div className={`tpproduct__price ${price_space}`}>
          <span>₹{sale_price || price}</span>
          {sale_price && <del>₹{price}</del>}
        </div>

        {progress && (
          <div className="tpproduct__progress">
            <div className="progress mb-5">
              <div
                className="progress-bar"
                style={{ width: `${(sold / quantity) * 100}%` }}
              ></div>
            </div>
            <span>
              Sold: <b>{sold}/{quantity}</b>
            </span>
          </div>
        )}
      </div>

      {/* HOVER */}
      <div className="tpproduct__hover-text" style={{
        
        bottom: "-10px", // ✅ NO NEGATIVE VALUE
        
      }}>
        <div className="tpproduct__hover-btn d-flex justify-content-center mb-10">
          {isItemAddToCart ? (
            <Link href="/cart" className="tp-btn-2">
              View Cart
            </Link>
          ) : (
            <button
              onClick={() => dispatch(add_cart_product(product))}
              className="tp-btn-2"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductSingle;