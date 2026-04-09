"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type IProps = {
  isSearchOpen: boolean;
  setIsSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const SearchPopup = ({ isSearchOpen, setIsSearchOpen }: IProps) => {
  const [searchText, setSearchText] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // ✅ FETCH PRODUCTS
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/products");
        const data = await res.json();

        let finalData: any[] = [];

        if (Array.isArray(data)) {
          finalData = data;
        } else if (data.products) {
          finalData = data.products;
        }

        setProducts(finalData);
      } catch (error) {
        console.error("Search fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ✅ FILTER PRODUCTS
  const filteredProducts =
    searchText.trim() === ""
      ? []
      : products
          .filter((item: any) =>
            (item.name || item.title || "")
              .toLowerCase()
              .includes(searchText.toLowerCase())
          )
          .slice(0, 6);

  // input change
  const handleSearchText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  // submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchText.trim()) return;

    router.push(`/search?searchText=${searchText}`);
    setIsSearchOpen(false);
  };

  // click suggestion
  const handleSelectProduct = (id: string) => {
    if (!id) return;
    router.push(`/shop-details/${id}`);
    setIsSearchOpen(false);
  };

  return (
    <>
      <div
        className={`tpsearchbar tp-sidebar-area ${
          isSearchOpen ? "tp-searchbar-opened" : ""
        }`}
      >
        <button
          className="tpsearchbar__close"
          onClick={() => setIsSearchOpen(false)}
        >
          <i className="icon-x"></i>
        </button>

        <div className="search-wrap text-center">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-6 pt-100 pb-100">
                <h2 className="tpsearchbar__title">
                  What Are You Looking For?
                </h2>

                <div className="tpsearchbar__form position-relative">
                  <form onSubmit={handleSubmit}>
                    <input
                      type="text"
                      placeholder="Search Product..."
                      value={searchText}
                      onChange={handleSearchText}
                      autoComplete="off"
                    />
                    <button className="tpsearchbar__search-btn">
                      <i className="icon-search"></i>
                    </button>
                  </form>

                  {/* ✅ DROPDOWN */}
                  {searchText && (
                    <div className="search-dropdown">
                      {loading ? (
                        <p className="search-empty">Loading...</p>
                      ) : filteredProducts.length > 0 ? (
                        filteredProducts.map((item: any) => {
                          const id = item._id || item.id;
                          const image =
                            item.images?.[0] || "/placeholder.png";
                          const name = item.name || item.title;
                          const price =
                            item.discountPrice || item.price;

                          return (
                            <div
                              key={id}
                              className="search-item"
                              onClick={() => handleSelectProduct(id)}
                            >
                              <img src={image} alt={name} />
                              <div className="search-item-info">
                                <p className="title">{name}</p>
                                <span className="price">₹{price}</span>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <p className="search-empty">
                          No products found
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* overlay */}
      <div
        className={`search-body-overlay ${
          isSearchOpen ? "opened" : ""
        }`}
        onClick={() => setIsSearchOpen(false)}
      ></div>

      {/* ✅ STYLES */}
      <style jsx>{`
        .search-dropdown {
          position: absolute;
          width: 100%;
          background: #fff;
          border-radius: 10px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          margin-top: 10px;
          max-height: 350px;
          overflow-y: auto;
          z-index: 999;
          text-align: left;
        }

        .search-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          cursor: pointer;
          transition: 0.2s;
        }

        .search-item:hover {
          background: #f5f5f5;
        }

        .search-item img {
          width: 45px;
          height: 45px;
          object-fit: cover;
          border-radius: 6px;
        }

        .search-item-info .title {
          font-size: 14px;
          margin: 0;
          font-weight: 500;
        }

        .search-item-info .price {
          font-size: 13px;
          color: #888;
        }

        .search-empty {
          padding: 15px;
          text-align: center;
          color: #999;
        }
      `}</style>
    </>
  );
};

export default SearchPopup;