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
        </a>.
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
      <code>#font: Times</code>
      <label>Layout the diagram really tight</label>
      <code>#fontSize: 8</code><br />
      <code>#spacing: 12</code><br />
      <code>#padding: 3</code>
      <h2>Directives</h2>
      <hr />
      <p>
        The rendered image style can be customized by setting these directives
        along with the JDL code. There should not be any empty space before a
        directive.
      </p>
      <code>#arrowSize: 1</code><br />
      <code>#bendSize: 0.3</code><br />
      <code>#direction: down | right</code><br />
      <code>#gutter: 5</code><br />
      <code>#edgeMargin: 0</code><br />
      <code>#edges: hard | rounded</code><br />
      <code>#background: transparent</code><br />
      <code>#fill: #eee8d5; #fdf6e3</code><br />
      <code>#fillArrows: false</code><br />
      <code>#font: Calibri</code><br />
      <code>#fontSize: 12</code><br />
      <code>#leading: 1.25</code><br />
      <code>#lineWidth: 3</code><br />
      <code>#padding: 8</code><br />
      <code>#spacing: 40</code><br />
      <code>#stroke: #33322E</code><br />
      <code>#title: filename</code><br />
      <code>#zoom: 1</code><br />
      <code>#acyclicer: greedy</code><br />
      <code>#ranker: network-simplex | tight-tree | longest-path</code><br />
    </div>
  </>
);
