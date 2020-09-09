import React from "react";
import { connect } from "react-redux";
import { IRootState } from "../../Store";
import { Reference } from "./Reference";
import { About } from "./About";

export interface ISidebarProp extends StateProps {}

export function Sidebar({
  sidebarId,
  sidebarVisible,
  isLightMode,
}: ISidebarProp) {
  return (
    <div
      id="sidebar"
      className={`sidebar ${sidebarVisible ? "visible" : ""} ${
        isLightMode ? "light-theme" : "dark-theme"
      }`}
    >
      {sidebarId === "reference" ? <Reference /> : <About />}
    </div>
  );
}

const mapStateToProps = ({ studio }: IRootState) => ({
  sidebarId: studio.sidebarId,
  sidebarVisible: studio.sidebarVisible,
  isLightMode: studio.isLightMode,
});

type StateProps = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps, null)(Sidebar);
