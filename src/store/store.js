import { configureStore } from "@reduxjs/toolkit";
import materialReducer from "./Material.slice";

const store = configureStore({
  reducer: {
    material: materialReducer,
  },
});

export default store;
