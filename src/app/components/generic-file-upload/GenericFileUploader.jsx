import React from "react";
import Input from "../Input";
import Checkbox from "../Checkbox";

const GenericFileUploader = ({
    url,
    error = null,
    acceptedFileTypes = "*",
    label = "generic file uploader",
    id = "generic-file-uploader",
    progress = null,
    onRetry = () => {},
}) => {
    const renderInput = () => {
        return (
            <div>
                {typeof progress === "number" ? (
                    <div className="margin-bottom--1">
                        <p>Progress: {(progress > 0 ? progress : 1) + "%"}</p>
                        <div className="progress">
                            <div
                                className={"progress__bar" + (error ? " progress__bar--error" : "")}
                                style={{
                                    width: (progress > 0 ? progress : 1) + "%",
                                }}
                            ></div>
                        </div>
                        {error && (
                            <div>
                                <div className="progress__error">{error}</div>
                                <a onClick={() => onRetry()} href="">
                                    Retry
                                </a>
                            </div>
                        )}
                    </div>
                ) : (
                    <Input id={id} name={label} type="file" accept={acceptedFileTypes} error={error} />
                )}
            </div>
        );
    };

    const renderLink = () => {
        return (
            <div className="margin-bottom--2">
                <a href={url} target="_blank" rel="noopener noreferrer">
                    {url}
                </a>
            </div>
        );
    };

    return (
        <div className="grid">
            {url && !error ? renderLink() : ""}
            {!url && <div className="grid__col-12 margin-bottom--0">{renderInput()}</div>}
        </div>
    );
};

export default GenericFileUploader;
