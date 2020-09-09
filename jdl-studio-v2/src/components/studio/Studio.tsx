import React from "react";
import { connect } from "react-redux";
import throttle from "lodash.throttle";
import LineIcon from "react-lineicons";

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
import "../../codemirror/JDLHint";
import "../../codemirror/CodemirrorJDLMode";
import "../../codemirror/solarized.jdl.css";
import "../../codemirror/show-hint-jdl.css";

import { CanvasPanner } from "./CanvasPanner";
import { jdlToNoml } from "./JDLToNoml";
import { IRootState } from "../../Store";
import {
  setCode,
  setError,
  setDefaultError,
  reloadStorage,
  setCanvasMode,
} from "./StudioReducer";

// this cannot have any space before the directives
const NOMNOML_STYLE_DARK = `
#stroke: #aaaaaa
#fill: #21252b;#002b36;
#arrowSize: 0.5
#lineWidth: 2
#spacing: 70
#title: jhipster-jdl
`;

export interface IStudioProp extends StateProps, DispatchProps {}

export class Studio extends React.PureComponent<IStudioProp> {
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
  private panner;
  private canvasRef = React.createRef<HTMLCanvasElement>();
  private canvasPannerRef = React.createRef<HTMLDivElement>();

  componentDidMount() {
    window.addEventListener("hashchange", this.props.reloadStorage);
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
  }

  componentWillUnmount() {
    window.removeEventListener("hashchange", this.props.reloadStorage);
    window.removeEventListener("keydown", this.onKeydown);
  }

  updateCode = (val = this.props.code) => {
    try {
      this.props.setDefaultError();

      const canvas = this.canvasRef.current;
      const model = nomnoml.draw(
        canvas,
        NOMNOML_STYLE_DARK + jdlToNoml(val),
        this.panner.zoom()
      );

      this.panner.positionCanvas(canvas);
      this.setFilename(model.config.title);
      this.props.setCode(val);
    } catch (e) {
      console.log(e);
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
    }
    this.props.setError({
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

  classToggler = (state) => () => {
    this.props.setCanvasMode(state);
  };

  onKeydown = (event) => {
    const { key, keyCode, metaKey, ctrlKey } = event;
    if (
      keyCode === 83 &&
      (navigator.platform.match("Mac") ? metaKey : ctrlKey)
    ) {
      event.preventDefault();
      // fileLink.click();
      return false;
    }
  };

  zoomIn = () => {
    this.panner.magnify(2);
  };

  zoomOut = () => {
    this.panner.magnify(-2);
  };

  reset = () => {
    this.panner.reset();
  };

  render() {
    const { isCanvasMode, code, error } = this.props;
    return (
      <>
        {/* <!-- code mirror editor--> */}
        <CodeMirror
          ref="editor"
          className={`CodeMirrorEditor ${isCanvasMode ? "canvas-mode" : ""}`}
          value={code}
          onChange={this.updateCode}
          options={this.cmOptions}
        />
        {/* <!-- editor line number, error markers--> */}
        <div
          id="linenumbers"
          className={`${error.hasError ? "error" : ""}`}
        ></div>
        <div id="linemarker" style={{ top: error.lineMarkerTop }}></div>
        {/* <!-- canvas holding the UML diagram--> */}
        <canvas id="canvas" ref={this.canvasRef}></canvas>
        <span id="error-tooltip" ng-cloak>
          {error.errorTooltip}
        </span>
        {/* <!-- canvas pan/zomm handler and tools--> */}
        <div
          className={`canvas-tools ${isCanvasMode ? "canvas-mode" : ""}`}
          id="canvas-tools"
          onMouseEnter={this.classToggler(true)}
          onMouseLeave={this.classToggler(false)}
        >
          <a onClick={this.zoomIn} title="Zoom in">
            <LineIcon name="zoom-in" />
          </a>
          <a onClick={this.reset} title="Reset viewport">
            <LineIcon name="frame-expand" />
          </a>
          <a onClick={this.zoomOut} title="Zoom out">
            <LineIcon name="zoom-out" />
          </a>
        </div>
        <div
          id="canvas-panner"
          ref={this.canvasPannerRef}
          onMouseEnter={this.classToggler(true)}
          onMouseLeave={this.classToggler(false)}
        ></div>
      </>
    );
  }
}

const mapStateToProps = ({ studio }: IRootState) => ({
  code: studio.code,
  error: studio.error,
  isCanvasMode: studio.isCanvasMode,
});

const mapDispatchToProps = {
  setCode,
  setError,
  setDefaultError,
  reloadStorage,
  setCanvasMode,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Studio);
