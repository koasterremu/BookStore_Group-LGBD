import { UserAction, ActionType } from "../actions/actionTypes";

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

const userReducer = (state: any = initialState, action: UserAction) => {
  switch (action.type) {
    // login success
    case ActionType.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
      };
    // login failure
    case ActionType.LOGIN_FAILURE:
      return {
        ...state,
        user: null, // clears user information
        isAuthenticated: false, // sets authentication status to false
        error: action.payload, // stores the error message from payload
      };

    // logout
    case ActionType.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
      };

    // update user profile
    case ActionType.UPDATE_USER_PROFILE:
      return {
        ...state,
        user: { ...state.user, ...action.payload }, // Cập nhật thông tin người dùng
      };
    default:
      return state;
  }
};

export default userReducer;
