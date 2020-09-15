import { Server } from "miragejs";
import { setCode } from "./studio/StudioReducer";
import mocksConfig from "../mocks";

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

const server_api = "";

// setup a mock server when running standalone and not in production mode
if (process.env.NODE_ENV !== "production" && !isInJHOnline()) {
  new Server(mocksConfig);
}

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
  return {
    type: ACTION_TYPES.SET_JDL,
    data,
  };
};

function getAuthHeader() {
  const authToken = JSON.parse(
    localStorage.getItem("jhi-authenticationtoken") ||
      sessionStorage.getItem("jhi-authenticationtoken") ||
      "null"
  );
  if (authToken) {
    return {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };
  }
  return null;
}

export const initAuthentication = () => async (dispatch) => {
  const authHeader = getAuthHeader();
  if (authHeader || process.env.NODE_ENV === "development") {
    try {
      const res = await fetch(`${server_api}/api/account`, authHeader || {});
      const json = await res.json();
      if (res.ok) {
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
      } else {
        handleAuthError(`${res.statusText}: ${json.detail}`, dispatch);
      }
    } catch (e) {
      handleAuthError(e, dispatch);
    }
  } else {
    console.log("Auth token not found");
  }
};

export const fetchAllJDLsMetadata = () => async (dispatch) => {
  const authHeader = getAuthHeader();
  if (authHeader) {
    try {
      const res = await fetch(`${server_api}/api/jdl-metadata`, authHeader);
      const json = await res.json();
      if (res.ok) {
        dispatch({
          type: ACTION_TYPES.SET_JDL_META,
          data: json,
        });
        var viewHash = getViewHash();
        if (viewHash === "") {
          return;
        }
        json.forEach((it) => {
          if (viewHash === it.id) {
            dispatch({
              type: ACTION_TYPES.SET_JDL,
              data: viewHash,
            });
          }
        });
      } else {
        handleJDLMetadataError(`${res.statusText}: ${json.detail}`, dispatch);
      }
    } catch (e) {
      handleJDLMetadataError(e, dispatch);
    }
  } else {
    console.log("Auth token not found");
  }
};

export const loadJdl = () => async (dispatch, getState) => {
  const state = getState().jhOnline as JhOnlineState;
  if (!state.jdlId) {
    handleJDLError("JDL not set", dispatch);
    return;
  }
  const authHeader = getAuthHeader();
  if (authHeader) {
    try {
      const res = await fetch(
        `${server_api}/api/jdl/${state.jdlId}`,
        authHeader
      );
      const json = await res.json();
      if (res.ok) {
        let content = "";
        if (json.content !== undefined) {
          content = json.content;
        }
        dispatch(setCode(content));
        setViewHash(state.jdlId);
      } else {
        handleJDLError(`${res.statusText}: ${json.detail}`, dispatch);
      }
    } catch (e) {
      handleJDLError(e, dispatch);
    }
  } else {
    console.log("Auth token not found");
  }
};

function handleAuthError(e, dispatch) {
  console.error("Cannot get authentication token", e);
  dispatch({
    type: ACTION_TYPES.SET_AUTH,
    data: {
      authenticated: false,
      username: "",
    },
  });
}

function handleJDLMetadataError(e, dispatch) {
  console.error("Error fetching JDL metadata", e);
  dispatch({
    type: ACTION_TYPES.SET_JDL_META,
    data: [],
  });
}

function handleJDLError(e, dispatch) {
  console.error("Error fetching JDL", e);
  dispatch(fetchAllJDLsMetadata());
  dispatch({
    type: ACTION_TYPES.SET_JDL,
    data: "",
  });
  setViewHash("");
}

function getViewHash() {
  const hash = location.hash; // eslint-disable-line no-restricted-globals
  if (!hash) {
    return "";
  }
  return hash.substring(8, hash.length);
}

function setViewHash(jdlId) {
  if (!jdlId) {
    location.hash = "/"; // eslint-disable-line no-restricted-globals
    return;
  }
  location.hash = "/view/" + jdlId; // eslint-disable-line no-restricted-globals
}

function isInJHOnline() {
  if (process.env.NODE_ENV === "production") {
    return !window.location.href.includes("www.jhipster.tech/jdl-studio");
  }
  return window.location.href.includes("localhost:8080/jdl-studio/");
}
