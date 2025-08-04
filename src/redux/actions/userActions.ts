import { ActionType } from "./actionTypes";

// Action for user login success
export const loginSuccess = (user: any, token: string) => {
  return {
    type: ActionType.LOGIN_SUCCESS,
    payload: { user, token },
  };
};
// Action for user login failure
export const loginFailure = (errorMessage: string) => {
  return {
    type: ActionType.LOGIN_FAILURE,
    payload: errorMessage,
  };
};

// Action for user logout
export const logout = () => {
  return {
    type: ActionType.LOGOUT,
  };
};

// Action for updating user profile
export const updateUserProfile = (updatedUserData: any) => {
  return {
    type: ActionType.UPDATE_USER_PROFILE,
    payload: updatedUserData,
  };
};
