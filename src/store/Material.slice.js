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
      if (
        state.materials.find((material) => material.name === action.payload) ||
        !action.payload
      ) {
        return;
      } else {
        state.materials.push({
          name: action.payload,
          id: state.materials.length + 1,
        });
      }

      state.isModalOpen = false;
    },
  },
});

export const { openModal, closeModal, addMaterial } = materialSlice.actions;
export default materialSlice.reducer;
