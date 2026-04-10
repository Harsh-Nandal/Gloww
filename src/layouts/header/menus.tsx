"use client";
import React from "react";
import Link from "next/link";

const Menus = () => {
  return (
    <nav id="mobile-menu">
      <ul className="flex items-center gap-6">
        
        {/* HOME */}
        <li>
          <Link href="/home-2" className="menu-link">
            Home
          </Link>
        </li>

        {/* SHOP */}
        <li>
          <Link href="/shop-list" className="menu-link">
            Shop
          </Link>
        </li>

        {/* ABOUT */}
        <li>
          <Link href="/about" className="menu-link">
            About
          </Link>
        </li>

        {/* BLOG */}
        <li>
          <Link href="/blog" className="menu-link">
            Blog
          </Link>
        </li>
        <li>
          <Link href="/faq" className="menu-link">
            Faq
          </Link>
        </li>

        {/* CONTACT */}
        <li>
          <Link href="/contact" className="menu-link">
            Contact
          </Link>
        </li>

      </ul>
    </nav>
  );
};

export default Menus;