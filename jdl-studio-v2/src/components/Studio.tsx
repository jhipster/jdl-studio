import React from "react";
import throttle from "lodash.throttle";
// nomnoml dependencies
import nomnoml from "nomnoml";
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
import "../codemirror/JDLHint";
import "../codemirror/CodemirrorJDLMode";
import "../codemirror/solarized.jdl.css";
import "../codemirror/show-hint-jdl.css";

import { CanvasPanner } from "./CanvasPanner";
import { jdlToNomnoml } from "./JDLToNomnoml";
// sample JDL
import { defaultSource } from "../resources/Samples";

const STORAGE_KEY = "jdlstudio.lastSource";
const DEF_ERROR = {
  lineMarkerTop: -35,
  hasError: false,
  errorTooltip: "",
};
// this cannot have any space before the directives
const NOMNOML_STYLE_DARK = `
#stroke: #aaaaaa
#fill: #21252b;#002b36;
#arrowSize: 0.5
#lineWidth: 2
#spacing: 70
#title: jhipster-jdl
`;

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

export interface StudioState {
  code: string;
  error: typeof DEF_ERROR;
}

export class Studio extends React.Component<{}, StudioState> {
  // codemirror configuration
  private cmOptions = {
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
  // this object stores the JDL code to local storage
  private storage = buildStorage(location.hash, defaultSource); // eslint-disable-line no-restricted-globals
  private panner;
  private canvasRef = React.createRef<HTMLCanvasElement>();
  private canvasPannerRef = React.createRef<HTMLDivElement>();

  public state = {
    code: this.storage.read(),
    error: DEF_ERROR,
  };

  setCode = (val: string) =>
    this.setState({
      code: val,
    });

  setError = (val: typeof DEF_ERROR) =>
    this.setState({
      error: val,
    });

  updateCode = (val = this.state.code) => {
    try {
      this.setError(DEF_ERROR);

      const canvas = this.canvasRef.current;
      const model = nomnoml.draw(
        canvas,
        NOMNOML_STYLE_DARK + jdlToNomnoml(val),
        this.panner.zoom()
      );

      this.panner.positionCanvas(canvas);
      this.setFilename(model.config.title);

      this.storage.save(val);
      this.setCode(val);
    } catch (e) {
      this.handleError(e);
    }
  };

  handleError = (e) => {
    var msg = "",
      top = 0;
    if (e.message) {
      const lineHeight = parseFloat(
        window
          .getComputedStyle(
            //@ts-ignore
            this.refs.editor.getCodeMirror().getWrapperElement()
          )
          .getPropertyValue("line-height")
      );
      top = 40 + lineHeight * this.findLine(e.message);
      msg = e.message;
    } else {
      msg = "An error occurred, look at the console";
      throw e;
    }
    this.setError({
      lineMarkerTop: top,
      hasError: true,
      errorTooltip: msg,
    });
  };

  findLine = (msg): number => {
    var regex = /at line: ([0-9]+),/g;
    var match = regex.exec(msg);
    return match && match[1] ? parseInt(match[1]) : 0;
  };

  setFilename = (filename) => {
    // fileLink.download = filename + ".jh";
    // imgLink.download = filename + ".png";
  };

  saveAs = (e) => {
    if (
      e.keyCode === 83 &&
      (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)
    ) {
      e.preventDefault();
      // fileLink.click();
      return false;
    }
  };

  classToggler = (element, className, state) => {
    // var jqElement = $(element);
    // return _.bind(jqElement.toggleClass, jqElement, className, state);
  };

  componentDidMount() {
    window.addEventListener("hashchange", this.reloadStorage);
    window.addEventListener(
      "resize",
      throttle(() => this.updateCode(), 750, { leading: true })
    );
    window.addEventListener("keydown", this.onKeydown);
    this.panner = new CanvasPanner(
      //@ts-ignore
      this.canvasPannerRef.current,
      () => this.updateCode(),
      throttle
    );
    this.updateCode();

    // canvasTools.addEventListener(
    //   "mouseenter",
    //   classToggler(jqBody, "canvas-mode", true)
    // );
    // canvasTools.addEventListener(
    //   "mouseleave",
    //   classToggler(jqBody, "canvas-mode", false)
    // );
  }

  componentWillUnmount() {
    window.removeEventListener("hashchange", this.reloadStorage);
    window.removeEventListener("keydown", this.onKeydown);
  }

  reloadStorage = () => {
    this.storage = buildStorage(location.hash); // eslint-disable-line no-restricted-globals
    this.updateCode(this.storage.read());
    // updateCode();
    // $scope.safeApply(function() {
    //     app.showStorageStatus = storage.isReadonly;
    //   }
    // );
  };

  onKeydown = (event) => {
    // const { key, keyCode } = event;
    // if (keyCode === 32 || (keyCode >= 65 && keyCode <= 90)) {
    //   // setUserText(prevUserText => `${prevUserText}${key}`);
    // }
  };

  render() {
    return (
      <>
        {/* <!-- code mirror editor--> */}
        <CodeMirror
          ref="editor"
          className="CodeMirrorEditor"
          value={this.state.code}
          onChange={this.updateCode}
          options={this.cmOptions}
        />
        {/* <!-- editor line number, error markers--> */}
        <div id="linenumbers" ng-className="{error: app.hasError}"></div>
        <div id="linemarker" ng-style="{'top': app.lineMarkerTop}"></div>
        {/* <!-- canvas holding the UML diagram--> */}
        <canvas id="canvas" ref={this.canvasRef}></canvas>
        <span id="error-tooltip" ng-cloak>
          {/* {{ app.errorTooltip }} */}
        </span>
        {/* <!-- canvas pan/zomm handler--> */}
        <div id="canvas-panner" ref={this.canvasPannerRef}></div>
        <div id="canvas-tools"></div>
      </>
    );
  }
}
