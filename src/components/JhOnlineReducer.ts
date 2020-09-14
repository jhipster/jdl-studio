import { setCode } from "./studio/StudioReducer";

export const ACTION_TYPES = {
  SET_JDL: "jhOnline/SET_JDL",
  SET_AUTH: "jhOnline/SET_AUTH",
  SET_JDL_META: "jhOnline/SET_JDL_META",
};

const initialState = {
  insideJhOnline: isInJHOnline(),
  authenticated: false,
  username: "",
  jdlId: "",
  jdls: [] as {
    name: string;
    id: string;
  }[],
  startLoadingFlag: false,
};

const server_api = '';

export type JhOnlineState = Readonly<typeof initialState>;

export const jhOnline = (
  state: JhOnlineState = initialState,
  action
): JhOnlineState => {
  switch (action.type) {
    case ACTION_TYPES.SET_AUTH:
      return {
        ...state,
        ...action.data,
      };
    case ACTION_TYPES.SET_JDL:
      return {
        ...state,
        jdlId: action.data,
      };
    case ACTION_TYPES.SET_JDL_META:
      return {
        ...state,
        jdls: action.data,
      };
    default:
      return state;
  }
};

export const setJDL = (data) => {
  return ({
    type: ACTION_TYPES.SET_JDL,
    data,
  })
};

export const loadJdl = () => async (dispatch, getState) => {
  const state = getState().jhOnline as JhOnlineState;
  if (!state.jdlId) {
    dispatch(fetchAllJDLsMetadata());
    dispatch({
      type: ACTION_TYPES.SET_JDL,
      data: "",
    });
    setViewHash("");
    return
  }

  try {
    const res = await fetch(`${server_api}/api/jdl/${state.jdlId}`);
    const json = await res.json();
    let content = '';
    if (json.content !== undefined) {
      content = json.content;
    }
    dispatch(setCode(content));
    setViewHash(state.jdlId);
  } catch (e) {
    console.error(e);
    dispatch(fetchAllJDLsMetadata());
    dispatch({
      type: ACTION_TYPES.SET_JDL,
      data: "",
    });
    setViewHash("");
  }
};

export const fetchAllJDLsMetadata = () => async (dispatch, getState) => {
  try {
    const res = await fetch(`${server_api}/api/jdl-metadata`);
    const json = await res.json();
    dispatch({
      type: ACTION_TYPES.SET_JDL_META,
      data: json,
    });
    var viewHash = getViewHash();
    if (viewHash === "") {
      return;
    }
    for (var index = 0; index < json.length; ++index) {
      if (viewHash === json[index].id) {
        dispatch({
          type: ACTION_TYPES.SET_JDL,
          data: viewHash,
        });
      }
    }
  } catch (e) {
    console.error(e);
  }
};

export const initAuthentication = () => async (dispatch, getState) => {
  const authToken = JSON.parse(
    localStorage.getItem('jhi-authenticationtoken') ||
    sessionStorage.getItem('jhi-authenticationtoken') ||
    'null'
  );
  if (authToken || process.env.NODE_ENV === "development") {
    try {
      const res = await fetch(`${server_api}/api/account`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const json = await res.json();
      dispatch({
        type: ACTION_TYPES.SET_AUTH,
        data: {
          authenticated: true,
          username: json.login,
        },
      });
      const jdlId = getViewHash();
      if (jdlId !== "") {
        dispatch({
          type: ACTION_TYPES.SET_JDL,
          data: jdlId,
        });
        dispatch(loadJdl());
      }
      dispatch(fetchAllJDLsMetadata());
    } catch (e) {
      console.error('Cannot get authentication token', e);
      dispatch({
        type: ACTION_TYPES.SET_AUTH,
        data: {
          authenticated: false,
          username: "",
        },
      });
    }
  }
};

function getViewHash() {
  const hash = location.hash; // eslint-disable-line no-restricted-globals
  if (!hash) {
    return '';
  }
  return hash.substring(8, hash.length);
}

function setViewHash(jdlId) {
  // TODO this doesn't seem to work
  if (!jdlId) {
    location.hash = '/'// eslint-disable-line no-restricted-globals
    return
  }
  location.hash = "/view/" + jdlId; // eslint-disable-line no-restricted-globals
}

function isInJHOnline() {
  return window.location.href.indexOf("www.jhipster.tech/jdl-studio") === -1;
}
