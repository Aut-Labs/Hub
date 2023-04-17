import { useDispatch } from "react-redux";
import { ThunkDispatch, AnyAction } from "@reduxjs/toolkit";
import { reducers } from "./reducers";

export type RootState = ReturnType<typeof reducers>;
export type AppDispatch = ThunkDispatch<RootState, any, AnyAction>;
export const useAppDispatch = () => useDispatch<AppDispatch>();
