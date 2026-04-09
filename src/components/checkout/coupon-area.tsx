'use client';
import React, { useState } from 'react';

type Props = {
  setDiscount: (discount: number) => void;
  total: number;
};

const CouponArea = ({ setDiscount, total }: Props) => {

  const [openLogin, setOpenLogin] = useState(false);
  const [openCoupon, setOpenCoupon] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleApplyCoupon = async (e: any) => {
    e.preventDefault();

    // 🔥 FORCE SAFE TOTAL
    const safeTotal = Number(total ?? 0);

    console.log("RAW TOTAL:", total);
    console.log("SAFE TOTAL:", safeTotal);

    // ❌ BLOCK ONLY IF REALLY INVALID
    if (isNaN(safeTotal)) {
      alert("Cart total invalid ❌");
      return;
    }

    if (safeTotal <= 0) {
      alert("Cart is empty or not loaded ❌");
      return;
    }

    if (!code.trim()) {
      alert("Enter coupon code ❌");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        code: code.trim().toUpperCase(),
        total: safeTotal, // ✅ ALWAYS NUMBER
      };

      console.log("FINAL PAYLOAD:", payload);

      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("API RESPONSE:", data);

      if (!data.success) {
        alert(data.message || "Invalid coupon ❌");
        setDiscount(0);
        return;
      }

      if (data.value === null || data.value === undefined) {
        alert("Coupon value missing ❌");
        setDiscount(0);
        return;
      }

      // ✅ APPLY DISCOUNT
      if (data.type === "percent") {
        setDiscount(data.value);
        alert(`Coupon applied: ${data.value}% off ✅`);
      } else {
        setDiscount(data.value);
        alert(`Coupon applied: ₹${data.value} off ✅`);
      }

    } catch (err) {
      console.error(err);
      alert("Coupon error ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="coupon-area pt-10 pb-30">
      <div className="container">
        <div className="row">

          {/* LOGIN */}
          <div className="col-md-6">
            <div className="coupon-accordion">
              <h3>
                Returning customer?{" "}
                <span onClick={() => setOpenLogin(!openLogin)}>
                  Click here to login
                </span>
              </h3>

              {openLogin && (
                <div className="coupon-content">
                  <div className="coupon-info">
                    <form>
                      <input type="text" placeholder="Email" />
                      <input type="password" placeholder="Password" />
                      <button className="tp-btn">Login</button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* COUPON */}
          <div className="col-md-6">
            <div className="coupon-accordion">
              <h3>
                Have a coupon?{" "}
                <span onClick={() => setOpenCoupon(!openCoupon)}>
                  Click here to enter your code
                </span>
              </h3>

              {openCoupon && (
                <div className="coupon-checkout-content">
                  <div className="coupon-info">
                    <form onSubmit={handleApplyCoupon}>
                      <p className="checkout-coupon">
                        <input
                          type="text"
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                          placeholder="Coupon Code"
                        />

                        <button
                          className="tp-btn tp-color-btn"
                          type="submit"
                          disabled={loading || Number(total ?? 0) <= 0}
                        >
                          {loading ? "Applying..." : "Apply Coupon"}
                        </button>
                      </p>
                    </form>

                    {/* DEBUG */}
                    <small style={{ color: "gray" }}>
                      Cart Total: ₹{Number(total ?? 0)}
                    </small>

                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default CouponArea;