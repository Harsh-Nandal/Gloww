"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useAppDispatch } from "@/redux/hook";
import {
  add_cart_product,
  quantityDecrement,
  remove_product,
} from "@/redux/features/cart";

const FALLBACK_IMAGE = "/assets/img/product/placeholder.jpg";

// prop type (flexible for DB)
type IProps = {
  product: any;
};

const CartItem = ({ product }: IProps) => {
  const dispatch = useAppDispatch();

  // ✅ MAP DB FIELDS
  const id = product?._id || product?.id;
  const title = product?.name || product?.title;
  const price = product?.price || 0;
  const sale_price = product?.discountPrice || product?.sale_price;
  const quantity = product?.quantity || product?.orderQuantity || 1;

  // ✅ SAFE IMAGE
  const getImage = (images: any) => {
    if (!images || !Array.isArray(images) || images.length === 0) {
      return FALLBACK_IMAGE;
    }
    return images[0];
  };

  const image = getImage(product?.images);

  return (
    <tr>
      {/* IMAGE */}
      <td className="product-thumbnail">
        <Link href={`/shop-details/${id}`}>
          <Image
            src={image}
            width={125}
            height={125}
            alt="cart-img"
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

      {/* QUANTITY */}
      <td className="product-quantity">
        <span
          onClick={() => dispatch(quantityDecrement(product))}
          className="cart-minus"
        >
          -
        </span>

        <input
          className="cart-input"
          type="text"
          value={quantity}
          readOnly
        />

        <span
          onClick={() => dispatch(add_cart_product(product))}
          className="cart-plus"
        >
          +
        </span>
      </td>

      {/* SUBTOTAL */}
      <td className="product-subtotal">
        <span className="amount">
          ₹
          {((sale_price || price) * quantity).toFixed(2)}
        </span>
      </td>

      {/* REMOVE */}
      <td className="product-remove">
        <button
          onClick={() => dispatch(remove_product(product))}
          className="pointer"
        >
          <i className="fa fa-times"></i>
        </button>
      </td>
    </tr>
  );
};

export default CartItem;