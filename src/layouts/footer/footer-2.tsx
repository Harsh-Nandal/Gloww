"use client";
import React from "react";
import Image from "next/image";
import payment from "@/assets/img/shape/footer-payment.png";
import download_app from "@/assets/img/shape/download-app.png";
import Link from "next/link";

const FooterTwo = () => {
  return (
    <footer>
      <div className="tpfooter__area tpfooter__border theme-bg-2">
        <div className="tpfooter__top pt-140 pb-15">
          <div className="container">
            <div className="row">

              {/* COLUMN 1 */}
              <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
                <div className="tpfooter__widget footer-2-col-1 mb-50">
                  <h4 className="tpfooter__widget-title">Gloww Wellness</h4>
                  <p>
                    Discover premium natural supplements like <br />
                    Shilajit & Sea Buckthorn for better energy, <br />
                    immunity & overall health.
                  </p>

                  <div className="tpfooter__widget-social mt-45">
                    <span className="tpfooter__widget-social-title mb-5">
                      Download App:
                    </span>
                    <a href="#">
                      <Image src={download_app} alt="download_app" />
                    </a>
                  </div>
                </div>
              </div>

              {/* COLUMN 2 */}
              <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
                <div className="tpfooter__widget footer-2-col-2 mb-50">
                  <h4 className="tpfooter__widget-title">Need Help?</h4>
                  <p>Have questions about our products?</p>

                  <a
                    className="tpfooter__phone-num"
                    href="tel:+91-9999999999"
                  >
                    +91-9999999999
                  </a>

                  <div className="tpfooter__widget-time-info mt-35">
                    <span>
                      Monday – Friday: <b>9:00 AM – 7:00 PM</b>
                    </span>
                    <span>
                      Saturday: <b>10:00 AM – 5:00 PM</b>
                    </span>
                    <span>
                      Sunday: <b>Closed</b>
                    </span>
                  </div>
                </div>
              </div>

              {/* COLUMN 3 */}
              <div className="col-xl-2 col-lg-4 col-md-4 col-sm-4">
                <div className="tpfooter__widget footer-2-col-3 mb-50">
                  <h4 className="tpfooter__widget-title">Information</h4>
                  <div className="tpfooter__widget-links">
                    <ul>
                      <li><Link href="/blog">Health Blog</Link></li>
                      <li><Link href="/about">About Gloww</Link></li>
                      <li><a href="#">Secure Shopping</a></li>
                      <li><a href="#">Shipping & Delivery</a></li>
                      <li><a href="#">Privacy Policy</a></li>
                      <li><a href="#">Customer Reviews</a></li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* COLUMN 4 */}
              <div className="col-xl-2 col-lg-3 col-md-4 col-sm-4">
                <div className="tpfooter__widget footer-2-col-3 mb-50">
                  <h4 className="tpfooter__widget-title">Quick Links</h4>
                  <div className="tpfooter__widget-links">
                    <ul>
                      <li><a href="#">Track Order</a></li>
                      <li><Link href="/profile">My Account</Link></li>
                      <li><a href="#">Orders History</a></li>
                      <li><Link href="/faq">FAQs</Link></li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* COLUMN 5 */}
              <div className="col-xl-2 col-lg-4 col-md-4 col-sm-4">
                <div className="tpfooter__widget footer-2-col-3 mb-50">
                  <h4 className="tpfooter__widget-title">My Account</h4>
                  <div className="tpfooter__widget-links">
                    <ul>
                      <li><a href="#">Product Support</a></li>
                      <li><a href="#">Checkout</a></li>
                      <li><a href="#">Shopping Cart</a></li>
                      <li><a href="#">Wishlist</a></li>
                      <li><a href="#">Offers</a></li>
                      <li><a href="#">Redeem Voucher</a></li>
                    </ul>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="tpfooter___bottom pt-40 pb-40">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 col-sm-12">
                <div className="tpfooter__copyright text-center">

                  <div className="tpfooter__payment mb-15">
                    <a href="#">
                      <Image
                        src={payment}
                        alt="payment"
                        style={{ height: "auto" }}
                      />
                    </a>
                  </div>

                  <span className="tpfooter__copyright-text">
                    Copyright © <a href="#">Gloww</a>. 
                    All rights reserved.
                  </span>

                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default FooterTwo;