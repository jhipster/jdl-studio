export const goToJHipsterOnline = () => {
  window.location.href = "/";
};
export const goToManageJdls = () => {
  window.location.href = "/design-entities";
};

export const downloadImage = (evt) => {
  const canvasElement = document.getElementById("canvas") as HTMLCanvasElement;
  var url = canvasElement.toDataURL("image/png");
  evt.currentTarget.href = url;
  ga("send", "event", "JDL Image", "download", "JDL Image download");
  ga("jdlTracker.send", "event", "JDL Image", "download", "JDL Image download");
};

export const downloadFile = (evt, content) => {
  var textFileAsBlob = new Blob([content], { type: "text/plain" });
  var URL = window.URL || window.webkitURL;
  if (URL !== null) {
    evt.currentTarget.href = window.URL.createObjectURL(textFileAsBlob);
  }
  ga("send", "event", "JDL File", "download", "JDL File download");
  ga("jdlTracker.send", "event", "JDL File", "download", "JDL File download");
};

export const saveAs = (event) => {
  const { keyCode, metaKey, ctrlKey } = event;
  if (keyCode === 83 && (navigator.platform.match("Mac") ? metaKey : ctrlKey)) {
    event.preventDefault();
    document.getElementById("saveTextbutton")?.click();
    return false;
  }
};

export const setFilename = (filename) => {
  const fileBtn = document.getElementById(
    "saveTextbutton"
  ) as HTMLAnchorElement;
  if (fileBtn) {
    fileBtn.download = filename + ".jdl";
  }
  const imgBtn = document.getElementById("savebutton") as HTMLAnchorElement;
  if (imgBtn) {
    imgBtn.download = filename + ".png";
  }
};
