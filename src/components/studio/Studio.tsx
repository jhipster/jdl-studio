import React from "react";
import { connect } from "react-redux";
import throttle from "lodash.throttle";

// nomnoml dependencies
import nomnoml from "nomnoml";
// code mirror dependencies
import { Controlled as CodeMirror } from "react-codemirror2";
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
import "../../codemirror/solarized.jdl.scss";
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
import { CanvasTools } from "./CanvasTools";
import { saveAs, setFilename } from "../Utils";

// this cannot have any space before the directives
const NOMNOML_STYLE_DARK = `
#stroke: #aaaaaa
#fill: #21252b;#002b36;
\n`;
const NOMNOML_STYLE = `
#arrowSize: 0.5
#lineWidth: 2
#spacing: 40
#title: jhipster-jdl
#zoom: 0.8
\n`;

export interface IStudioProp extends StateProps, DispatchProps {}

export class Studio extends React.PureComponent<IStudioProp> {
  // codemirror configuration
  private cmOptions = {
    lineNumbers: true,
    mode: "jdl",
    matchBrackets: true,
    autoCloseBrackets: true,
    keyMap: "sublime",
    extraKeys: {
      "Ctrl-Space": "autocomplete",
    },
  };
  private panner;
  private editorRef = React.createRef<any>();
  private canvasRef = React.createRef<HTMLCanvasElement>();
  private canvasPannerRef = React.createRef<HTMLDivElement>();

  componentDidMount() {
    window.addEventListener("hashchange", this.props.reloadStorage);
    window.addEventListener(
      "resize",
      throttle(() => this.renderJDL(), 750, { leading: true })
    );
    window.addEventListener("keydown", saveAs);
    if (this.canvasPannerRef.current) {
      this.panner = new CanvasPanner(
        this.canvasPannerRef.current,
        () => this.renderJDL(),
        throttle
      );
    }
    this.updateCode();
  }

  componentDidUpdate(prevProps: IStudioProp) {
    if (
      prevProps.isLightMode !== this.props.isLightMode ||
      prevProps.direction !== this.props.direction ||
      prevProps.ranker !== this.props.ranker
    ) {
      this.renderJDL();
    }
  }

  componentWillUnmount() {
    window.removeEventListener("hashchange", this.props.reloadStorage);
    window.removeEventListener("keydown", saveAs);
  }

  getDefaultDirectives = ({ isLightMode, ranker, direction }) => {
    let style = isLightMode
      ? NOMNOML_STYLE
      : NOMNOML_STYLE_DARK + NOMNOML_STYLE;
    style += `#ranker: ${ranker}\n#direction: ${direction}\n`;
    return style;
  };

  renderJDL = (val = this.props.code) => {
    try {
      const canvas = this.canvasRef.current;
      const nomlVal = val ? jdlToNoml(val) : "[No JDL content, start writing]";
      const finalVal = this.getDefaultDirectives(this.props) + nomlVal;
      const model = nomnoml.draw(canvas, finalVal, this.panner.zoom());
      setFilename(model.config.title);
      this.panner.positionCanvas(canvas);
    } catch (e) {
      console.log(e);
      this.handleError(e);
    }
  };

  updateCode = (val = this.props.code) => {
    this.props.setDefaultError();
    this.renderJDL(val);
    this.props.setCode(val);
  };

  handleError = (e) => {
    var msg = "",
      top = 0;
    if (e.message && this.editorRef.current) {
      const lineHeight = parseFloat(
        window
          .getComputedStyle(this.editorRef.current.editor.getWrapperElement())
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

  classToggler = (state) => () => {
    this.props.setCanvasMode(state);
  };

  getClassNames = (isLightMode, isCanvasMode) =>
    `${isLightMode ? "light-theme" : "dark-theme"} ${
      isCanvasMode ? "canvas-mode" : ""
    }`;

  editorBeforeChange = (editor, data, val) => this.props.setCode(val);
  editorOnChange = (editor, data, val) => this.updateCode(val);

  render() {
    const { isCanvasMode, code, error, isLightMode } = this.props;
    return (
      <div
        className={`studio ${this.getClassNames(isLightMode, isCanvasMode)}`}
      >
        {/* <!-- editor line number, error markers --> */}
        <div className={`line-numbers ${error.hasError ? "error" : ""}`}></div>
        <div className="line-marker" style={{ top: error.lineMarkerTop }}></div>
        {/* <!-- code mirror editor --> */}
        <CodeMirror
          ref={this.editorRef}
          className="code-mirror-editor"
          value={code}
          onBeforeChange={this.editorBeforeChange}
          onChange={this.editorOnChange}
          options={{
            ...this.cmOptions,
            theme: `solarized ${isLightMode ? "light" : "dark"}`,
          }}
        />
        {/* <!-- canvas holding the UML diagram --> */}
        <canvas id="canvas" ref={this.canvasRef}></canvas>
        {/* <!-- shows a tooltip on error --> */}
        <span className="error-tooltip">{error.errorTooltip}</span>
        {/* <!-- canvas tools and pan/zoom handler --> */}
        <CanvasTools panner={this.panner} classToggler={this.classToggler} />
        <div
          className="canvas-panner"
          ref={this.canvasPannerRef}
          onMouseEnter={this.classToggler(true)}
          onMouseLeave={this.classToggler(false)}
        ></div>
      </div>
    );
  }
}

const mapStateToProps = ({ studio }: IRootState) => ({
  code: studio.code,
  error: studio.error,
  isCanvasMode: studio.isCanvasMode,
  isLightMode: studio.isLightMode,
  ranker: studio.ranker,
  direction: studio.direction,
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
