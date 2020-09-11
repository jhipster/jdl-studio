import React from "react";
import { Provider } from "react-redux";
import { render } from "@testing-library/react";
import App from "./App";
import { store } from "./Store";

import * as jsdom from "jsdom";
const doc = new jsdom.JSDOM("<!doctype html><html><body></body></html>");
global.document = doc;
global.window = doc.defaultView;
//@ts-ignore
global.document.body.createTextRange = function () {
  return {
    setEnd: function () {},
    setStart: function () {},
    getBoundingClientRect: function () {
      return { right: 0 };
    },
    getClientRects: function () {
      return {
        length: 0,
        left: 0,
        right: 0,
      };
    },
  };
};

test("renders about page text", () => {
  const { getByText } = render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  const linkElement = getByText(/Hello, this is JDL-Studio/i);
  expect(linkElement).toBeInTheDocument();
});

test("renders default snapshot", () => {
  const comp = render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  expect(comp).toMatchSnapshot();
});
