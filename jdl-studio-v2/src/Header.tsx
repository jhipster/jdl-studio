import React from "react";
import LineIcon from "react-lineicons";
import logo from "./logo-jhipster.png";

export function Header() {
  const toggleSidebar = (page: string) => () => {};
  return (
    <header>
      <div className="tools left">
        <a
          href="https://www.jhipster.tech/"
          title="JHipster website"
          target="_blank" rel="noopener noreferrer"
        >
          <img className="jhi-logo" src={logo} alt="JHipster logo"/>
        </a>
        <a
          className="logo"
          href="javascript:void(0)"
          onClick={toggleSidebar("about")}
          title="About JDL-Studio"
        >
          <h1>JDL-Studio</h1> &nbsp;
        </a>
      </div>
      <div className="tools">
        <a
          id="signin"
          href="javascript:void(0)"
          ng-show="app.insideJhOnline && !app.authenticated"
          ng-click="app.goToJHipsterOnline()"
          title="Sign in"
        >
          Please sign in for more features!
        </a>
        <a
          id="signin"
          href="https://start.jhipster.tech/jdl-studio/"
          ng-hide="app.insideJhOnline"
          title="Go to new JDL Studio with more features"
        >
          Go to new JDL Studio
        </a>
        <a
          href="javascript:void(0)"
          title="Logged in as"
          ng-show="app.authenticated"
        >
          {/* {{app.username}} */}
        </a>
        <a
          href="javascript:void(0)"
          title="Use existing JDL"
          ng-show="app.authenticated"
        >
          <select ng-model="app.jdlId" ng-change="app.changeJdl()">
            <option value="">&lt;Create new JDL Model&gt;</option>
            <option ng-repeat="option in app.jdls" ng-value="option.id">
              {/* {{option.name}} */}
            </option>
          </select>
        </a>
        <a
          href="javascript:void(0)"
          title="Save JDL"
          ng-click="app.confirmCreateNewJdl()"
          ng-show="app.authenticated && !app.startLoadingFlag"
        >
          <LineIcon name="file-add" />
        </a>
        <a ng-show="app.authenticated && app.startLoadingFlag">
          <LineIcon name="sync" />
        </a>
        <a
          href="javascript:void(0)"
          ng-click="app.goToManageJdls()"
          title="Manage JDLs"
          ng-show="app.authenticated"
        >
          <LineIcon name="cog" />
        </a>
        <a
          href="javascript:void(0)"
          ng-show="app.insideJhOnline"
          ng-click="app.goToJHipsterOnline()"
          title="Go to the main JHipster Online page"
        >
          <LineIcon name="home" />
        </a>
        <span className="seperator">
          <i className="lineIcon">|</i>
        </span>
        <a
          href="javascript:void(0)"
          ng-click="app.toggleSidebar('about')"
          title="About JDL-Studio"
        >
          <LineIcon name="question-circle" />
        </a>
        <a
          href="javascript:void(0)"
          ng-click="app.toggleSidebar('reference')"
          title="Language reference"
        >
          <LineIcon name="book" />
        </a>
        <a
          id="savebutton"
          href="javascript:void(0)"
          download="jdl.png"
          title="Download snapshot of this diagram"
        >
          <LineIcon name="camera" />
        </a>
        <a
          id="saveTextbutton"
          href="javascript:void(0)"
          download="jdl.jh"
          title="Download text file of this JDL"
        >
          <LineIcon name="download" />
        </a>
        <a
          id="uploadbutton"
          className="upload-dialog"
          href="#upload-dialog"
          title="Import text file of a JDL"
        >
          <LineIcon name="upload" />
        </a>
        <a
          href="javascript:void(0)"
          ng-click="app.confirmDiscardCurrentGraph()"
          title="Discard this diagram"
        >
          <LineIcon name="trash" />
        </a>
        <span id="tooltip"></span>
        <span id="storage-status" ng-show="app.showStorageStatus" ng-cloak>
          View mode, changes are not saved.
          <a
            href="javascript:void(0)"
            ng-click="app.saveViewModeToStorage()"
            title="Save this diagram to localStorage"
          >
            save
          </a>
          <a
            href="javascript:void(0)"
            ng-click="app.exitViewMode()"
            title="Discard this diagram"
          >
            close
          </a>
        </span>

        <div className="canvas-tools" id="canvas-tools">
          <a
            href="javascript:void(0)"
            ng-click="app.magnifyViewport(2)"
            title="Zoom in"
          >
            <i className="lnr lnr-plus-circle"></i>
          </a>
          <a
            href="javascript:void(0)"
            ng-click="app.resetViewport()"
            title="Reset zoom and panning"
          >
            <i className="lnr lnr-frame-contract"></i>
          </a>
          <a
            href="javascript:void(0)"
            ng-click="app.magnifyViewport(-2)"
            title="Zoom out"
          >
            <i className="lnr lnr-circle-minus"></i>
          </a>
        </div>
      </div>
    </header>
  );
}
