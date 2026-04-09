"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { add_cart_product } from "@/redux/features/cart";
import { remove_wishlist_product } from "@/redux/features/wishlist";

const FALLBACK_IMAGE = "/assets/img/product/placeholder.jpg";

// prop type
type IProps = {
  product: any;
};

const WishlistItem = ({ product }: IProps) => {
  const dispatch = useAppDispatch();

  // ✅ GET CART ITEMS (to prevent duplicates)
  const { cart_products } = useAppSelector((state) => state.cart);

  // ✅ MAP DB FIELDS
  const id = product?._id || product?.id;
  const title = product?.name || product?.title || "Product";
  const price = product?.price || 0;
  const sale_price = product?.discountPrice || product?.sale_price;

  // ✅ SAFE IMAGE
  const getImage = (images: any) => {
    if (!images || !Array.isArray(images) || images.length === 0) {
      return FALLBACK_IMAGE;
    }
    return images[0];
  };

  const image = getImage(product?.images);

  // ✅ ADD TO CART (FIXED)
  const handleAddToCart = () => {
    // check if already in cart
    const isExist = cart_products.find(
      (item: any) => (item._id || item.id) === id
    );

    if (isExist) {
      alert("Product already in cart");
      return;
    }

    // normalize product for cart
    const cartItem = {
      ...product,
      id: id,
      title: title,
      price: sale_price || price,
      image: image,
      quantity: 1,
    };

    // dispatch add to cart
    dispatch(add_cart_product(cartItem));

    // optional: remove from wishlist after adding
    dispatch(remove_wishlist_product(product));
  };

  // ✅ REMOVE
  const handleRemove = () => {
    dispatch(remove_wishlist_product(product));
  };

  return (
    <tr>
      {/* IMAGE */}
      <td className="product-thumbnail">
        <Link href={`/shop-details/${id}`}>
          <Image
            src={image}
            width={125}
            height={125}
            alt="wishlist-img"
          />
        </Link>
      </td>

      {/* NAME */}
      <td className="product-name">
        <Link href={`/shop-details/${id}`}>
          {title}
        </Link>
      </td>

      {/* PRICE */}
      <td className="product-price">
        <span className="amount">
          ₹{sale_price || price}
        </span>
      </td>

      {/* ADD TO CART */}
      <td className="product-add-to-cart">
        <button
          onClick={handleAddToCart}
          className="tp-btn tp-color-btn tp-wish-cart banner-animation"
        >
          Add To Cart
        </button>
      </td>

      {/* REMOVE */}
      <td className="product-remove">
        <button onClick={handleRemove} className="pointer">
          <i className="fa fa-times"></i>
        </button>
      </td>
    </tr>
  );
};

export default WishlistItem;