'use client';

import { useEffect, useMemo, useState } from "react";
import { useAppSelector } from "@/redux/hook";

import Wrapper from "@/layouts/wrapper";
import Header from "@/layouts/header/header";
import FeatureArea from "@/components/feature/feature-area";
import BreadcrumbTwo from "@/components/breadcrumb/breadcrumb-2";
import Footer from "@/layouts/footer/footer";
import CouponArea from "@/components/checkout/coupon-area";
import CheckoutArea from "@/components/checkout/checkout-area";

// ✅ Razorpay Type
declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage(): JSX.Element {

  const [discount, setDiscount] = useState(0);


  // ✅ GET CART DATA
  const { cart_products } = useAppSelector((state) => state.cart);

  // ✅ CALCULATE TOTAL (🔥 FIX)
  const totalAmount = useMemo(() => {
    return cart_products.reduce((acc: number, item: any) => {
      const price =
        item?.discountPrice ??
        item?.sale_price ??
        item?.price ??
        0;

      const qty = item?.quantity ?? 1;

      return acc + price * qty;
    }, 0);
  }, [cart_products]);

  // 🔥 LOAD RAZORPAY
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // 🔥 PAYMENT HANDLER
  const handlePayment = async (): Promise<void> => {
    try {
      if (!window.Razorpay) {
        alert("Razorpay SDK not loaded");
        return;
      }

      // ✅ CREATE ORDER WITH REAL TOTAL
      const res = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: totalAmount,
        }),
      });

      const order = await res.json();

      if (!order?.id) {
        alert("Order creation failed");
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY as string,
        amount: order.amount,
        currency: "INR",
        name: "My Store",
        description: "Order Payment",
        order_id: order.id,

        handler: async function (response: any) {
          const verifyRes = await fetch("/api/payment/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(response),
          });

          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            alert("Payment Successful ✅");

            // ✅ SAVE ORDER WITH CART DATA (🔥 IMPORTANT)
            await fetch("/api/orders", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                items: cart_products,
                paymentStatus: "paid",
                orderStatus: "processing",
                finalAmount: discount > 0
                  ? discount <= 100
                    ? totalAmount - (totalAmount * discount) / 100
                    : totalAmount - discount
                  : totalAmount,
              }),
            });

          } else {
            alert("Payment verification failed");
          }
        },

        modal: {
          ondismiss: function () {
            console.log("Payment closed");
          },
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (err: any) {
        console.error(err);
        alert("Payment failed ❌");
      });

      rzp.open();

    } catch (err) {
      console.error(err);
      alert("Payment error ❌");
    }
  };

  return (
    <Wrapper>
      <Header />

      <main>
        <BreadcrumbTwo title="Checkout" />
        <CouponArea setDiscount={setDiscount} total={totalAmount} />
        {/* ✅ PASS REAL PAYMENT FUNCTION */}
        <CheckoutArea onPay={handlePayment} discount={discount} />

        <FeatureArea style_2={true} />
      </main>

      <Footer />
    </Wrapper>
  );
}