import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isModalOpen: false,
  materials: [
    {
      id: 1,
      name: "Wood",
    },
  ],
};

const materialSlice = createSlice({
  name: "material",
  initialState,
  reducers: {
    openModal(state) {
      state.isModalOpen = true;
    },
    closeModal(state) {
      state.isModalOpen = false;
    },
    addMaterial(state, action) {
      state.materials.push({ name: action.payload });
    },
  },
});

export const { openModal, closeModal, addMaterial } = materialSlice.actions;
export default materialSlice.reducer;
