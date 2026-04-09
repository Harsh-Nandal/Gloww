import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { notifyError, notifySuccess } from "@/utils/toast";

// ✅ STRICT TYPE
export interface CartProduct {
  _id: string;
  name: string;
  price: number;
  discountPrice: number;
  quantity: number;
  images: string[];
}

interface CartState {
  cart_products: CartProduct[];
}

const initialState: CartState = {
  cart_products: [],
};

// ✅ SAFE LOCAL STORAGE
const loadCartFromStorage = (): CartProduct[] => {
  try {
    const data = localStorage.getItem("cart_products");
    if (!data) return [];

    const parsed = JSON.parse(data);

    if (!Array.isArray(parsed)) return [];

    return parsed as CartProduct[];
  } catch {
    return [];
  }
};

const saveCartToStorage = (cart: CartProduct[]) => {
  localStorage.setItem("cart_products", JSON.stringify(cart));
};

// ✅ NORMALIZER
const normalizeProduct = (product: any): CartProduct | null => {
  const id = product?._id || product?.id;

  if (!id) return null; // ❗ MUST HAVE ID

  return {
    _id: String(id),
    name: String(product?.name || product?.title || "Product"),
    price: Number(product?.price || 0),
    discountPrice: Number(
      product?.discountPrice || product?.sale_price || 0
    ),
    quantity: Number(product?.quantity || product?.orderQuantity || 1),
    images: Array.isArray(product?.images) ? product.images : [],
  };
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // ✅ ADD / INCREMENT
    add_cart_product: (state, action: PayloadAction<any>) => {
      const normalized = normalizeProduct(action.payload);
      if (!normalized) return;

      const existing = state.cart_products.find(
        (item) => item._id === normalized._id
      );

      if (existing) {
        existing.quantity += 1;
      } else {
        state.cart_products.push(normalized);
        notifySuccess(`${normalized.name} added to cart`);
      }

      saveCartToStorage(state.cart_products);
    },

    // ✅ DECREMENT
    quantityDecrement: (state, action: PayloadAction<any>) => {
      const normalized = normalizeProduct(action.payload);
      if (!normalized) return;

      const item = state.cart_products.find(
        (i) => i._id === normalized._id
      );

      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }

      saveCartToStorage(state.cart_products);
    },

    // ✅ REMOVE
    remove_product: (state, action: PayloadAction<any>) => {
      const normalized = normalizeProduct(action.payload);
      if (!normalized) return;

      state.cart_products = state.cart_products.filter(
        (item) => item._id !== normalized._id
      );

      notifyError(`${normalized.name} removed from cart`);
      saveCartToStorage(state.cart_products);
    },

    // ✅ CLEAR
    clearCart: (state) => {
      state.cart_products = [];
      saveCartToStorage([]);
    },

    // ✅ LOAD
    getCartProducts: (state) => {
      state.cart_products = loadCartFromStorage();
    },
  },
});

export const {
  add_cart_product,
  quantityDecrement,
  remove_product,
  clearCart,
  getCartProducts,
} = cartSlice.actions;

export default cartSlice.reducer;