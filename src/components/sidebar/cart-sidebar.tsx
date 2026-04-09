"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import empty_cart_img from "@/assets/img/cart/empty-cart.png";
import { remove_product } from "@/redux/features/cart";

// props
type IProps = {
  isCartSidebarOpen: boolean;
  setIsCartSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const FALLBACK_IMAGE = "/assets/img/product/placeholder.jpg";

const CartSidebar = ({
  isCartSidebarOpen,
  setIsCartSidebarOpen,
}: IProps) => {
  const cartItems = useAppSelector((state) => state.cart.cart_products);
  const dispatch = useAppDispatch();

  // ✅ PRICE LOGIC (MATCHES CHECKOUT)
  const getPrice = (item: any) => {
    const discount = Number(item?.discountPrice);
    const sale = Number(item?.sale_price);
    const regular = Number(item?.price);

    if (discount > 0) return discount;
    if (sale > 0) return sale;
    if (regular > 0) return regular;

    return 0;
  };

  // ✅ CORRECT SUBTOTAL (MATCHES CHECKOUT)
  const total = cartItems.reduce((acc: number, item: any) => {
    const price = getPrice(item);
    const qty = Number(item?.quantity || item?.orderQuantity) || 1;

    return acc + price * qty;
  }, 0);

  type CartProduct = {
    _id?: string;
    id?: string;
    name?: string;
    title?: string;
    price?: number;
    discountPrice?: number;
    sale_price?: number;
    quantity?: number;
    orderQuantity?: number;
    images?: string[];
  };

  function normalizeProduct(item: unknown) {
    const p = item as Partial<CartProduct>;

    const id = p._id ?? p.id ?? "";

    const title = p.name ?? p.title ?? "Product";

    // ✅ FIXED PRICE LOGIC
    const price =
      (p.discountPrice && p.discountPrice > 0 && p.discountPrice) ||
      (p.sale_price && p.sale_price > 0 && p.sale_price) ||
      p.price ||
      0;

    const quantity =
      p.quantity ??
      p.orderQuantity ??
      1;

    const image =
      Array.isArray(p.images) && p.images.length > 0
        ? p.images[0]
        : FALLBACK_IMAGE;

    return { id, title, price, quantity, image };
  }

  return (
    <>
      <div
        className={`tpcartinfo tp-cart-info-area p-relative ${
          isCartSidebarOpen ? "tp-sidebar-opened" : ""
        }`}
      >
        {/* CLOSE */}
        <button
          className="tpcart__close"
          onClick={() => setIsCartSidebarOpen(false)}
        >
          <i className="icon-x"></i>
        </button>

        <div className="tpcart">
          <h4 className="tpcart__title">Your Cart</h4>

          {/* EMPTY */}
          {cartItems.length === 0 && (
            <div className="cartmini__empty text-center pt-100">
              <Image src={empty_cart_img} alt="empty-cart-img" />
              <p>Your Cart is empty</p>
              <Link href="/shop-list" className="tp-btn-2 mt-10">
                Go to Shop
              </Link>
            </div>
          )}

          {/* ITEMS */}
          {cartItems.length > 0 && (
            <div className="tpcart__product">
              <div className="tpcart__product-list">
                <ul>
                  {cartItems.map((item) => {
                    const { id, title, price, quantity, image } =
                      normalizeProduct(item);

                    return (
                      <li key={id}>
                        <div className="tpcart__item">
                          <div className="tpcart__img">
                            <Image
                              src={image}
                              alt="cart-img"
                              width={70}
                              height={70}
                            />

                            <div className="tpcart__del">
                              <button
                                className="pointer"
                                onClick={() => dispatch(remove_product(item))}
                              >
                                <i className="icon-x-circle"></i>
                              </button>
                            </div>
                          </div>

                          <div className="tpcart__content">
                            <span className="tpcart__content-title">
                              <Link href={`/shop-details/${id}`}>
                                {title}
                              </Link>
                            </span>

                            <div className="tpcart__cart-price">
                              <span className="quantity">
                                {quantity} x{" "}
                              </span>
                              <span className="new-price">
                                ₹{(price * quantity).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* TOTAL */}
              <div className="tpcart__checkout">
                <div className="tpcart__total-price d-flex justify-content-between align-items-center">
                  <span>Subtotal:</span>
                  <span className="heilight-price">
                    ₹{total.toFixed(2)}
                  </span>
                </div>

                <div className="tpcart__checkout-btn">
                  <Link className="tpcart-btn mb-10" href="/cart">
                    View Cart
                  </Link>
                  <Link className="tpcheck-btn" href="/checkout">
                    Checkout
                  </Link>
                </div>
              </div>

              {/* NOTE */}
              <div className="tpcart__free-shipping text-center">
                <span>
                  Free shipping for orders <b>under 10km</b>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* OVERLAY */}
      <div
        onClick={() => setIsCartSidebarOpen(false)}
        className={`cartbody-overlay ${
          isCartSidebarOpen ? "opened" : ""
        }`}
      ></div>
    </>
  );
};

export default CartSidebar;