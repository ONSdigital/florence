import http from "../../utilities/http";

import Resumable from "resumeablejs";

export function bindFileUploadInput(inputID, uploadState, updateState, onSuccess, onError) {
    const input = document.getElementById(inputID);
    const r = new Resumable({
        target: "/upload",
        chunkSize: 5 * 1024 * 1024,
        query: {
            aliasName: ""
        },
        forceChunkSize: true,
        simultaneousUploads: 1
    });
    r.assignBrowse(input);
    r.assignDrop(input);
    r.on("fileAdded", file => {
        const aliasName = file.container.name;
        r.opts.query.aliasName = aliasName;
        r.upload();
        const fileUpload = {
            aliasName: aliasName,
            progress: 0,
            error: null,
            filename: file.fileName
        };
        const upload = {
            ...uploadState,
            ...fileUpload
        };
        updateState({ upload });
    });
    r.on("fileProgress", file => {
        const progressPercentage = Math.round(Number(file.progress() * 100));
        const fileUpload = {
            progress: progressPercentage,
            filename: file.fileName
        };
        const upload = {
            ...uploadState,
            ...fileUpload
        };
        updateState({ upload });
    });
    r.on("fileError", file => {
        const fileUpload = {
            error: "An error occurred whilst uploading this file.",
            filename: file.fileName
        };
        const upload = {
            ...uploadState,
            ...fileUpload
        };

        console.error("Error uploading file to server");
        updateState({ upload });
        onError();
    });
    r.on("fileSuccess", file => {
        const aliasName = file.resumableObj.opts.query.aliasName;
        http.get(`/upload/${file.uniqueIdentifier}`)
            .then(response => {
                const fileUpload = {
                    aliasName: aliasName,
                    progress: 0,
                    url: response.url,
                    filename: file.fileName
                };
                const upload = {
                    ...uploadState,
                    ...fileUpload
                };

                updateState({ upload });

                onSuccess(response.url);
            })
            .catch(error => {
                const fileUpload = {
                    error: "An error occurred whilst uploading this file",
                    filename: file.fileName
                };

                const upload = {
                    ...uploadState,
                    ...fileUpload
                };

                console.error("Error fetching uploaded file's URL: ", error);
                updateState({ upload });
            });
    });
}
