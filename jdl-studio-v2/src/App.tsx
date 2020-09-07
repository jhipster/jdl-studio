import React from "react";
import { Header } from "./Header";
import { Studio } from "./Studio";
import { Sidebar } from "./Sidebar";
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
