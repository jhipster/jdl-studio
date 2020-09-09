// sample JDL
import { defaultSource } from "../../resources/Samples";

export const ACTION_TYPES = {
  SET_CODE: "studio/SET_CODE",
  SET_ERROR: "studio/SET_ERROR",
  SET_STORAGE_STAT: "studio/SET_STORAGE_STAT",
  SET_CANVAS_MODE: "studio/SET_CANVAS_MODE",
};

const DEF_ERROR = {
  lineMarkerTop: -35,
  hasError: false,
  errorTooltip: "",
};
const STORAGE_KEY = "jdlstudio.lastSource";
// this object stores the JDL code to local storage
let storage = buildStorage(location.hash, defaultSource); // eslint-disable-line no-restricted-globals

const initialState = {
  loading: false,
  code: storage.read(),
  error: DEF_ERROR,
  isStorageReadOnly: storage.isReadonly,
  isCanvasMode: false,
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
    default:
      return state;
  }
};

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

export const setStorageStat = (data) => ({
  type: ACTION_TYPES.SET_STORAGE_STAT,
  data,
});
