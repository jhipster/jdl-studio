import React from "react";
import { Provider } from "react-redux";
import { render } from "@testing-library/react";
import App from "./App";
import { store } from "./Store";

import { Window } from "happy-dom";

const window = new Window({
  url: "https://localhost:8080",
  width: 1024,
  height: 768,
});
global.window = window as any;
global.document = window.document as any;


test("renders about page text", () => {
  const { getByText } = render(
    <Provider store={store}>
      <App />
    </Provider>,
  );
  const linkElement = getByText(/Hello, this is JDL-Studio/i);
  expect(linkElement).toBeDefined();
});

test("renders default snapshot", () => {
  const comp = render(
    <Provider store={store}>
      <App />
    </Provider>,
  );
  expect(comp).toMatchSnapshot();
});
