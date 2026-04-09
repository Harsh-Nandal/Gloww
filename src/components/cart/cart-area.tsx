"use client";
import React, { useEffect, useMemo } from "react";
import Link from "next/link";
import CartItem from "./cart-item";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { clearCart, getCartProducts } from "@/redux/features/cart";

const CartArea = () => {
  const { cart_products } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();

  // ✅ LOAD CART
  useEffect(() => {
    dispatch(getCartProducts());
  }, [dispatch]);

  // ✅ SAFE ID
  const getId = (item: any) => item?._id || item?.id;

  // ✅ FIXED TOTAL (🔥 FINAL)
  const total = useMemo(() => {
    if (!Array.isArray(cart_products)) return 0;

    return cart_products.reduce((acc: number, item: any) => {

      const price = Number(
        item?.discountPrice ||
        item?.sale_price ||
        item?.price ||
        0
      );

      const quantity = Number(
        item?.quantity ||
        item?.orderQuantity ||
        1
      );

      return acc + price * quantity;

    }, 0);
  }, [cart_products]);

  return (
    <section className="cart-area pb-80">
      <div className="container">
        <div className="row">
          <div className="col-12">

            {/* EMPTY */}
            {cart_products.length === 0 && (
              <div className="text-center pt-100">
                <h3>Your cart is empty</h3>
                <Link href="/shop-list" className="tp-btn-2 mt-10">
                  Return to shop
                </Link>
              </div>
            )}

            {/* CART */}
            {cart_products.length > 0 && (
              <div>

                {/* TABLE */}
                <div className="table-content table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total</th>
                        <th>Remove</th>
                      </tr>
                    </thead>

                    <tbody>
                      {cart_products.map((item) => (
                        <CartItem
                          key={getId(item)}
                          product={item}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* ACTIONS */}
                <div className="row mt-20">
                  <div className="col-12 d-flex justify-content-between">
                    <button
                      onClick={() => dispatch(clearCart())}
                      className="tp-btn tp-color-btn"
                    >
                      Clear Cart
                    </button>

                    <Link href="/shop-list" className="tp-btn-2">
                      Continue Shopping
                    </Link>
                  </div>
                </div>

                {/* TOTAL */}
                <div className="row justify-content-end mt-30">
                  <div className="col-md-5">
                    <div className="cart-page-total">
                      <h2>Cart totals</h2>

                      {total <= 0 && (
                        <p style={{ color: "red" }}>
                          Cart not ready or empty
                        </p>
                      )}

                      <ul className="mb-20">
                        <li>
                          Subtotal <span>₹{total.toFixed(2)}</span>
                        </li>
                        <li>
                          Total <span>₹{total.toFixed(2)}</span>
                        </li>
                      </ul>

                      <Link
                        href="/checkout"
                        className={`tp-btn tp-color-btn ${total <= 0 ? "disabled" : ""}`}
                      >
                        Proceed to Checkout
                      </Link>
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  );
};

export default CartArea;