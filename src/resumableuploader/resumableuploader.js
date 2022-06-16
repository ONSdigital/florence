import React from "react";
import ReactDOM from "react-dom";
import ResumableUploader from "../app/views/upload-test/ResumableUploader"

console.warn("INFO: resumableuploader.js loaded");

window.startResumableUploader = (domID, data) => {
    const node = document.getElementById(domID);

    console.log("INFO: startResumableUploader()")

    if (!node) {
        console.error(`Element with ID ${domID} doesn't exist`);
        return;
    }

    ReactDOM.render(<ResumableUploader data={data} />, node);
};

window.closerResumableUploader = (domID) => {
    const node = document.getElementById(domID);

    console.log("INFO: closeResumableUploader()")

    if (!node) {
        console.error(`Element with ID ${domID} doesn't exist`);
        return;
    }

    ReactDOM.unmountComponentAtNode(node);
};
