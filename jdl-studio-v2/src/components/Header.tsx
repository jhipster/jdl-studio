import React from "react";
import LineIcon from "react-lineicons";
import logo from "../resources/logo-jhipster.png";

export function Header() {
  const toggleSidebar = (page: string) => () => {};
  return (
    <header>
      <div className="tools left">
        <a
          href="https://www.jhipster.tech/"
          title="JHipster website"
          target="_blank"
          rel="noopener noreferrer"
          className="logo-img"
        >
          <img className="jhi-logo" src={logo} alt="JHipster logo" />
        </a>
        <a
          className="logo link"
          onClick={toggleSidebar("about")}
          title="About JDL-Studio"
        >
          JDL-Studio
        </a>
      </div>
      <span className="storage-status" ng-show="isStorageReadOnly">
        View mode, changes are not saved.
        <a
          ng-click="app.saveViewModeToStorage()"
          title="Save this diagram to localStorage"
          className="link"
        >
          save
        </a>
        <a
          ng-click="app.exitViewMode()"
          title="Discard this diagram"
          className="link"
        >
          close
        </a>
      </span>
      <div className="tools right">
        <a
          id="signin"
          ng-show="app.insideJhOnline && !app.authenticated"
          className="link"
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
        <a title="Logged in as" ng-show="app.authenticated" className="link">
          {/* {{app.username}} */}
        </a>
        <a
          title="Use existing JDL"
          ng-show="app.authenticated"
          className="link"
        >
          <select
            className="jdl-select"
            ng-model="app.jdlId"
            ng-change="app.changeJdl()"
          >
            <option value="">&lt;Create new JDL Model&gt;</option>
            <option ng-repeat="option in app.jdls" ng-value="option.id">
              {/* {{option.name}} */}
            </option>
          </select>
        </a>
        <a
          title="Save JDL"
          className="link"
          ng-click="app.confirmCreateNewJdl()"
          ng-show="app.authenticated && !app.startLoadingFlag"
        >
          <LineIcon name="file-add" />
        </a>
        <a ng-show="app.authenticated && app.startLoadingFlag">
          <LineIcon name="sync" />
        </a>
        <a
          ng-click="app.goToManageJdls()"
          className="link"
          title="Manage JDLs"
          ng-show="app.authenticated"
        >
          <LineIcon name="cog" />
        </a>
        <a
          ng-show="app.insideJhOnline"
          className="link"
          ng-click="app.goToJHipsterOnline()"
          title="Go to the main JHipster Online page"
        >
          <LineIcon name="home" />
        </a>
        <span className="seperator">
          <i className="lineIcon">|</i>
        </span>
        <a
          ng-click="app.toggleSidebar('about')"
          title="About JDL-Studio"
          className="link"
        >
          <LineIcon name="question-circle" />
        </a>
        <a
          ng-click="app.toggleSidebar('reference')"
          title="Language reference"
          className="link"
        >
          <LineIcon name="book" />
        </a>
        <a
          id="savebutton"
          download="jdl.png"
          className="link"
          title="Download snapshot of this diagram"
        >
          <LineIcon name="camera" />
        </a>
        <a
          id="saveTextbutton"
          download="jdl.jh"
          title="Download this JDL source"
          className="link"
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
          ng-click="app.confirmDiscardCurrentGraph()"
          title="Discard this diagram"
          className="link"
        >
          <LineIcon name="trash" />
        </a>
        <span id="tooltip"></span>
      </div>
    </header>
  );
}
