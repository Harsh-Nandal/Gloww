"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import ProductListItem from "../product/product-single/product-list-item";
import ProductSingle from "../product/product-single/product-single";

// prop type
type IProps = {
  activeTab: string;
  currentItems?: any[]; // ✅ made optional (safe)
};

const ShopItems = ({ activeTab, currentItems = [] }: IProps) => {

  // ✅ SAFE NORMALIZATION FUNCTION
  const normalizeProduct = (product: any) => ({
    _id: String(product?._id || product?.id || ""),
    name: product?.name || product?.title || "Product",
    images: Array.isArray(product?.images) ? product.images : [],
    price: Number(product?.price || 0),
    discountPrice: Number(product?.discountPrice || product?.sale_price || 0),
    stock: Number(product?.stock || 0),
    reviews: Array.isArray(product?.reviews) ? product.reviews : [],
    category: product?.category || null,
    ...product, // keep extra fields if needed
  });

  const hasProducts = currentItems.length > 0;

  return (
    <div>
      {/* ✅ EMPTY STATE */}
      {!hasProducts && (
        <div className="text-center mt-80">
          <div className="mb-30 flex justify-center">
            <Image
              src="/assets/img/cart/empty-cart.png"
              alt="empty"
              width={250}
              height={150}
            />
          </div>

          <h4 className="mb-10">No Products Found 😕</h4>

          <p className="mb-20">
            Try selecting a different category or check back later.
          </p>

          <Link href="/shop-list" className="tp-btn">
            Continue Shopping
          </Link>
        </div>
      )}

      {/* ✅ PRODUCTS GRID / LIST */}
      {hasProducts && (
        <div
          className={`row ${
            activeTab === "three-col"
              ? "row-cols-xxl-3 row-cols-xl-3 row-cols-lg-3 row-cols-md-3 row-cols-sm-2 row-cols-1 tpproduct__shop-item"
              : activeTab === "four-col"
              ? "row-cols-xxl-4 row-cols-xl-4 row-cols-lg-3 row-cols-md-3 row-cols-sm-2 row-cols-1 tpproduct__shop-item"
              : ""
          }`}
        >
          {currentItems.map((item) => {
            const product = normalizeProduct(item);

            // ❗ skip invalid product
            if (!product._id) return null;

            return (
              <div
                key={product._id} // ✅ fixed key
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
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ShopItems;