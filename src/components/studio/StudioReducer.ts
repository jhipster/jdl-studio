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
};

const DEF_ERROR = {
  lineMarkerTop: -35,
  hasError: false,
  errorTooltip: "",
};
const STORAGE_KEY = "jdlstudio.lastSource";
const THEME_KEY = "jdlstudio.lightMode";
// this object stores the JDL code to local storage
let storage = buildStorage(location.hash, defaultSource); // eslint-disable-line no-restricted-globals

const rankers = ["network-simplex", "longest-path", "tight-tree"];

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
        ranker: rankers[findNextRanker(state.ranker)],
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
  storage = buildStorage(location.hash); // eslint-disable-line no-restricted-globals
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

export const setSidebar = (data) => ({
  type: ACTION_TYPES.SET_SIDEBAR,
  data,
});

export const setStorageStat = (data) => ({
  type: ACTION_TYPES.SET_STORAGE_STAT,
  data,
});

function urlDecode(encoded) {
  return decodeURIComponent(encoded.replace(/\+/g, " "));
}

function buildStorage(locationHash, defaultSource = "") {
  if (locationHash.substring(0, 7) === "#/view/") {
    return {
      read: function (): string {
        return urlDecode(locationHash.substring(7));
      },
      save: function (source: string) {},
      moveToLocalStorage: function (txt: string) {
        localStorage[STORAGE_KEY] = txt;
      },
      isReadonly: true,
    };
  }
  return {
    read: function (): string {
      return localStorage[STORAGE_KEY] || defaultSource;
    },
    save: function (source: string) {
      localStorage[STORAGE_KEY] = source;
    },
    moveToLocalStorage: function (txt) {},
    isReadonly: false,
  };
}

function findNextRanker(current) {
  const lastIndex = rankers.indexOf(current);
  if (lastIndex < rankers.length - 1) {
    return lastIndex + 1;
  }
  return 0;
}
