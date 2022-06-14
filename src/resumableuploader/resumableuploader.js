import React from "react";
import ReactDOM from "react-dom";
import UploadTest from "../app/views/upload-test/UploadTest"

console.warn("INFO: resumableuploader.js loaded");

window.startResumableUploader = (domID, data) => {
    const node = document.getElementById(domID);

    console.log("INFO: startrResumableUploader()")

    if (!node) {
        onError(`Element with ID ${domID} doesn't exist`);
        return;
    }

    ReactDOM.render(<UploadTest data={data} />, node);
};

window.closerResumableUploader = (domID) => {
    const node = document.getElementById(domID);

    console.log("INFO: closerResumableUploader()")

    if (!node) {
        onError(`Element with ID ${domID} doesn't exist`);
        return;
    }

    ReactDOM.unmountComponentAtNode(node);
};
