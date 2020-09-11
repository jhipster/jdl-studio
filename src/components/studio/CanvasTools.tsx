/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import LineIcon from "react-lineicons";

export const CanvasTools = ({ classToggler, panner }) => {
  const zoomIn = () => {
    panner.magnify(2);
  };

  const zoomOut = () => {
    panner.magnify(-2);
  };

  const reset = () => {
    panner.reset();
  };
  return (
    <div
      className="canvas-tools"
      id="canvas-tools"
      onMouseEnter={classToggler(true)}
      onMouseLeave={classToggler(false)}
    >
      <a onClick={zoomIn} title="Zoom in" className="link">
        <LineIcon name="zoom-in" />
      </a>
      <a onClick={reset} title="Reset viewport" className="link">
        <LineIcon name="frame-expand" />
      </a>
      <a onClick={zoomOut} title="Zoom out" className="link">
        <LineIcon name="zoom-out" />
      </a>
    </div>
  );
};
