import { AutID } from "@api/aut.model";
import { createSelector, createSlice } from "@reduxjs/toolkit";
import { ResultState } from "@store/result-status";

export interface AuthState {
  isAuthenticated: boolean;
  userInfo: any;
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

export const userInfo = (state) => state.auth.userInfo as AutID;
export const UserInfo = createSelector([userInfo], (a) => a);
export const isAuthenticated = (state) => state.auth.isAuthenticated as boolean;
export const IsAuthenticated = createSelector([isAuthenticated], (a) => a);

export default authSlice.reducer;
