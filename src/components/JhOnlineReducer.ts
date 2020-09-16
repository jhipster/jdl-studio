import { Server } from "miragejs";
import { setCode } from "./studio/StudioReducer";
import mocksConfig from "../mocks";
import { IRootState } from "../Store";
import { getIdFromHash, urlDecode } from "./Utils";

export const ACTION_TYPES = {
  SET_JDL: "jhOnline/SET_JDL",
  SET_AUTH: "jhOnline/SET_AUTH",
  SET_JDL_META: "jhOnline/SET_JDL_META",
  SET_LOADING: "jhOnline/SET_LOADING",
  UPDATE_JDL: "jhOnline/UPDATE_JDL",
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
    case ACTION_TYPES.SET_LOADING:
      return {
        ...state,
        startLoadingFlag: action.data,
      };
    case ACTION_TYPES.SET_JDL:
      return {
        ...state,
        jdlId: action.data,
        startLoadingFlag: false,
      };
    case ACTION_TYPES.SET_JDL_META:
      return {
        ...state,
        jdls: action.data,
        startLoadingFlag: false,
      };
    default:
      return state;
  }
};

export const setLoading = (loading) => {
  return {
    type: ACTION_TYPES.SET_LOADING,
    data: loading,
  };
};

export const setJDL = (data) => {
  return {
    type: ACTION_TYPES.SET_JDL,
    data,
  };
};

export const setJDLsMetadata = (data) => {
  return {
    type: ACTION_TYPES.SET_JDL_META,
    data,
  };
};

export const setAuth = (authenticated, username) => {
  return {
    type: ACTION_TYPES.SET_AUTH,
    data: { authenticated, username },
  };
};

export const initAuthentication = () => async (dispatch) => {
  const httpHeader = getHeaders();
  if (httpHeader) {
    try {
      const res = await fetch(`${server_api}/api/account`, httpHeader);
      const json = await res.json();
      if (res.ok) {
        dispatch(setAuth(true, json.login));
        dispatch(fetchAllJDLsMetadata());

        const jdlId = getViewHash();
        if (jdlId !== "") {
          dispatch(setJDL(jdlId));
        }
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
  const httpHeader = getHeaders();
  if (httpHeader) {
    try {
      await dispatch(setLoading(false));
      const res = await fetch(`${server_api}/api/jdl-metadata`, httpHeader);
      const json = await res.json();
      if (res.ok) {
        dispatch(setJDLsMetadata(json));
      } else {
        handleJDLsMetadataError(`${res.statusText}: ${json.detail}`, dispatch);
      }
    } catch (e) {
      handleJDLsMetadataError(e, dispatch);
    }
  } else {
    console.log("Auth token not found");
  }
};

export const loadJdl = () => async (dispatch, getState) => {
  const { jdlId } = getState().jhOnline as JhOnlineState;
  if (!jdlId) {
    handleJDLError("JDL not set", dispatch);
    return;
  }
  const httpHeader = getHeaders();
  if (httpHeader) {
    try {
      await dispatch(setLoading(false));
      const res = await fetch(`${server_api}/api/jdl/${jdlId}`, httpHeader);
      const json = await res.json();
      if (res.ok) {
        if (json.content) {
          await dispatch(setCode(json.content));
          setViewHash(jdlId);
          dispatch(setLoading(false));
        }
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

export const updateJDL = (name, update = false) => async (
  dispatch,
  getState
) => {
  const state = getState() as IRootState;
  const { code } = state.studio;
  // update or create
  const httpHeader = getHeaders();
  if (httpHeader) {
    try {
      await dispatch(setLoading(false));
      if (update) {
        const { jdlId, jdls } = state.jhOnline;
        const filteredJdls = jdls.filter((it) => jdlId === it.id);
        if (filteredJdls && filteredJdls[0]) {
          const jdlName = filteredJdls[0].name;
          const res = await fetch(`${server_api}/api/jdl/${jdlId}`, {
            ...httpHeader,
            method: "PUT",
            body: JSON.stringify({
              name: jdlName,
              content: code,
            }),
          });
          if (res.ok) {
            setViewHash(jdlId);
            dispatch(setLoading(false));
          } else {
            handleUpdateError("Error from PUT request", dispatch);
          }
        }
      } else {
        const res = await fetch(`${server_api}/api/jdl`, {
          ...httpHeader,
          method: "POST",
          body: JSON.stringify({
            name: name,
            content: code,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          setViewHash(data.id);
          dispatch(setLoading(false));
          dispatch(fetchAllJDLsMetadata());
        } else {
          handleUpdateError("Error from POST request", dispatch);
        }
      }
    } catch (e) {
      handleUpdateError(e, dispatch);
    }
  } else {
    console.log("Auth token not found");
  }
};

export const setViewHash = (jdlId) => {
  if (!jdlId) {
    location.hash = "/"; // eslint-disable-line no-restricted-globals
    return;
  }
  location.hash = "/view/" + jdlId; // eslint-disable-line no-restricted-globals
};

function getViewHash() {
  const hash = location.hash; // eslint-disable-line no-restricted-globals
  if (!hash) {
    return "";
  }
  if (hash.includes("#/view/") || hash.includes("#!/view/")) {
    return urlDecode(getIdFromHash(hash));
  }
  return "";
}

function getHeaders() {
  const authToken = JSON.parse(
    localStorage.getItem("jhi-authenticationtoken") ||
      sessionStorage.getItem("jhi-authenticationtoken") ||
      "null"
  );
  if (authToken || process.env.NODE_ENV === "development") {
    return {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    };
  }
  return null;
}

function handleAuthError(e, dispatch) {
  console.error("Cannot get authentication token:", e);
  dispatch(setAuth(false, ""));
}

function handleJDLsMetadataError(e, dispatch) {
  console.error("Error fetching JDL metadata:", e);
  dispatch(setJDLsMetadata([]));
}

function handleJDLError(e, dispatch) {
  console.error("Error fetching JDL:", e);
  dispatch(setLoading(false));
}

function handleUpdateError(e, dispatch) {
  console.error("Error updating JDL:", e);
  dispatch(setLoading(false));
}

function isInJHOnline() {
  if (process.env.NODE_ENV === "production") {
    return !window.location.href.includes("www.jhipster.tech/jdl-studio");
  }
  return window.location.href.includes("localhost:8080/jdl-studio/");
}
