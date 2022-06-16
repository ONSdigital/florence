import React from "react";
import { useState } from "react";

import GenericFileUploadContainer from "../../components/generic-file-upload/GenericFileUploadContainer";
import http from "../../utilities/http";

console.log("INFO: ResumableUploader.jsx triggered");

// TODO: Accept props: period, label, data

const ResumableUploader = () => {
    console.log("INFO: ResumableUploader() triggered");

    const onSuccess = fileUploadURL => {
        http.get(fileUploadURL).then(response => {
            setFileMetadata(response);
        });
    };

    return (
        <main>
            <div className="grid grid--justify-space-around">
                <div className="grid__col-10 margin-top--2">
                    <div className="margin-top--2">
                        <GenericFileUploadContainer canSetPublishableStatus="true" filePathPrefix="test-uploads" onSuccess={onSuccess} />
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ResumableUploader;
