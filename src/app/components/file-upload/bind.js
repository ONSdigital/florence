import http from "../../utilities/http";

import Resumable from "resumeablejs";

const FIVE_MEGABYTES = 5 * 1024 * 1024

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
        beginUploadAndUpdateComponentState(r, file, updateState);
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
        r.opts.query = resumableOptions
        const aliasName = file.container.name;
        r.opts.query.aliasName = aliasName;
        
        const fileUpload = {
            aliasName: aliasName,
            progress: 0,
            error: null,
            filename: file.fileName,
        };
        r.upload();
        updateState(fileUpload)
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

function beginUploadAndUpdateComponentState(resumable, file, updateState) {
    const aliasName = file.container.name;
    resumable.opts.query.aliasName = aliasName;
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
