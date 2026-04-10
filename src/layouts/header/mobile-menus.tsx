"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { mobile_menus } from "@/data/menu-data";

const MobileMenus = () => {
  const [navTitle, setNavTitle] = useState<string | null>(null);

  const toggleMenu = (menu: string) => {
    setNavTitle((prev) => (prev === menu ? null : menu));
  };

  return (
    <ul className="mobile-menu-list">
      {mobile_menus?.map((menu) => {
        const isOpen = navTitle === menu.name;

        return (
          <li
            key={menu.id}
            className={`${menu?.has_dropdown ? "has-dropdown" : ""} ${
              menu?.home_menus ? "has-homemenu" : ""
            } ${isOpen ? "active" : ""}`}
          >
            {/* MAIN LINK */}
            <div className="menu-item">
              <Link href={menu.link}>{menu.name}</Link>

              {(menu?.home_menus || menu?.dropdown_menus) && (
                <button
                  onClick={() => toggleMenu(menu.name)}
                  className={`mean-expand ${isOpen ? "mean-clicked" : ""}`}
                  aria-label="Toggle Menu"
                >
                  <i
                    className={`fal ${
                      isOpen ? "fa-minus" : "fa-plus"
                    }`}
                  ></i>
                </button>
              )}
            </div>

            {/* HOME MENUS */}
            {menu?.home_menus && (
              <ul
                className="sub-menu home-menu-style"
                style={{ display: isOpen ? "block" : "none" }}
              >
                {menu.home_menus.map((home_menu, i) => (
                  <li key={i}>
                    <Link href={home_menu.link}>
                      <Image
                        src={home_menu.img}
                        alt={home_menu.title || "menu-image"}
                        width={208}
                        height={219}
                        style={{ width: "100%", height: "auto" }}
                      />
                      <span>{home_menu.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            {/* DROPDOWN MENUS */}
            {menu?.dropdown_menus && (
              <ul
                className="sub-menu"
                style={{ display: isOpen ? "block" : "none" }}
              >
                {menu.dropdown_menus.map((dropdown_menu, i) => (
                  <li key={i}>
                    <Link href={dropdown_menu.link}>
                      {dropdown_menu.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default MobileMenus;