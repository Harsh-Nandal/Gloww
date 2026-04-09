import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IProductData } from "@/types/product-d-t";

// ✅ STATE TYPE
interface UtilityState {
  isShow: boolean;
  product: IProductData | null;
}

// ✅ INITIAL STATE
const initialState: UtilityState = {
  isShow: false,
  product: null,
};

export const utility = createSlice({
  name: "utility",
  initialState,
  reducers: {
    // ✅ SET PRODUCT + OPEN MODAL
    handleModalProduct: (state, action: PayloadAction<IProductData>) => {
      state.product = action.payload;
      state.isShow = true; // auto open
    },

    // ✅ OPEN MODAL (WITHOUT PRODUCT CHANGE)
    openModal: (state) => {
      state.isShow = true;
    },

    // ✅ CLOSE MODAL (IMPORTANT)
    closeModal: (state) => {
      state.isShow = false;
      state.product = null; // reset product
    },

    // ✅ OPTIONAL TOGGLE (SAFE USE)
    toggleModal: (state) => {
      state.isShow = !state.isShow;
    },
  },
});

export const {
  handleModalProduct,
  openModal,
  closeModal,
  toggleModal,
} = utility.actions;

export default utility.reducer;