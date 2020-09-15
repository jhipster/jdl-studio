import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
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

export const middlewares = applyMiddleware(thunk);

export const store = createStore(rootReducer, middlewares);
