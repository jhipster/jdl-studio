import { createStore } from "redux";
import { combineReducers } from "redux";
import { studio, StudioState } from "./components/studio/StudioReducer";
import { jhOnline, JhOnlineState } from "./components/JhOnlineReducer";

export interface IRootState {
  readonly studio: StudioState;
  readonly jhOnline: JhOnlineState;
}

export const rootReducer = combineReducers<IRootState>({
  studio,
  jhOnline,
});

export const store = createStore(rootReducer);
