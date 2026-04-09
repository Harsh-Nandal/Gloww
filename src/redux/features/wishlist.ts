import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { notifyError, notifySuccess } from "@/utils/toast";

// ✅ SAME TYPE AS CART (IMPORTANT)
export interface WishlistProduct {
  _id: string;
  name: string;
  price: number;
  discountPrice: number;
  quantity: number;
  images: string[];
}

interface WishlistState {
  wishlist: WishlistProduct[];
}

const initialState: WishlistState = {
  wishlist: [],
};

// ✅ SAFE LOCAL STORAGE
const loadWishlistFromStorage = (): WishlistProduct[] => {
  try {
    const data = localStorage.getItem("wishlist_items");
    if (!data) return [];

    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) return [];

    return parsed as WishlistProduct[];
  } catch {
    return [];
  }
};

const saveWishlistToStorage = (wishlist: WishlistProduct[]) => {
  localStorage.setItem("wishlist_items", JSON.stringify(wishlist));
};

// ✅ SAME NORMALIZER AS CART (VERY IMPORTANT)
const normalizeProduct = (product: any): WishlistProduct | null => {
  const id = product?._id || product?.id;

  if (!id) return null;

  return {
    _id: String(id),
    name: String(product?.name || product?.title || "Product"),
    price: Number(product?.price || 0),
    discountPrice: Number(
      product?.discountPrice || product?.sale_price || 0
    ),
    quantity: 1, // wishlist always 1
    images: Array.isArray(product?.images) ? product.images : [],
  };
};

export const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    // ✅ ADD / REMOVE TOGGLE
    add_to_wishlist: (state, action: PayloadAction<any>) => {
      const normalized = normalizeProduct(action.payload);
      if (!normalized) return;

      const exists = state.wishlist.find(
        (item) => item._id === normalized._id
      );

      if (exists) {
        state.wishlist = state.wishlist.filter(
          (item) => item._id !== normalized._id
        );

        notifyError(`${normalized.name} removed from wishlist`);
      } else {
        state.wishlist.push(normalized);

        notifySuccess(`${normalized.name} added to wishlist`);
      }

      saveWishlistToStorage(state.wishlist);
    },

    // ✅ REMOVE
    remove_wishlist_product: (state, action: PayloadAction<any>) => {
      const normalized = normalizeProduct(action.payload);
      if (!normalized) return;

      state.wishlist = state.wishlist.filter(
        (item) => item._id !== normalized._id
      );

      notifyError(`${normalized.name} removed from wishlist`);

      saveWishlistToStorage(state.wishlist);
    },

    // ✅ LOAD
    getWishlistProducts: (state) => {
      state.wishlist = loadWishlistFromStorage();
    },
  },
});

export const {
  add_to_wishlist,
  remove_wishlist_product,
  getWishlistProducts,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;