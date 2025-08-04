import { combineReducers } from "redux";
import primaryReducer from "./primaryReducer";
import productReducer from "./productReducer";
import cartReducer from "./cartReducer";
import wishlistReducer from "./wishlistReducer";
import compareReducer from "./compareReducer";
import userReducer from "./userReducer";

const reducers = combineReducers({
  primary: primaryReducer,
  products: productReducer,
  cart: cartReducer,
  wishlist: wishlistReducer,
  compare: compareReducer,
  user: userReducer,
});

export default reducers;

export type RootState = ReturnType<typeof reducers>;
