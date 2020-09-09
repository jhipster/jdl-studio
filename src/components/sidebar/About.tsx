import React from "react";
import interactionTutorial from "../../resources/interaction-tutorial.png";

export const About = () => (
  <>
    <div className="content">
      <h3>About</h3>
      <p>
        Hello, this is JDL-Studio, a tool for drawing{" "}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="http://www.jhipster.tech/"
        >
          JHipster
        </a>{" "}
        JDL diagrams based on the{" "}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="http://www.jhipster.tech//jdl"
        >
          JDL syntax
        </a>
        .{" "}
      </p>
      <p>
        Try and edit the code on the left and watch the diagram change. Any
        changes are saved to the browser's <i>localStorage</i>, so your diagram
        should be here the next time, (but no guarantees). If you want
        persistent storage, sign in with your JHipster Online account to save
        the JDL.
      </p>
      <p>
        Created by{" "}
        <a target="_blank" rel="noopener noreferrer" href="https://deepu.tech">
          Deepu KS
        </a>{" "}
        and hosted on{" "}
        <a
          href="https://github.com/jhipster/jdl-studio"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>{" "}
        with <i className="lnr lnr-heart"></i>.
      </p>
      <p>
        JDL-Studio was made possible by the cool project{" "}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/skanaar/nomnoml"
        >
          nomnoml
        </a>{" "}
        by{" "}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/skanaar"
        >
          Daniel Kallin
        </a>{" "}
        .
      </p>
      <h2>Interaction</h2>
      <hr />
      <p>
        The canvas can be panned and zoomed by dragging and scrolling in the
        right hand third of the canvas.
      </p>
      <img
        className="invert"
        src={interactionTutorial}
        alt="interaction tutorial"
      />
      <p>
        Downloaded image files will be given the filename in the{" "}
        <kbd>#title</kbd> directive.
      </p>
      <p>
        The editor supports a subset of <i>Sublime Text's</i>{" "}
        <a
          href="https://codemirror.net/demo/sublime.html"
          target="_blank"
          rel="noopener noreferrer"
        >
          keymappings
        </a>
        . Hit <code>Ctrl-Space</code> for auto suggestions.
      </p>
      <h2>Examples</h2>
      <hr />
      <p>
        Refer{" "}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="http://www.jhipster.tech/jdl"
        >
          JDL
        </a>{" "}
        documentation for examples.
      </p>
      <h2>Usage</h2>
      <hr />
      <p>
        Refer{" "}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="http://www.jhipster.tech/jdl"
        >
          JDL
        </a>{" "}
        documentation for more details.
      </p>
      <label>Set font</label>
      #font: Times
      <label>Layout the diagram really tight</label>
      #fontSize: 8<br />
      #spacing: 12
      <br />
      #padding: 3
      <h2>Directives</h2>
      <hr />
      <p>
        The rendered image style can be customized by setting these directives
        along with the JDL code. There should not be any empty space before a
        directive.
      </p>
      #arrowSize: 1<br />
      #bendSize: 0.3
      <br />
      #direction: down | right
      <br />
      #gutter: 5<br />
      #edgeMargin: 0<br />
      #edges: hard | rounded
      <br />
      #background: transparent
      <br />
      #fill: #eee8d5; #fdf6e3
      <br />
      #fillArrows: false
      <br />
      #font: Calibri
      <br />
      #fontSize: 12
      <br />
      #leading: 1.25
      <br />
      #lineWidth: 3<br />
      #padding: 8<br />
      #spacing: 40
      <br />
      #stroke: #33322E
      <br />
      #title: filename
      <br />
      #zoom: 1<br />
      #acyclicer: greedy
      <br />
      #ranker: network-simplex | tight-tree | longest-path
      <br />
    </div>
  </>
);
