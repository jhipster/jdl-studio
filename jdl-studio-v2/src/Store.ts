import { createStore } from "redux";
import { combineReducers } from "redux";
import { studio, StudioState } from "./components/studio/StudioReducer";
import { jhonline, JHOnlinState } from "./components/JhOnlineReducer";

export interface IRootState {
  readonly studio: StudioState;
  readonly jhonline: JHOnlinState;
}

export const rootReducer = combineReducers<IRootState>({
  studio,
  jhonline,
});

export const store = createStore(rootReducer);
