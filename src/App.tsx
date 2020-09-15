import React from "react";
import { Server } from "miragejs"

import mocksConfig from "./mocks";
import Sidebar from "./components/sidebar/Sidebar";
import Header from "./components/Header";
import Studio from "./components/studio/Studio";
import "./App.scss";

if (process.env.NODE_ENV !== 'production') {
  new Server(mocksConfig)
}

function App() {
  return (
    <div className="wrap app">
      <Header />
      {/* <!-- Code and image --> */}
      <Studio />
      {/* <!-- sidebar --> */}
      <Sidebar />
    </div>
  );
}

export default App;
