import React, { useState } from "react";
import CodeMirror from "react-codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/keymap/sublime";
import "codemirror/addon/edit/matchbrackets";
import "codemirror/addon/edit/closebrackets";
import "codemirror/addon/dialog/dialog";
import "codemirror/addon/search/searchcursor";
import "codemirror/addon/hint/show-hint";
// customizations for JDL
import "./codemirror/jdl-hint";
import "./codemirror/codemirror.jdl-mode";
import "./codemirror/solarized.jdl.css";
import "./codemirror/show-hint-jdl.css";

export function Studio() {
  const options = {
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
  const [code, setCode] = useState("// test code");
  return (
    <>
      {/* <!-- canvas holding the UML diagram--> */}
      <canvas id="canvas"></canvas>
      {/* <!-- code mirror editor--> */}
      <CodeMirror
        className="CodeMirrorEditor"
        value={code}
        onChange={setCode}
        options={options}
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
