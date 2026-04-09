import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getLocalStorage, setLocalStorage } from "@/utils/localstorage";
import { notifyError, notifySuccess } from "@/utils/toast";
import { IProductData } from "@/types/product-d-t";

// ✅ STATE TYPE
interface CompareState {
  compare_products: IProductData[];
}

const initialState: CompareState = {
  compare_products: [],
};

// ✅ GET CLEAN ID (handles id + _id)
const getId = (product: any): string | null => {
  const id = product?.id || product?._id;
  return id ? String(id).trim() : null;
};

// ✅ DEDUPE
const dedupe = (items: IProductData[]) => {
  const seen = new Set<string>();
  return items.filter((item) => {
    const id = getId(item);
    if (!id || seen.has(id)) return false;
    seen.add(id);
    return true;
  });
};

export const compareSlice = createSlice({
  name: "compare",
  initialState,
  reducers: {
    // ✅ ADD / REMOVE TOGGLE
    add_to_compare: (state, action: PayloadAction<IProductData>) => {
      const payload = action.payload;
      const id = getId(payload);
      if (!id) return;

      const exists = state.compare_products.some(
        (item) => getId(item) === id
      );

      let updated: IProductData[];

      if (exists) {
        updated = state.compare_products.filter(
          (item) => getId(item) !== id
        );
        notifyError(`${payload.title} removed from compare`);
      } else {
        updated = dedupe([...state.compare_products, payload]);
        notifySuccess(`${payload.title} added to compare`);
      }

      state.compare_products = updated;
      setLocalStorage("compare_items", updated);
    },

    // ✅ REMOVE
    remove_compare_product: (
      state,
      action: PayloadAction<IProductData | string>
    ) => {
      const id =
        typeof action.payload === "string"
          ? action.payload
          : getId(action.payload);

      if (!id) return;

      const product = state.compare_products.find(
        (item) => getId(item) === id
      );

      const updated = state.compare_products.filter(
        (item) => getId(item) !== id
      );

      state.compare_products = updated;

      if (product) {
        notifyError(`${product.title} removed from compare`);
      }

      setLocalStorage("compare_items", updated);
    },

    // ✅ LOAD FROM LOCAL STORAGE (SAFE)
    getCompareProducts: (state) => {
      const data = getLocalStorage("compare_items");

      if (!Array.isArray(data)) {
        state.compare_products = [];
        return;
      }

      state.compare_products = dedupe(data);
    },

    // ✅ CLEAR (OPTIONAL)
    clear_compare: (state) => {
      state.compare_products = [];
      setLocalStorage("compare_items", []);
    },
  },
});

export const {
  add_to_compare,
  remove_compare_product,
  getCompareProducts,
  clear_compare,
} = compareSlice.actions;

export default compareSlice.reducer;