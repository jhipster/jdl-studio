// sample JDL
import { defaultSource } from "../../resources/Samples";

export const ACTION_TYPES = {
  SET_CODE: "studio/SET_CODE",
  SET_ERROR: "studio/SET_ERROR",
  SET_STORAGE_STAT: "studio/SET_STORAGE_STAT",
  SET_CANVAS_MODE: "studio/SET_CANVAS_MODE",
  SET_SIDEBAR: "studio/SET_SIDEBAR",
  TOGGLE_THEME: "studio/TOGGLE_THEME",
  TOGGLE_RANKER: "studio/TOGGLE_RANKER",
  TOGGLE_DIRECTION: "studio/TOGGLE_DIRECTION",
};

const DEF_ERROR = {
  lineMarkerTop: -35,
  hasError: false,
  errorTooltip: "",
};
const STORAGE_KEY = "jdlstudio.lastSource";
const THEME_KEY = "jdlstudio.lightMode";
// this object stores the JDL code to local storage
let storage = buildStorage(defaultSource);

const rankers = ["tight-tree", "longest-path"];
const directions = ["down", "right"];

const initialState = {
  loading: false,
  code: storage.read(),
  error: DEF_ERROR,
  isStorageReadOnly: storage.isReadonly,
  isCanvasMode: false,
  sidebarVisible: false,
  isLightMode: localStorage[THEME_KEY] === "true" ? true : false,
  sidebarId: "",
  ranker: rankers[0],
  direction: directions[0],
};

export type StudioState = Readonly<typeof initialState>;

export const studio = (
  state: StudioState = initialState,
  action
): StudioState => {
  switch (action.type) {
    case ACTION_TYPES.SET_CODE:
      return {
        ...state,
        code: action.data,
      };
    case ACTION_TYPES.SET_ERROR:
      return {
        ...state,
        error: action.data,
      };
    case ACTION_TYPES.SET_STORAGE_STAT:
      return {
        ...state,
        isStorageReadOnly: action.data,
      };
    case ACTION_TYPES.SET_CANVAS_MODE:
      return {
        ...state,
        isCanvasMode: action.data,
      };
    case ACTION_TYPES.TOGGLE_RANKER:
      return {
        ...state,
        ranker: rankers[findNextIndex(rankers.indexOf(state.ranker))],
      };
    case ACTION_TYPES.TOGGLE_DIRECTION:
      return {
        ...state,
        direction:
          directions[findNextIndex(directions.indexOf(state.direction))],
      };
    case ACTION_TYPES.TOGGLE_THEME:
      localStorage[THEME_KEY] = !state.isLightMode;
      return {
        ...state,
        isLightMode: !state.isLightMode,
      };
    case ACTION_TYPES.SET_SIDEBAR:
      return {
        ...state,
        sidebarVisible: !state.sidebarId || state.sidebarId !== action.data,
        sidebarId: state.sidebarId !== action.data ? action.data : "",
      };
    default:
      return state;
  }
};

export const reloadStorage: () => void = () => (dispatch) => {
  storage = buildStorage(defaultSource);
  dispatch(setCode(storage.read()));
  dispatch(setStorageStat(storage.isReadonly));
};

export const setCode = (data) => {
  storage.save(data);
  return {
    type: ACTION_TYPES.SET_CODE,
    data,
  };
};

export const setError = (data) => ({
  type: ACTION_TYPES.SET_ERROR,
  data,
});

export const setDefaultError = () => ({
  type: ACTION_TYPES.SET_ERROR,
  data: DEF_ERROR,
});

export const setCanvasMode = (data) => ({
  type: ACTION_TYPES.SET_CANVAS_MODE,
  data,
});

export const toggleLightMode = () => ({
  type: ACTION_TYPES.TOGGLE_THEME,
});

export const toggleRanker = () => ({
  type: ACTION_TYPES.TOGGLE_RANKER,
});

export const toggleDirection = () => ({
  type: ACTION_TYPES.TOGGLE_DIRECTION,
});

export const setSidebar = (data) => ({
  type: ACTION_TYPES.SET_SIDEBAR,
  data,
});

export const setStorageStat = (data) => ({
  type: ACTION_TYPES.SET_STORAGE_STAT,
  data,
});

function buildStorage(defaultSource = "") {
  return {
    read: function (): string {
      return localStorage[STORAGE_KEY] || defaultSource;
    },
    save: function (source: string) {
      localStorage[STORAGE_KEY] = source;
    },
    isReadonly: false,
  };
}

function findNextIndex(lastIndex) {
  return lastIndex === 0 ? 1 : 0;
}
