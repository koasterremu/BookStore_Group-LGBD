import { ActionType, WishlistAction } from "../actions/actionTypes";

const initialState = {
  wishlist: [],
};

const wishlistReducer = (state: any = initialState, action: WishlistAction) => {
  switch (action.type) {
    // Thêm sản phẩm vào Wishlist
    case ActionType.ADD_TO_WISHLIST:
      return {
        ...state,
        wishlist: [...state.wishlist, action.payload],
      };

    // Đặt isInWishlist của sản phẩm trong Wishlist thành true
    case ActionType.MAKE_IS_IN_WISHLIST_TRUE_IN_WISHLIST:
      return {
        ...state,
        wishlist: state.wishlist.map((product: any) =>
          product._id === action.payload
            ? { ...product, isInWishlist: (product.isInWishlist = true) }
            : product
        ),
      };

    // Đặt isInCart của sản phẩm trong Wishlist thành false
    case ActionType.MAKE_WISHLIST_PRODUCT_ISINCART_FALSE:
      return {
        ...state,
        wishlist: state.wishlist.map((product: any) =>
          product._id === action.payload
            ? { ...product, isInCart: (product.isInCart = false) }
            : product
        ),
      };

    // Xóa sản phẩm khỏi Wishlist
    case ActionType.REMOVE_FROM_WISHLIST:
      return {
        ...state,
        wishlist: state.wishlist.filter(
          (product: any) => product._id !== action.payload
        ),
      };

    default:
      return state;
  }
};

export default wishlistReducer;
