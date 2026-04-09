import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { maxPrice } from "@/utils/utils";

// ✅ TYPE
interface IFilterState {
  category: string;
  subCategory: string;
  sizes: string[];
  colors: string[];
  brand: string;
  itemOffset: number;
  priceValue: number[];
  ratingValue: number;
}

// ✅ SAFE INITIAL STATE
const initialState: IFilterState = {
  category: "",
  subCategory: "",
  sizes: [],
  colors: [],
  brand: "",
  itemOffset: 0,
  priceValue: [0, typeof window !== "undefined" ? maxPrice() : 10000], // ✅ safe fallback
  ratingValue: 0,
};

export const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    // ✅ CATEGORY
    add_category: (state, action: PayloadAction<string>) => {
      state.category =
        state.category === action.payload ? "" : action.payload;
      state.itemOffset = 0;
    },

    // ✅ SUB CATEGORY
    add_sub_category: (state, action: PayloadAction<string>) => {
      state.subCategory =
        state.subCategory === action.payload ? "" : action.payload;
      state.itemOffset = 0;
    },

    // ✅ SIZE
    add_sizes: (state, action: PayloadAction<string>) => {
      const exists = state.sizes.includes(action.payload);

      state.sizes = exists
        ? state.sizes.filter((s) => s !== action.payload)
        : [...state.sizes, action.payload];

      state.itemOffset = 0;
    },

    // ✅ COLOR
    add_colors: (state, action: PayloadAction<string>) => {
      const exists = state.colors.includes(action.payload);

      state.colors = exists
        ? state.colors.filter((c) => c !== action.payload)
        : [...state.colors, action.payload];

      state.itemOffset = 0;
    },

    // ✅ BRAND
    add_brand: (state, action: PayloadAction<string>) => {
      state.brand =
        state.brand === action.payload ? "" : action.payload;
      state.itemOffset = 0;
    },

    // ✅ PAGINATION OFFSET
    set_item_offset: (state, action: PayloadAction<number>) => {
      state.itemOffset = action.payload;
    },

    // ✅ PRICE RANGE (SAFE)
    set_price_value: (state, action: PayloadAction<number[]>) => {
      if (
        Array.isArray(action.payload) &&
        action.payload.length === 2
      ) {
        state.priceValue = action.payload;
        state.itemOffset = 0;
      }
    },

    // ✅ RATING
    rating_filter: (state, action: PayloadAction<number>) => {
      state.ratingValue = action.payload;
      state.itemOffset = 0;
    },

    // ✅ RESET ALL FILTERS
    reset: (state) => {
      state.category = "";
      state.subCategory = "";
      state.sizes = [];
      state.colors = [];
      state.brand = "";
      state.priceValue = [
        0,
        typeof window !== "undefined" ? maxPrice() : 10000,
      ];
      state.ratingValue = 0;
      state.itemOffset = 0; // ✅ FIXED
    },
  },
});

export const {
  add_category,
  add_sub_category,
  add_sizes,
  add_colors,
  add_brand,
  reset,
  set_item_offset,
  set_price_value,
  rating_filter,
} = filterSlice.actions;

export default filterSlice.reducer;