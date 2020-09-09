import React from "react";
import { connect } from "react-redux";
import { IRootState } from "../../Store";
import { Reference } from "./Reference";
import { About } from "./About";

export interface ISidebarProp extends StateProps, DispatchProps {}

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

const mapDispatchToProps = {
  // changeJdl,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
