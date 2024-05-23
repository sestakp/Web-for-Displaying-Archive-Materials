import { Action, ThunkAction } from "@reduxjs/toolkit";
import RootState from "./rootState";


type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export default AppThunk;