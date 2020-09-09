import React from "react";
import { connect } from "react-redux";
import { IRootState } from "../../Store";
import { Reference } from "./Reference";
import { About } from "./About";

export interface ISidebarProp extends StateProps {}

export function Sidebar({ sidebarId, sidebarVisible }: ISidebarProp) {
  return (
    <div id="sidebar" className={`sidebar ${sidebarVisible ? "visible" : ""}`}>
      {sidebarId === "reference" ? <Reference /> : <About />}
    </div>
  );
}

const mapStateToProps = ({ studio }: IRootState) => ({
  sidebarId: studio.sidebarId,
  sidebarVisible: studio.sidebarVisible,
});

type StateProps = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps, null)(Sidebar);
