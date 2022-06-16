import React, { useEffect, useRef, useState } from "react";
import Checkbox from "../Checkbox";

import Resumable from "resumeablejs";

import GenericFileUploader from "./GenericFileUploader";

const FIVE_MEGABYTES = 5 * 1024 * 1024;

const GenericFileUploadContainer = ({
    filePathPrefix = "",
    initialiseCustomResumableConfiguration = null,
    customRetryClick = null,
    canSetPublishableStatus = false,
    url = "",
    collectionID = "",
    onSuccess = () => {},
    onError = () => {},
}) => {
    const [progress, setProgress] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isPublishable, setIsPublishable] = useState(true);
    const [error, setError] = useState("");

    const uploadErrors = {
        DuplicateFile: "A file with the same name has already been uploaded to this location",
    };

    useEffect(() => {
        customInitialiserFound() ? initialiseCustomResumableConfiguration() : initialiseDefaultResumableConfiguration();
    }, []);

    const initialiseDefaultResumableConfiguration = () => {
        document.querySelectorAll('input[type="file"]').forEach(input => {
            const r = new Resumable({
                target: "/upload-new",
                uploadMethod: "POST",
                chunkSize: FIVE_MEGABYTES,
                query: {},
                forceChunkSize: true,
                testChunks: false,
                simultaneousUploads: 1,
            });
            r.assignBrowse(input);
            r.assignDrop(input);
            r.on("fileAdded", file => {
                setIsUploading(true);
                if (collectionID) r.opts.query["collectionId"] = collectionID;
                r.opts.query["isPublishable"] = isPublishable;
                r.opts.query["licence"] = "Open Government Licence v3.0";
                r.opts.query["licenceUrl"] = "https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/";
                r.opts.query["path"] = `${filePathPrefix}`;
                r.upload();
            });
            r.on("fileProgress", file => {
                setProgress(Math.round(Number(file.progress() * 100)));
            });
            r.on("fileError", (_, error) => {
                setIsUploading(false);
                const { errors } = JSON.parse(error);
                if (uploadErrors[errors[0]?.code]) {
                    setError(uploadErrors[errors[0].code]);
                } else {
                    setError("An error occurred when trying to upload the files. Please try again.");
                }
            });
            r.on("fileSuccess", file => {
                const PATH_TO_FILE_IN_FILES_API = `/files/${encodeURIComponent(`${r.opts.query.path}/${file.relativePath}`)}`;
                onSuccess(PATH_TO_FILE_IN_FILES_API);
            });
        });
    };

    const customInitialiserFound = () => {
        return typeof initialiseCustomResumableConfiguration === "function";
    };

    const sendRetryHandler = () => {
        typeof customRetryClick === "function" ? customRetryClick : handleRetryClick;
    };

    const handleRetryClick = () => {
        location.reload();
    };

    return (
        <main>
            <div className="grid">
                <div className="grid__col-10">
                    <div className="grid__col-10">
                        {canSetPublishableStatus && (
                            <Checkbox
                                id="file-is-publishable"
                                onChange={() => setIsPublishable(!isPublishable)}
                                isChecked={isPublishable}
                                disable={isUploading}
                                label="File publishable?"
                            />
                        )}
                        <GenericFileUploader
                            label="Upload file"
                            type="file"
                            id="generic-upload"
                            key="generic-uploader"
                            error={error}
                            accept="*"
                            url={url}
                            onRetry={sendRetryHandler}
                            progress={progress >= 0 ? progress : null}
                        />
                    </div>
                </div>
            </div>
        </main>
    );
};

export default GenericFileUploadContainer;
