import { createStore } from "redux";
import { combineReducers } from "redux";
import { studio, StudioState } from "./components/StudioReducer";

export interface IRootState {
  readonly studio: StudioState;
}

export const rootReducer = combineReducers<IRootState>({
  studio,
});

export const store = createStore(rootReducer);
