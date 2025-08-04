import { CartAction, ActionType } from "../actions/actionTypes";

const initialState = {
  cart: [],
};

const cartReducer = (state: any = initialState, action: CartAction) => {
  switch (action.type) {
    // add to cart
    case ActionType.ADD_TO_CART:
      let alreadyExists: boolean = false;

      state.cart.forEach((product: any) => {
        if (
          product._id === action.payload._id &&
          product.selectedAttribute === action.payload.selectedAttribute
        ) {
          alreadyExists = true;
          product.count++;
        }
      });

      if (!alreadyExists) {
        state.cart.push({ ...action.payload, count: 1 });
      }

      return {
        ...state,
      };

    // making isInCart True
    case ActionType.MAKE_ISINCART_TRUE:
      return {
        ...state,
        cart: state.cart.map((product: any) =>
          product._id === action.payload
            ? { ...product, isInCart: (product.isInCart = true) }
            : product
        ),
      };

    // delete from cart
    case ActionType.DELETE_FROM_CART:
      return {
        ...state,
        cart: state.cart.filter(
          (product: any) => product._id !== action.payload
        ),
      };

    // clear cart
    case ActionType.CLEAR_CART:
      return {
        ...state,
        cart: [],
      };

    // increasing product count
    case ActionType.INCREASE_PRODUCT_COUNT:
      return {
        ...state,
        cart: state.cart.map((product: any) =>
          product._id === action.payload
            ? { ...product, count: product.count + 1 }
            : product
        ),
      };

    // decreasing product count
    case ActionType.DECREASE_PRODUCT_COUNT:
      return {
        ...state,
        cart: state.cart.map((product: any) =>
          product._id === action.payload
            ? { ...product, count: product.count - 1 }
            : product
        ),
      };

    default:
      return state;
  }
};

export default cartReducer;
