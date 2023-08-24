import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import { store } from "./Store";
import App from "./App";
import "./index.scss";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root"),
);
