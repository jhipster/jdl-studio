import React from "react";
import { Header } from "./components/Header";
import { Studio } from "./components/Studio";
import { Sidebar } from "./components/Sidebar";
import "./App.css";

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
