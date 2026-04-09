'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { getCartProducts } from '@/redux/features/cart';
import Link from 'next/link';
import ErrorMsg from '../common/error-msg';

type Props = {
   onPay: (amount: number) => Promise<void>;
   discount: number;
};

type FormData = {
   firstName: string;
   lastName: string;
   company: string;
   country: string;
   address: string;
   city: string;
   apartment: string;
   state: string;
   zipCode: string;
   email: string;
   phone: string;
   orderNote?: string;
};

const schema = yup.object().shape({
   firstName: yup.string().required().label("First Name"),
   lastName: yup.string().required().label("Last Name"),
   company: yup.string().required().label("Company"),
   country: yup.string().required().label("Country"),
   address: yup.string().required().label("Address"),
   city: yup.string().required().label("City"),
   apartment: yup.string().required().label("Apartment"),
   state: yup.string().required().label("State"),
   zipCode: yup.string().required().label("Zip Code"),
   email: yup.string().required().email().label("Email"),
   phone: yup.string().required().min(4).label("Phone"),
   orderNote: yup.string().label("Order Note"),
});

const CheckoutArea = ({ onPay, discount }: Props) => {

   const [loading, setLoading] = useState(false);

   const router = useRouter();
   const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

   const { cart_products } = useAppSelector((state) => state.cart);
   const dispatch = useAppDispatch();

   const [shipCost, setShipCost] = useState<number | string>(50);


   useEffect(() => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
   }, []);

   // 🔐 AUTH CHECK
   useEffect(() => {
      try {
         const token = localStorage.getItem("token");
         const user = localStorage.getItem("user");

         if (!token || token === "undefined" || token === "null") {
            setIsAuthorized(false);
            router.replace("/login");
            return;
         }

         if (user) JSON.parse(user);

         setIsAuthorized(true);
      } catch (error) {
         setIsAuthorized(false);
         router.replace("/login");
      }
   }, [router]);

   // 🛒 LOAD CART
   useEffect(() => {
      dispatch(getCartProducts());
   }, [dispatch]);

   const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
      resolver: yupResolver(schema),
   });

   if (isAuthorized === null || isAuthorized === false) return null;

   // ✅ 🔥 SAFE PRICE FUNCTION (FINAL FIX)
   // ✅ SAFE PRICE (FINAL FIX)
   const getPrice = (item: any) => {
      const discount = Number(item?.discountPrice);
      const sale = Number(item?.sale_price);
      const regular = Number(item?.price);

      if (discount > 0) return discount;
      if (sale > 0) return sale;
      if (regular > 0) return regular;

      return 0;
   };

   // ✅ FIXED TOTAL (🔥 MAIN FIX)
   const total = cart_products.reduce((acc: number, item: any) => {
      const price = getPrice(item);
      const qty = Number(item?.quantity) || 1;

      return acc + price * qty;
   }, 0);


   // ✅ APPLY DISCOUNT (🔥 FINAL FIX)
   const discountedTotal =
      discount > 0
         ? discount <= 100
            ? total - (total * discount) / 100 // % discount
            : total - discount // flat discount
         : total;

   // ✅ PREVENT NEGATIVE
   const safeTotal = Math.max(discountedTotal, 0);

   // ✅ FINAL TOTAL
   const finalTotal =
      typeof shipCost === 'number'
         ? safeTotal + shipCost
         : safeTotal;

   const onSubmit = handleSubmit(async (data) => {
      try {
         setLoading(true);

         const addressPayload = {
            fullName: `${data.firstName} ${data.lastName}`,
            phone: data.phone,
            street: `${data.address}, ${data.apartment}`,
            city: data.city,
            state: data.state,
            postalCode: data.zipCode,
            country: data.country,
         };

         const orderItems = cart_products.map((item: any) => ({
            product: item._id,
            name: item.name || item.title,
            price: getPrice(item),
            quantity: item.quantity || 1,
         }));

         console.log("FINAL TOTAL (₹):", finalTotal);
         console.log("SENDING AMOUNT (paise):", Math.round(finalTotal * 100));

         // ✅ CREATE ORDER
         const res = await fetch("/api/orders", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
               items: orderItems,
               totalAmount: total,
               discount,
               finalAmount: finalTotal,
               address: addressPayload,
            }),
         });

         const result = await res.json();

         if (!res.ok || !result.success) {
            setLoading(false);
            alert(result.message || "Order failed ❌");
            return;
         }

         const dbOrderId = result.order._id;

         // 🔥 DEBUG AMOUNT
         console.log("FINAL TOTAL:", finalTotal);
         console.log("IN PAISE:", Math.round(finalTotal * 100));

         // ❌ LIMIT CHECK
         if (Math.round(finalTotal * 100) > 50000000) {
            alert("Amount too high ❌");
            setLoading(false);
            return;
         }

         // ✅ CREATE PAYMENT ORDER
         const paymentRes = await fetch("/api/payment/create-order", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               amount: Math.round(finalTotal * 100),
            }),
         });

         const paymentData = await paymentRes.json();

         if (!paymentData.success) {
            setLoading(false);
            alert("Payment initiation failed ❌");
            return;
         }

         // ❌ CHECK SDK
         if (!(window as any).Razorpay) {
            alert("Razorpay SDK not loaded ❌");
            setLoading(false);
            return;
         }

         const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_xxxxx",
            amount: paymentData.order.amount,
            currency: "INR",
            order_id: paymentData.order.id,

            handler: async function (response: any) {
               try {
                  if (!response?.razorpay_order_id) {
                     alert("Payment failed ❌");
                     setLoading(false);
                     return;
                  }

                  const verifyRes = await fetch("/api/payment/verify", {
                     method: "POST",
                     headers: {
                        "Content-Type": "application/json",
                     },
                     body: JSON.stringify({
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                        orderId: dbOrderId,
                     }),
                  });

                  const verifyData = await verifyRes.json();

                  if (!verifyData.success) {
                     alert("Payment verification failed ❌");
                     setLoading(false);
                     return;
                  }

                  setLoading(false);
                  router.push("/orders");

               } catch (err) {
                  console.error("VERIFY ERROR:", err);
                  setLoading(false);
                  alert("Verification failed ❌");
               }
            },

            modal: {
               ondismiss: function () {
                  setLoading(false);
               },
            },
         };

         const rzp = new (window as any).Razorpay(options);
         rzp.open();

      } catch (err) {
         console.error("FULL ERROR:", err); // 🔥 IMPORTANT
         setLoading(false);
         alert("Something went wrong ❌");
      }
   });




   return (
      <section className="checkout-area pb-50">
         <div className="container">
            {cart_products.length === 0 &&
               <div className='text-center pt-100'>
                  <h3>Your cart is empty</h3>
                  <Link href="/shop" className="tp-btn-2 mt-10">Return to shop</Link>
               </div>
            }
            {cart_products.length > 0 &&
               <form onSubmit={onSubmit}>
                  <div className="row">
                     <div className="col-lg-6 col-md-12">
                        <div className="checkbox-form">
                           <h3>Billing Details</h3>
                           <div className="row">
                              <div className="col-md-12">
                                 <div className="country-select">
                                    <label>Country <span className="required">*</span></label>
                                    <select id='country' {...register("country")}>
                                       <option defaultValue="united-states">United States</option>
                                       <option defaultValue="algeria">Algeria</option>
                                       <option defaultValue="canada">Canada</option>
                                       <option defaultValue="germany">Germany</option>
                                       <option defaultValue="england">England</option>
                                       <option defaultValue="qatar">Qatar</option>
                                       <option defaultValue="dominican-republic">Dominican Republic</option>
                                    </select>
                                    <ErrorMsg msg={errors.country?.message!} />
                                 </div>
                              </div>
                              <div className="col-md-6">
                                 <div className="checkout-form-list">
                                    <label>First Name <span className="required">*</span></label>
                                    <input id='firstName' {...register("firstName")} type="text" placeholder="First Name" />
                                    <ErrorMsg msg={errors.firstName?.message!} />
                                 </div>
                              </div>
                              <div className="col-md-6">
                                 <div className="checkout-form-list">
                                    <label>Last Name <span className="required">*</span></label>
                                    <input id='lastName' {...register("lastName")} type="text" placeholder="Last Name" />
                                    <ErrorMsg msg={errors.lastName?.message!} />
                                 </div>
                              </div>
                              <div className="col-md-12">
                                 <div className="checkout-form-list">
                                    <label>Company Name</label>
                                    <input id='company' {...register("company")} type="text" placeholder="Company" />
                                    <ErrorMsg msg={errors.company?.message!} />
                                 </div>
                              </div>
                              <div className="col-md-12">
                                 <div className="checkout-form-list">
                                    <label>Address <span className="required">*</span></label>
                                    <input id='address' {...register("address")} type="text" placeholder="Street address" />
                                    <ErrorMsg msg={errors.address?.message!} />
                                 </div>
                              </div>
                              <div className="col-md-12">
                                 <div className="checkout-form-list">
                                    <input id='apartment' {...register("apartment")} type="text" placeholder="Apartment, suite, unit etc. (optional)" />
                                 </div>
                              </div>
                              <div className="col-md-12">
                                 <div className="checkout-form-list">
                                    <label>Town / City <span className="required">*</span></label>
                                    <input id='city' {...register("city")} type="text" placeholder="Town / City" />
                                    <ErrorMsg msg={errors.city?.message!} />
                                 </div>
                              </div>
                              <div className="col-md-6">
                                 <div className="checkout-form-list">
                                    <label>State / County <span className="required">*</span></label>
                                    <input id='state' {...register("state")} type="text" placeholder="State" />
                                    <ErrorMsg msg={errors.state?.message!} />
                                 </div>
                              </div>
                              <div className="col-md-6">
                                 <div className="checkout-form-list">
                                    <label>Postcode / Zip <span className="required">*</span></label>
                                    <input id='zipCode' {...register("zipCode")} type="text" placeholder="Postcode / Zip" />
                                    <ErrorMsg msg={errors.zipCode?.message!} />
                                 </div>
                              </div>
                              <div className="col-md-6">
                                 <div className="checkout-form-list">
                                    <label>Email Address <span className="required">*</span></label>
                                    <input id='email' {...register("email")} type="email" placeholder="Email" />
                                    <ErrorMsg msg={errors.email?.message!} />
                                 </div>
                              </div>
                              <div className="col-md-6">
                                 <div className="checkout-form-list">
                                    <label>Phone <span className="required">*</span></label>
                                    <input id='phone' {...register("phone")} type="text" placeholder="Postcode / Zip" />
                                    <ErrorMsg msg={errors.phone?.message!} />
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="col-lg-6 col-md-12">
                        <div className="your-order mb-30 ">
                           <h3>Your order</h3>

                           <div className="your-order-table table-responsive">
                              <table>
                                 <thead>
                                    <tr>
                                       <th className="product-name">Product</th>
                                       <th className="product-total">Total</th>
                                    </tr>
                                 </thead>
                                 <tbody>
                                    {cart_products.map((product: any) => {
                                       const id = product?._id || product?.id;

                                       const name = product?.name || product?.title || "Product";

                                       const price = getPrice(product);
                                       const quantity = Number(product?.quantity) || 1;

                                       const subtotal = price * quantity;

                                       return (
                                          <tr className="cart_item" key={id}>
                                             <td className="product-name">
                                                {name}{" "}
                                                <strong className="product-quantity">
                                                   × {quantity}
                                                </strong>
                                             </td>

                                             <td className="product-total">
                                                <span className="amount">
                                                   Rs {subtotal.toFixed(2)}
                                                </span>
                                             </td>
                                          </tr>
                                       );
                                    })}
                                 </tbody>
                                 <tfoot>
                                    <tr className="cart-subtotal">
                                       <th>Cart Subtotal</th>
                                       <td><span className="amount">Rs {total.toFixed(2)}</span></td>
                                    </tr>
                                    <tr className="shipping">
                                       <th>Shipping</th>
                                       <td>
                                          <ul>
                                             <li>
                                                <input onChange={() => setShipCost(50.00)} checked={shipCost === 50.00} type="radio" id='shipping' name="shipping" />
                                                <label htmlFor='shipping'>
                                                   Flat Rate: <span className="amount">Rs. 50.00</span>
                                                </label>
                                             </li>
                                             <li>
                                                <input id='free-shipping' onChange={() => setShipCost('free')} type="radio" name="shipping" />
                                                <label htmlFor='free-shipping'>Free Shipping:</label>
                                             </li>
                                          </ul>
                                       </td>
                                    </tr>
                                    {discount > 0 && (
                                       <tr className="discount">
                                          <th>Discount</th>
                                          <td>
                                             <span className="amount text-success">
                                                - Rs {discount <= 100 ? ((total * discount) / 100).toFixed(2) : discount.toFixed(2)}
                                             </span>
                                          </td>
                                       </tr>
                                    )}
                                    <tr className="order-total">
                                       <th>Order Total</th>
                                       <td>
                                          <strong>
                                             <span className="amount">
                                                Rs {finalTotal.toFixed(2)}
                                             </span>
                                          </strong>
                                       </td>
                                    </tr>
                                 </tfoot>
                              </table>
                           </div>

                           <div className="payment-method">
                              {/* ❌ REMOVE OLD LOGIC */}
                              {/* <CheckoutOrder/> */}

                              {/* ✅ NEW PAYMENT BUTTON */}
                              <button type="submit" className="tp-btn w-100" disabled={loading}>
                                 {loading ? "Processing Payment..." : "Pay Now"}
                              </button>
                           </div>
                        </div>
                     </div>

                  </div>
               </form>
            }
         </div>
      </section>
   );
};

export default CheckoutArea;