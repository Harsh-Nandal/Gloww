"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

// internal
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import {
  getCompareProducts,
  remove_compare_product,
} from "@/redux/features/compare";
import { add_cart_product } from "@/redux/features/cart";
import { averageRating } from "@/utils/utils";

const FALLBACK_IMAGE = "/assets/img/product/placeholder.jpg";

const CompareArea = () => {
  const { compare_products } = useAppSelector((state) => state.compare);
  const dispatch = useAppDispatch();

  // ✅ LOAD FROM LOCAL STORAGE
  useEffect(() => {
    dispatch(getCompareProducts());
  }, [dispatch]);

  // ✅ REMOVE
  const handleRemove = (item: any) => {
    dispatch(remove_compare_product(item));
  };

  // ✅ IMAGE FIX
  const getImage = (images: any) => {
    if (!images || !Array.isArray(images) || images.length === 0) {
      return FALLBACK_IMAGE;
    }
    return images[0];
  };

  return (
    <section className="compare__area pt-120 pb-120">
      <div className="container">
        <div className="row">
          <div className="col-xl-12">

            {compare_products.length === 0 ? (
              <div className="text-center">
                <h3>No Compare product</h3>
                <Link href="/shop" className="tp-btn-2 mt-10">
                  Shop Now
                </Link>
              </div>
            ) : (
              <div className="tp-compare-table text-center">
                <table className="table table-responsive">
                  <tbody>

                    {/* PRODUCT */}
                    <tr>
                      <th>Product</th>
                      {compare_products.map((item: any, index: number) => {
                        const id = item._id || item.id;
                        const title = item.name || item.title || "Product";
                        const image = getImage(item.images);

                        return (
                          <td key={index}>
                            <div className="tp-compare-thumb">
                              <Image
                                src={image}
                                alt={title}
                                width={200}
                                height={200}
                                style={{ height: "auto" }}
                              />
                              <h4 className="tp-compare-product-title">
                                <Link href={`/shop-details/${id}`}>
                                  {title}
                                </Link>
                              </h4>
                            </div>
                          </td>
                        );
                      })}
                    </tr>

                    {/* DESCRIPTION */}
                    <tr>
                      <th>Description</th>
                      {compare_products.map((item: any, index: number) => (
                        <td key={index}>
                          <p>{item.description || "No description"}</p>
                        </td>
                      ))}
                    </tr>

                    {/* PRICE */}
                    <tr>
                      <th>Price</th>
                      {compare_products.map((item: any, index: number) => {
                        const price = item.price || 0;
                        const discountPrice =
                          item.discountPrice || item.sale_price;

                        return (
                          <td key={index}>
                            <span>₹{discountPrice || price}</span>
                            {discountPrice && (
                              <span className="old-price">
                                ₹{price}
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>

                    {/* ADD TO CART */}
                    <tr>
                      <th>Add to cart</th>
                      {compare_products.map((item: any, index: number) => (
                        <td key={index}>
                          <button
                            onClick={() => dispatch(add_cart_product(item))}
                            className="tp-btn-2"
                          >
                            Add to Cart
                          </button>
                        </td>
                      ))}
                    </tr>

                    {/* RATING */}
                    <tr>
                      <th>Rating</th>
                      {compare_products.map((item: any, index: number) => (
                        <td key={index}>
                          <div>
                            ⭐ {averageRating(item.reviews || [])}
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* REMOVE */}
                    <tr>
                      <th>Remove</th>
                      {compare_products.map((item: any, index: number) => (
                        <td key={index}>
                          <button
                            onClick={() => handleRemove(item)}
                            className="cursor-pointer"
                          >
                            🗑 Remove
                          </button>
                        </td>
                      ))}
                    </tr>

                  </tbody>
                </table>
              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  );
};

export default CompareArea;