/* eslint-disable jsx-a11y/anchor-is-valid, no-restricted-globals */
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import LineIcon from "react-lineicons";
import logo from "../resources/logo-jhipster.svg";
import { IRootState } from "../Store";
import {
  initAuthentication,
  setJDL,
  loadJdl,
  updateJDL,
  setViewHash,
} from "./JhOnlineReducer";
import {
  setSidebar,
  setCode,
  toggleLightMode,
  toggleRanker,
  toggleDirection,
} from "./studio/StudioReducer";
import { UploadPopup, ResetPopup, WarningPopup, SavePopup } from "./Popups";
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
  initAuthentication,
  jhOnline,
  isLightMode,
  ranker,
  direction,
  setCode,
  setJDL,
  loadJdl,
  updateJDL,
  setSidebar,
  toggleLightMode,
  toggleRanker,
  toggleDirection,
}: IHeaderProp) {
  const [uploadPopup, setUploadPopup] = useState(false);
  const [savePopup, setSavePopup] = useState(false);
  const [templatePopup, setTemplatePopup] = useState(false);
  const [template, setTemplate] = useState("");

  useEffect(() => {
    if (!jhOnline.authenticated) {
      initAuthentication();
    }
  }, [jhOnline.authenticated, initAuthentication]);

  useEffect(() => {
    if (jhOnline.jdlId) {
      loadJdl();
    }
  }, [jhOnline.jdlId, loadJdl]);

  const toggleSidebar = (page: string) => () => {
    setSidebar(page);
  };

  const openUploadDialog = () => {
    setUploadPopup(true);
  };

  const closeUploadDialog = () => {
    setUploadPopup(false);
  };

  const openSaveDialog = () => {
    if (jhOnline.jdlId) {
      // save existing
      updateJDL(jhOnline.jdlId, true);
    } else {
      // create new
      setSavePopup(true);
    }
  };

  const closeSaveDialog = () => {
    setSavePopup(false);
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

  const handleChangeJDLModel = (event) => {
    setJDL(event.target.value);
    setViewHash(event.target.value);
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
        <div className="tools right">
          <div className="tools-inner">
            <a onClick={toggleLightMode} title="Toggle theme" className="link">
              {isLightMode ? (
                <LineIcon name="night" />
              ) : (
                <LineIcon name="sun" />
              )}
            </a>
            <a
              onClick={toggleRanker}
              title={`Cycle graph ranker strategy [current: ${ranker}]`}
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
          </div>
          <div className="tools-inner">
            {jhOnline.insideJhOnline && !jhOnline.authenticated ? (
              <a
                id="signin"
                className="link special"
                onClick={goToJHipsterOnline}
                title="Sign in"
              >
                Please sign in for more features!
              </a>
            ) : null}
            {!jhOnline.insideJhOnline && !jhOnline.authenticated ? (
              <a
                id="signin"
                className="special"
                href="https://start.jhipster.tech/jdl-studio/"
                title="Go to stable JDL Studio with more features"
              >
                Go to stable JDL Studio
              </a>
            ) : null}
            {jhOnline.authenticated ? (
              <>
                <a title="Logged in as" className="special">
                  {jhOnline.username}
                </a>

                <select
                  className="jdl-select"
                  value={jhOnline.jdlId}
                  onChange={handleChangeJDLModel}
                >
                  <option value="">&lt;Create new JDL Model&gt;</option>
                  {jhOnline.jdls.map((jdl) => (
                    <option key={jdl.id} value={jdl.id}>
                      {jdl.name}
                    </option>
                  ))}
                </select>
                {jhOnline.startLoadingFlag ? (
                  <a>
                    <LineIcon name="reload" />
                  </a>
                ) : (
                  <a title="Save JDL" className="link" onClick={openSaveDialog}>
                    <LineIcon name="save" />
                  </a>
                )}
                <a
                  onClick={goToManageJdls}
                  className="link"
                  title="Manage JDLs"
                >
                  <LineIcon name="cog" />
                </a>
              </>
            ) : null}
            {jhOnline.insideJhOnline ? (
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
        </div>
      </header>
      <UploadPopup
        open={uploadPopup}
        closeModal={closeUploadDialog}
        setCode={setCode}
        className={`${isLightMode ? "light-theme" : "dark-theme"}`}
      />
      <SavePopup
        open={savePopup}
        closeModal={closeSaveDialog}
        saveJDL={updateJDL}
        className={`${isLightMode ? "light-theme" : "dark-theme"}`}
      />
      <ResetPopup
        open={templatePopup}
        closeModal={closeTemplateDialog}
        discard={loadTemplate}
        className={`${isLightMode ? "light-theme" : "dark-theme"}`}
      />
      <WarningPopup
        open={!jhOnline.insideJhOnline && !jhOnline.authenticated}
        className={`${isLightMode ? "light-theme" : "dark-theme"}`}
      />
    </>
  );
}

const mapStateToProps = ({ studio, jhOnline }: IRootState) => ({
  code: studio.code,
  jhOnline: jhOnline,
  isLightMode: studio.isLightMode,
  ranker: studio.ranker,
  direction: studio.direction,
});

const mapDispatchToProps = {
  setJDL,
  loadJdl,
  updateJDL,
  setSidebar,
  setCode,
  toggleLightMode,
  toggleRanker,
  toggleDirection,
  initAuthentication,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

// using any due to a weird type error
export default connect(mapStateToProps, mapDispatchToProps)(Header as any);
