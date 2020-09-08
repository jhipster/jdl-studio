import React, { useState, useEffect, useRef } from "react";
// code mirror dependencies
import CodeMirror from "react-codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/keymap/sublime";
import "codemirror/addon/edit/matchbrackets";
import "codemirror/addon/edit/closebrackets";
import "codemirror/addon/dialog/dialog";
import "codemirror/addon/search/searchcursor";
import "codemirror/addon/hint/show-hint";
// customizations for JDL
import "../codemirror/JDL-hint";
import "../codemirror/Codemirror-jdl-mode";
import "../codemirror/solarized.jdl.css";
import "../codemirror/show-hint-jdl.css";

// nomnoml
import * as nomnoml from "../nomnoml/nomnoml";
import { defaultSource } from "../resources/Samples";

const STORAGE_KEY = "jdlstudio.lastSource";

function urlDecode(encoded) {
  return decodeURIComponent(encoded.replace(/\+/g, " "));
}

function buildStorage(locationHash, defaultSource = "") {
  if (locationHash.substring(0, 7) === "#/view/") {
    return {
      read: function (): string {
        return urlDecode(locationHash.substring(7));
      },
      save: function (source: string) {},
      moveToLocalStorage: function (txt: string) {
        localStorage[STORAGE_KEY] = txt;
      },
      isReadonly: true,
    };
  }
  return {
    read: function (): string {
      return localStorage[STORAGE_KEY] || defaultSource;
    },
    save: function (source: string) {
      localStorage[STORAGE_KEY] = source;
    },
    moveToLocalStorage: function (txt) {},
    isReadonly: false,
  };
}

export function Studio() {
  const cmOptions = {
    lineNumbers: true,
    mode: "jdl",
    matchBrackets: true,
    autoCloseBrackets: true,
    theme: "solarized dark",
    keyMap: "sublime",
    extraKeys: {
      "Ctrl-Space": "autocomplete",
    },
  };
  let storageContainer = useRef(buildStorage(location.hash, defaultSource)); // eslint-disable-line no-restricted-globals
  const [code, setCode] = useState(storageContainer.current.read());

  const updateCode = (code: string) => {
    storageContainer.current.save(code);
    setCode(code);
  };

  // useEffect(() => {
  //   async function fetchJDL() {
  //     const result = await fetch(`${process.env.PUBLIC_URL}/sample.jdl`);
  //     defaultSourceContainer.current = await result.text();
  //     storageContainer.current = buildStorage(
  //       location.hash, // eslint-disable-line no-restricted-globals
  //       defaultSourceContainer.current
  //     );
  //   }
  //   fetchJDL();
  //   updateCode(storageContainer.current.read());
  // }, []);

  return (
    <>
      {/* <!-- canvas holding the UML diagram--> */}
      <canvas id="canvas"></canvas>
      {/* <!-- code mirror editor--> */}
      <CodeMirror
        className="CodeMirrorEditor"
        value={code}
        onChange={updateCode}
        options={cmOptions}
      />
      {/* <!-- editor line number, error markers--> */}
      <div id="linenumbers" ng-className="{error: app.hasError}"></div>
      <div id="linemarker" ng-style="{'top': app.lineMarkerTop}"></div>
      <span id="error-tooltip" ng-cloak>
        {/* {{ app.errorTooltip }} */}
      </span>
      {/* <!-- canvas pan/zomm handler--> */}
      <div id="canvas-panner"></div>
    </>
  );
}
