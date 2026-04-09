"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import WishlistItem from "./wishlist-item";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { getWishlistProducts } from "@/redux/features/wishlist";

const WishlistArea = () => {
  const { wishlist } = useAppSelector((state) => state.wishlist);
  const dispatch = useAppDispatch();

  // ✅ LOAD FROM LOCAL STORAGE
  useEffect(() => {
    if (typeof window !== "undefined") {
      dispatch(getWishlistProducts());
    }
  }, [dispatch]);

  // ✅ SAFE ID HANDLER
  const getId = (item: any) => item?._id || item?.id;

  return (
    <div className="cart-area pb-80">
      <div className="container">
        <div className="row">
          <div className="col-12">

            {/* EMPTY STATE */}
            {wishlist.length === 0 && (
              <div className="text-center pt-100">
                <h3>Your Wishlist is empty</h3>
                <Link href="/shop-list" className="tp-btn-2 mt-10">
                  Return to shop
                </Link>
              </div>
            )}

            {/* TABLE */}
            {wishlist.length > 0 && (
              <div>
                <div className="table-content table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Add To Cart</th>
                        <th>Remove</th>
                      </tr>
                    </thead>

                    <tbody>
                      {wishlist.map((item) => (
                        <WishlistItem
                          key={getId(item)} // ✅ FIXED
                          product={item}
                        />
                      ))}
                    </tbody>

                  </table>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default WishlistArea;