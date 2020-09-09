import React from "react";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import Studio from "./components/studio/Studio";
import "./App.scss";

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
