"use client";
import React, { useEffect, useState } from "react";
import { FourColDots, ListDots, ThreeColDots } from "../svg";
import usePagination from "@/hooks/use-pagination";
import Pagination from "../ui/pagination";
import NiceSelect from "../ui/nice-select";
import ShopItems from "./shop-items";

// tabs
const col_tabs = [
  { title: "four-col", icon: <FourColDots /> },
  { title: "three-col", icon: <ThreeColDots /> },
  { title: "list", icon: <ListDots /> },
];

type IProduct = {
  _id: string;
  title: string;
  price: number;
  category: any;
  createdAt: string;
};

type IProps = {
  list_style?: boolean;
};

const ShopAreaTwo = ({ list_style = false }: IProps) => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");

  const [activeTab, setActiveTab] = useState(
    list_style ? col_tabs[2].title : col_tabs[0].title
  );

  const pagination_per_page = activeTab === "four-col" ? 12 : 9;

  const { currentItems, handlePageClick, pageCount } =
    usePagination(filteredProducts, pagination_per_page);

  // ✅ SAFE CATEGORY EXTRACTOR (🔥 MAIN FIX)
  const getCategoryName = (category: any): string => {
    if (!category) return "";

    // if string
    if (typeof category === "string") return category.trim();

    // if object with name
    if (typeof category === "object" && category.name) {
      return String(category.name).trim();
    }

    return "";
  };

  // ✅ FETCH PRODUCTS
useEffect(() => {
  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data: IProduct[] = await res.json(); // ✅ typed

      setProducts(data);
      setFilteredProducts(data);

      // ✅ SAFE + TYPED UNIQUE CATEGORY
      const uniqueCategories: string[] = Array.from(
        new Set<string>(
          data
            .map((p) => getCategoryName(p.category))
            .filter((cat): cat is string => Boolean(cat && cat.trim()))
        )
      );

      setCategories(uniqueCategories);

    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  fetchProducts();
}, []);

  // ✅ FILTER BY CATEGORY
  const handleCategoryFilter = (cat: string) => {
    setActiveCategory(cat);

    if (cat === "all") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((p) => {
        const productCategory = getCategoryName(p.category);
        return productCategory === cat;
      });

      setFilteredProducts(filtered);
    }
  };

  // ✅ SORTING
  const handleSorting = (item: any) => {
    let sorted = [...filteredProducts];

    if (item.value === "new") {
      sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      );
    } else if (item.value === "high") {
      sorted.sort((a, b) => b.price - a.price);
    } else if (item.value === "low") {
      sorted.sort((a, b) => a.price - b.price);
    }

    setFilteredProducts(sorted);
  };

  return (
    <section className="shop-area-start grey-bg pb-200">
      <div className="container">
        <div className="row">
          <div className="col-xl-12">

            {/* CATEGORY FILTER */}
            <div className="mb-30 flex flex-wrap gap-3">
              <button
                className={`btn ${activeCategory === "all" ? "active" : ""}`}
                onClick={() => handleCategoryFilter("all")}
              >
                All
              </button>

              {categories.map((cat, i) => (
                <button
                  key={cat} // ✅ FIXED (no index)
                  className={`btn ${
                    activeCategory === cat ? "active" : ""
                  }`}
                  onClick={() => handleCategoryFilter(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* FILTER BAR */}
            <div className="product__filter-content mb-30">
              <div className="row align-items-center">

                <div className="col-sm-4">
                  <span>
                    Showing {currentItems.length} of {filteredProducts.length} Products
                  </span>
                </div>

                <div className="col-sm-4 text-center">
                  {col_tabs.map((tab) => (
                    <button
                      key={tab.title}
                      className={activeTab === tab.title ? "active" : ""}
                      onClick={() => setActiveTab(tab.title)}
                    >
                      {tab.icon}
                    </button>
                  ))}
                </div>

                <div className="col-sm-4 text-end">
                  <NiceSelect
                    options={[
                      { value: "", label: "Default sorting" },
                      { value: "new", label: "New Arrivals" },
                      { value: "high", label: "Price High To Low" },
                      { value: "low", label: "Price Low To High" },
                    ]}
                    defaultCurrent={0}
                    onChange={(item) => handleSorting(item)}
                    name="Sorting"
                  />
                </div>

              </div>
            </div>

            {/* PRODUCTS */}
            <ShopItems
              activeTab={activeTab}
              currentItems={currentItems}
            />

            {/* PAGINATION */}
            <div className="text-center mt-35">
              <Pagination
                handlePageClick={handlePageClick}
                pageCount={pageCount}
              />
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default ShopAreaTwo;