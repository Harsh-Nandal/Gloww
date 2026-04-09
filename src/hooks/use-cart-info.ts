'use client';
import { useEffect, useState } from "react";
import { useAppSelector } from "@/redux/hook";

const useCartInfo = () => {
  const [quantity, setQuantity] = useState(0);
  const [total, setTotal] = useState(0);

  const { cart_products } = useAppSelector((state) => state.cart);

  useEffect(() => {
    if (!cart_products || cart_products.length === 0) {
      setQuantity(0);
      setTotal(0);
      return;
    }

    const cart = cart_products.reduce(
      (cartTotal, cartItem) => {
        const {
          price,
          discountPrice,
          quantity: itemQty,
        } = cartItem;

        const qty = itemQty || 1;

        // ✅ correct price logic
        const finalPrice = discountPrice > 0 ? discountPrice : price;

        cartTotal.quantity += qty;
        cartTotal.total += finalPrice * qty;

        return cartTotal;
      },
      {
        total: 0,
        quantity: 0,
      }
    );

    setQuantity(cart.quantity);
    setTotal(cart.total);
  }, [cart_products]);

  return {
    quantity,
    total,
  };
};

export default useCartInfo;