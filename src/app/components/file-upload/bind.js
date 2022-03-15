import http from "../../utilities/http";

import Resumable from "resumeablejs";

const FIVE_MEGABYTES = 5 * 1024 * 1024;

export function bindFileUploadInput(inputID, updateState, onSuccess, onError) {
    const input = document.getElementById(inputID);
    const r = new Resumable({
        target: "/upload",
        chunkSize: FIVE_MEGABYTES,
        query: {
            aliasName: "",
        },
        forceChunkSize: true,
        simultaneousUploads: 1,
    });
    r.assignBrowse(input);
    r.assignDrop(input);
    r.on("fileAdded", file => {
        const options = { aliasName: file.container.name };
        beginUploadAndUpdateComponentState(r, options, file, updateState);
    });
    r.on("fileProgress", file => {
        updateComponentState(file, updateState);
    });
    r.on("fileError", file => {
        handleErrorAndUpdateComponentState(file, updateState, onError);
    });
    r.on("fileSuccess", file => {
        handleSuccessGetFileUploadedFileInfoAndUpdateComponentState(file, updateState, onSuccess);
    });
}

// Used for the new static files system, currently feature flagged
export function bindGenericFileUploadInput(inputID, resumableOptions, updateState, onSuccess, onError) {
    const input = document.getElementById(inputID);
    const r = new Resumable({
        target: "/upload-new",
        chunkSize: FIVE_MEGABYTES,
        query: {
            aliasName: "",
        },
        forceChunkSize: true,
        simultaneousUploads: 1,
    });
    r.assignBrowse(input);
    r.assignDrop(input);
    r.on("fileAdded", file => {
        const options = {
            ...resumableOptions,
            aliasName: file.container.name,
        };
        beginUploadAndUpdateComponentState(r, options, file, updateState);
    });
    r.on("fileProgress", file => {
        updateComponentState(file, updateState);
    });
    r.on("fileError", file => {
        handleErrorAndUpdateComponentState(file, updateState, onError);
    });
    r.on("fileSuccess", file => {
        onSuccess(`${r.opts.query.path}/${file.relativePath}`);
    });
}

function beginUploadAndUpdateComponentState(resumable, resumableOptions, file, updateState) {
    const aliasName = file.container.name;
    resumable.opts.query = resumableOptions;
    resumable.upload();
    const fileUpload = {
        aliasName: aliasName,
        progress: 0,
        error: null,
        filename: file.fileName,
    };

    updateState(fileUpload);
}

function updateComponentState(file, updateState) {
    const progressPercentage = Math.round(Number(file.progress() * 100));
    const fileUpload = {
        progress: progressPercentage,
        filename: file.fileName,
    };
    updateState(fileUpload);
}

function handleErrorAndUpdateComponentState(file, updateState, onError) {
    const fileUpload = {
        error: "An error occurred whilst uploading this file.",
        filename: file.fileName,
    };

    console.error("Error uploading file to server");
    updateState(fileUpload);
    onError();
}

function handleSuccessGetFileUploadedFileInfoAndUpdateComponentState(file, updateState, onSuccess) {
    const aliasName = file.resumableObj.opts.query.aliasName;
    http.get(`/upload/${file.uniqueIdentifier}`)
        .then(response => {
            const fileUpload = {
                aliasName: aliasName,
                progress: 0,
                url: response.url,
                filename: file.fileName,
            };

            updateState(fileUpload);

            onSuccess(response.url);
        })
        .catch(error => {
            const fileUpload = {
                error: "An error occurred whilst uploading this file",
                filename: file.fileName,
            };

            console.error("Error fetching uploaded file's URL: ", error);
            updateState(fileUpload);
        });
}
