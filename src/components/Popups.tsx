import React, { useState } from "react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

export const WarningPopup = ({ open }) => (
  <Popup open={open} modal closeOnDocumentClick={true}>
    {(close) => (
      <div className="modal">
        <div className="header">Warning!</div>
        <div className="content">
          <p>
            You are using an experimental beta version of JDL Studio. Please use
            the stable version at{" "}
            <a href="https://start.jhipster.tech/jdl-studio/">
              https://start.jhipster.tech/jdl-studio/
            </a>{" "}
            for more features and persistent storage
          </p>
        </div>
        <div className="actions">
          <button className="button" onClick={close}>
            It's OK
          </button>
        </div>
      </div>
    )}
  </Popup>
);

export const ResetPopup = ({ open, closeModal, discard }) => {
  const ok = () => {
    closeModal();
    discard();
  };
  return (
    <Popup open={open} modal closeOnDocumentClick={false} onClose={closeModal}>
      <div className="modal">
        <div className="header">Discard</div>
        <div className="content">
          <p>
            Do you want to discard current diagram and load the sample? This
            will overwrite local storage as well
          </p>
        </div>
        <div className="actions">
          <button className="button" onClick={ok}>
            Yes
          </button>
          <button className="button" onClick={closeModal}>
            No
          </button>
        </div>
      </div>
    </Popup>
  );
};

export const UploadPopup = ({ open, closeModal, setCode }) => {
  const [file, setFiles] = useState(null);

  const setJDlFile = (evt) => {
    setFiles(evt.target.files[0]);
  };

  const importFile = () => {
    closeModal();
    importJDL(file, setCode);
  };

  return (
    <Popup open={open} modal closeOnDocumentClick={false} onClose={closeModal}>
      <div className="modal">
        <div className="header">Import JDL</div>
        <div className="content">
          <p>
            Select a <code>.jh</code> or <code>.jdl</code> file
          </p>
          <input
            className="upload"
            accept=".jh,.jdl"
            type="file"
            id="jdlFileInput"
            onChange={setJDlFile}
          />
        </div>
        <div className="actions">
          <button className="button" onClick={importFile}>
            Import
          </button>
          <button className="button" onClick={closeModal}>
            Dismiss
          </button>
        </div>
      </div>
    </Popup>
  );
};

function importJDL(f, setCurrentText) {
  if (!f) {
    alert("Failed to load file");
  } else if (
    !f.type.match("text.*") &&
    !(f.name.endsWith(".jh") || f.name.endsWith(".jdl"))
  ) {
    alert(f.name + " is not a valid JDL or text file.");
  } else {
    var r = new FileReader();
    r.onload = function (e) {
      if (e && e.target) {
        var contents = e.target.result as string;
        console.log(
          `Got the file name: ${f.name} type: ${f.type} size: ${f.size} bytes`
        );
        setCurrentText(contents);
      }
    };
    r.readAsText(f);
  }
  //@ts-ignore
  ga("send", "event", "JDL File", "upload", "JDL File upload");
  //@ts-ignore
  ga("jdlTracker.send", "event", "JDL File", "upload", "JDL File upload");
}
