"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import ProductListItem from "../product/product-single/product-list-item";
import ProductSingle from "../product/product-single/product-single";

// prop type
type IProps = {
  activeTab: string;
  currentItems: any[];
};

const ShopItems = ({ activeTab, currentItems }: IProps) => {
  return (
    <div>
      {/* ✅ EMPTY STATE */}
      {currentItems.length === 0 && (
        <div className="text-center mt-80">
          <div className="mb-30 flex justify-center">
            <Image
              src="/assets/img/cart/empty-cart.png"
              alt="empty"
              width={250}
              height={150}
            />
          </div>

          <h4 className="mb-10">
            No Products Found 😕
          </h4>

          <p className="mb-20">
            Try selecting a different category or check back later.
          </p>

          <Link href="/shop-list" className="tp-btn">
            Continue Shopping
          </Link>
        </div>
      )}

      {/* ✅ PRODUCTS GRID / LIST */}
      {currentItems.length > 0 && (
        <div
          className={`row ${
            activeTab === "three-col"
              ? "row-cols-xxl-3 row-cols-xl-3 row-cols-lg-3 row-cols-md-3 row-cols-sm-2 row-cols-1 tpproduct__shop-item"
              : activeTab === "four-col"
              ? "row-cols-xxl-4 row-cols-xl-4 row-cols-lg-3 row-cols-md-3 row-cols-sm-2 row-cols-1 tpproduct__shop-item"
              : ""
          }`}
        >
          {currentItems.map((product, i) => (
            <div
              key={product._id || i}
              className={`${
                activeTab === "list" ? "col-lg-12" : "col mb-20"
              }`}
            >
              {activeTab === "list" ? (
                <ProductListItem product={product} />
              ) : (
                <ProductSingle product={product} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopItems;