/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { connect } from "react-redux";
import LineIcon from "react-lineicons";
import logo from "../resources/logo-jhipster.png";
import { IRootState } from "../Store";
import { changeJdl } from "./JhOnlineReducer";
import {
  setSidebar,
  setCode,
  toggleLightMode,
  toggleRanker,
  toggleDirection,
} from "./studio/StudioReducer";
import { UploadPopup, ResetPopup, WarningPopup } from "./Popups";
import {
  downloadFile,
  goToJHipsterOnline,
  goToManageJdls,
  downloadImage,
} from "./Utils";
import { JDLtemplates } from "../resources/Samples";

export interface IHeaderProp extends StateProps, DispatchProps {}

export function Header({
  code,
  isStorageReadOnly,
  jhonline,
  changeJdl,
  setSidebar,
  setCode,
  toggleLightMode,
  isLightMode,
  toggleRanker,
  ranker,
  toggleDirection,
  direction,
}: IHeaderProp) {
  const [uploadPopup, setUploadPopup] = useState(false);
  const [templatePopup, setTemplatePopup] = useState(false);
  const [template, setTemplate] = useState("");

  const toggleSidebar = (page: string) => () => {
    setSidebar(page);
  };

  const confirmCreateNewJdl = () => {};

  const openUploadDialog = () => {
    setUploadPopup(true);
  };

  const closeUploadDialog = () => {
    setUploadPopup(false);
  };

  const openTemplateDialog = (evt) => {
    setTemplate(evt.target.value);
    if (evt.target.value) {
      setTemplatePopup(true);
    }
  };

  const closeTemplateDialog = () => {
    setTemplatePopup(false);
  };

  const loadTemplate = () => {
    if (template) {
      const code = JDLtemplates.filter((it) => it.key === template)[0].val;
      setCode(code);
    }
  };

  const downloadJDL = (evt) => {
    downloadFile(evt, code);
  };

  return (
    <>
      <header className={`${isLightMode ? "light-theme" : "dark-theme"}`}>
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
        {isStorageReadOnly ? (
          <span className="storage-status" ng-show="isStorageReadOnly">
            View mode, changes are not saved.
            <a
              // onClick="app.saveViewModeToStorage()"
              title="Save this diagram to localStorage"
              className="link"
            >
              save
            </a>
            <a
              // onClick="app.exitViewMode()"
              title="Discard this diagram"
              className="link"
            >
              close
            </a>
          </span>
        ) : null}
        <div className="tools center">
          <a onClick={toggleLightMode} title="Toggle theme" className="link">
            {isLightMode ? <LineIcon name="night" /> : <LineIcon name="sun" />}
          </a>
          <span className="seperator">
            <i>|</i>
          </span>
          <select className="template-select" onChange={openTemplateDialog}>
            <option value="">&lt;Select template&gt;</option>
            {JDLtemplates.map((it) => (
              <option value={it.key} key={it.key}>
                {it.key}
              </option>
            ))}
          </select>
          <a
            onClick={toggleRanker}
            title={`Cycle graph ranker strategies [current: ${ranker}]`}
            className="link"
          >
            {ranker === "longest-path" ? (
              <LineIcon name="bricks" />
            ) : (
              <LineIcon name="grid-alt" />
            )}
          </a>
          <a
            onClick={toggleDirection}
            title={`Cycle graph direction [current: ${direction}]`}
            className="link"
          >
            {direction === "down" ? (
              <LineIcon name="arrow-right" />
            ) : (
              <LineIcon name="arrow-down" />
            )}
          </a>
        </div>
        <div className="tools right">
          {jhonline.insideJhOnline && !jhonline.authenticated ? (
            <a
              id="signin"
              className="link special"
              onClick={goToJHipsterOnline}
              title="Sign in"
            >
              Please sign in for more features!
            </a>
          ) : null}
          {!jhonline.insideJhOnline ? (
            <a
              id="signin"
              className="special"
              href="https://start.jhipster.tech/jdl-studio/"
              title="Go to new JDL Studio with more features"
            >
              Go to new JDL Studio
            </a>
          ) : null}
          {jhonline.authenticated ? (
            <>
              <a title="Logged in as" className="special">
                {jhonline.username}
              </a>

              <select
                className="jdl-select"
                value={jhonline.jdlId}
                onChange={changeJdl}
              >
                <option value="">&lt;Create new JDL Model&gt;</option>
                {jhonline.jdls.map((jdl) => (
                  <option value={jdl.id}>{jdl.name}</option>
                ))}
              </select>
              {jhonline.startLoadingFlag ? (
                <a>
                  <LineIcon name="sync" />
                </a>
              ) : (
                <a
                  title="Save JDL"
                  className="link"
                  onClick={confirmCreateNewJdl}
                >
                  <LineIcon name="file-add" />
                </a>
              )}
              <a onClick={goToManageJdls} className="link" title="Manage JDLs">
                <LineIcon name="cog" />
              </a>
            </>
          ) : null}
          {jhonline.insideJhOnline ? (
            <a
              className="link"
              onClick={goToJHipsterOnline}
              title="Go to the main JHipster Online page"
            >
              <LineIcon name="home" />
            </a>
          ) : null}

          <span className="seperator">
            <i>|</i>
          </span>
          <a
            id="savebutton"
            download="app-jdl.png"
            className="link"
            title="Download snapshot of this diagram"
            onClick={downloadImage}
          >
            <LineIcon name="camera" />
          </a>
          <a
            id="saveTextbutton"
            download="app.jdl"
            title="Download this JDL source"
            className="link"
            onClick={downloadJDL}
          >
            <LineIcon name="download" />
          </a>
          <a
            id="uploadbutton"
            className="upload-dialog link"
            title="Import text file of a JDL"
            onClick={openUploadDialog}
          >
            <LineIcon name="upload" />
          </a>
          <a
            onClick={toggleSidebar("about")}
            title="About JDL-Studio"
            className="link"
          >
            <LineIcon name="question-circle" />
          </a>
          <a
            onClick={toggleSidebar("reference")}
            title="Language reference"
            className="link"
          >
            <LineIcon name="book" />
          </a>
          <span className="tooltip"></span>
        </div>
      </header>
      <UploadPopup
        open={uploadPopup}
        closeModal={closeUploadDialog}
        setCode={setCode}
        className={`${isLightMode ? "light-theme" : "dark-theme"}`}
      />
      <ResetPopup
        open={templatePopup}
        closeModal={closeTemplateDialog}
        discard={loadTemplate}
        className={`${isLightMode ? "light-theme" : "dark-theme"}`}
      />
      <WarningPopup
        open={!jhonline.insideJhOnline}
        className={`${isLightMode ? "light-theme" : "dark-theme"}`}
      />
    </>
  );
}

const mapStateToProps = ({ studio, jhonline }: IRootState) => ({
  code: studio.code,
  isStorageReadOnly: studio.isStorageReadOnly,
  jhonline: jhonline,
  isLightMode: studio.isLightMode,
  ranker: studio.ranker,
  direction: studio.direction,
});

const mapDispatchToProps = {
  changeJdl,
  setSidebar,
  setCode,
  toggleLightMode,
  toggleRanker,
  toggleDirection,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Header);
