import React from "react";

export function Sidebar() {
  return (
    <div
      ng-include="app.sidebar"
      id="sidebar"
      className="sidebar {{app.sidebarVisible}}"
    ></div>
  );
}
