import { HubOSAutID } from "@api/aut.model";
import { createSelector, createSlice } from "@reduxjs/toolkit";

export interface AuthState {
  isAuthenticated: boolean;
  userInfo: HubOSAutID;
  userAddress: string;
}

const initialState: AuthState = {
  isAuthenticated: false,
  userAddress: null,
  userInfo: null
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthenticated(state, action) {
      const { isAuthenticated, userInfo } = action.payload;
      state.isAuthenticated = isAuthenticated;
      state.userInfo = userInfo;
    },
    setUserAddress(state, action) {
      state.userAddress = action.payload;
    },
    resetAuthState: () => initialState
  }
});

export const { setAuthenticated, setUserAddress, resetAuthState } =
  authSlice.actions;

export const userInfo = (state) => state.auth.userInfo as HubOSAutID;
export const UserInfo = createSelector([userInfo], (a) => a);
export const IsAuthenticated = (state) => state.auth.isAuthenticated as boolean;

export default authSlice.reducer;
