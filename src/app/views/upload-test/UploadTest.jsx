import React from "react";
import { useState } from "react";

import GenericFileUploadContainer from "../../components/generic-file-upload/GenericFileUploadContainer";
import http from "../../utilities/http";

const UploadTest = () => {
    const [fileMetadata, setFileMetadata] = useState(null);
    const onSuccess = fileUploadURL => {
        http.get(fileUploadURL).then(response => {
            setFileMetadata(response);
        });
    };

    return (
        <main>
            <div className="grid grid--justify-space-around">
                <div className="grid__col-10 margin-top--2">
                    <h1>Test upload page</h1>
                    <p>A simple page to test file uploads via the new static file system.</p>
                    <p>Once a file has been successfully uploaded, the metadata as saved within the system will be presented below.</p>
                    <div className="margin-top--2">
                        {fileMetadata && <FileMetadata data={fileMetadata} />}
                        {!fileMetadata && (
                            <GenericFileUploadContainer canSetPublishableStatus="true" filePathPrefix="test-uploads" onSuccess={onSuccess} />
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
};

const FileMetadata = ({ data = {} }) => {
    return (
        <>
            <p>File successfully uploaded. The following file metadata was saved to the system:</p>
            <ul className="margin-top--1">
                {Object.keys(data).map(key => (
                    <li key={key}>
                        <pre>
                            <strong>{key}:</strong> {`${data[key]}`}
                        </pre>
                    </li>
                ))}
            </ul>
        </>
    );
};

export default UploadTest;
