import React, { useEffect, useRef, useState } from "react";

import GenericFileUploadContainer from "../../components/generic-file-upload/GenericFileUploadContainer";

const UploadTest = () => {
    return (
        <main>
            <div className="grid grid--justify-space-around">
                <div className="grid__col-10 margin-top--2">
                    <h1>Test upload page</h1>
                    <GenericFileUploadContainer />
                </div>
            </div>
        </main>
    );
};

export default UploadTest;
