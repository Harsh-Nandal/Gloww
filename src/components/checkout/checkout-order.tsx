'use client';
import React, { useMemo, useState } from 'react';
import { useAppSelector } from '@/redux/hook';

type Props = {
  onPay: (amount: number) => void;
};

const CheckoutOrder = ({ onPay }: Props) => {

  const { cart_products } = useAppSelector((state) => state.cart);

  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [shipping, setShipping] = useState<"flat" | "free">("flat");

  // ✅ 🔥 ULTRA SAFE PRICE GETTER (FINAL)
  const getPrice = (item: any) => {
    const discount = Number(item?.discountPrice);
    const sale = Number(item?.sale_price);
    const regular = Number(item?.price);

    // ❗ Ignore garbage values like 7, 0, NaN
    if (discount > 10) return discount;
    if (sale > 10) return sale;
    if (regular > 0) return regular;

    console.warn("⚠️ Bad price detected:", item);

    return 0;
  };

  // ✅ SUBTOTAL (FINAL FIX)
  const subtotal = useMemo(() => {
    return cart_products.reduce((acc: number, item: any) => {
      const price = getPrice(item);
      const qty = parseInt(item?.quantity) || 1;

      return acc + price * qty;
    }, 0);
  }, [cart_products]);

  // ✅ SHIPPING
  const shippingCost = shipping === "flat" ? 50 : 0;

  // ✅ FINAL TOTAL
  const finalTotal = Number(subtotal + shippingCost);

  // ✅ DEBUG (REMOVE AFTER TEST)
  console.log("🛒 CART:", cart_products);
  console.log("💰 SUBTOTAL:", subtotal);
  console.log("🚚 SHIPPING:", shippingCost);
  console.log("✅ FINAL:", finalTotal);

  // ✅ HANDLE ORDER
  const handlePlaceOrder = () => {
    if (!cart_products.length) {
      alert("Cart is empty ❌");
      return;
    }

    if (finalTotal <= 0) {
      alert("Invalid total amount ❌");
      return;
    }

    if (paymentMethod === "cod") {
      alert(`Order placed (COD) ₹${finalTotal}`);
      return;
    }

    // 🔥 Razorpay (paise)
    onPay(Math.round(finalTotal * 100));
  };

  return (
    <>
      {/* PAYMENT */}
      <div className="accordion">

        <div className="accordion-item">
          <button className="accordion-button">Razorpay</button>
          <div className="accordion-body">
            <input
              type="radio"
              checked={paymentMethod === "razorpay"}
              onChange={() => setPaymentMethod("razorpay")}
            />
            <label className="ms-2">Online Payment</label>
          </div>
        </div>

        <div className="accordion-item mt-2">
          <button className="accordion-button collapsed">COD</button>
          <div className="accordion-body">
            <input
              type="radio"
              checked={paymentMethod === "cod"}
              onChange={() => setPaymentMethod("cod")}
            />
            <label className="ms-2">Cash on Delivery</label>
          </div>
        </div>

      </div>

      {/* SHIPPING */}
      <div className="mt-20">
        <h5>Shipping</h5>

        <div>
          <input
            type="radio"
            checked={shipping === "flat"}
            onChange={() => setShipping("flat")}
          />
          <label className="ms-2">Flat ₹50</label>
        </div>

        <div>
          <input
            type="radio"
            checked={shipping === "free"}
            onChange={() => setShipping("free")}
          />
          <label className="ms-2">Free Shipping</label>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="mt-20">
        <h5>Order Summary</h5>

        {cart_products.map((item: any) => {
          const price = getPrice(item);
          const qty = parseInt(item?.quantity) || 1;
          const itemTotal = price * qty;

          return (
            <div key={item?._id} className="d-flex justify-content-between">
              <span>{item?.name} × {qty}</span>
              <span>₹{itemTotal.toFixed(2)}</span>
            </div>
          );
        })}

        <hr />

        <div className="d-flex justify-content-between">
          <span>Subtotal</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>

        <div className="d-flex justify-content-between">
          <span>Shipping</span>
          <span>₹{shippingCost}</span>
        </div>

        <div className="d-flex justify-content-between fw-bold">
          <span>Total</span>
          <span>₹{finalTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* BUTTON */}
      <div className="order-button-payment mt-20">
        <button
          type="button"
          onClick={handlePlaceOrder}
          className="tp-btn w-100"
        >
          Pay ₹{finalTotal.toFixed(2)}
        </button>
      </div>
    </>
  );
};

export default CheckoutOrder;