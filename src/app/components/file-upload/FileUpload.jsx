import React, { Component } from "react";
import PropTypes from "prop-types";

import http from "../../utilities/http";

import Input from "../Input";

import Resumable from "resumeablejs";

const propTypes = {
    label: PropTypes.string,
    id: PropTypes.string.isRequired,
    url: PropTypes.string,
    error: PropTypes.string,
    extension: PropTypes.string,
    accept: PropTypes.string,
    progress: PropTypes.number,
    onRetry: PropTypes.func
};

class FileUpload extends Component {
    constructor(props) {
        super(props);

        this.handleOnRetry = this.handleOnRetry.bind(this);
    }

    handleOnRetry(event) {
        event.preventDefault();
        this.props.onRetry(this.props.label);
    }

    renderInput() {
        return (
            <div>
                {/* Checking whether it is a number because 0 usually equals false
                    but we want it (and all other numbers) to resolve to true */}
                {typeof this.props.progress === "number" ? (
                    <div className="margin-bottom--1">
                        <p>Progress: {(this.props.progress > 0 ? this.props.progress : 1) + "%"}</p>
                        <div className="progress">
                            <div
                                className={"progress__bar" + (this.props.error ? " progress__bar--error" : "")}
                                style={{
                                    width: (this.props.progress > 0 ? this.props.progress : 1) + "%"
                                }}
                            ></div>
                        </div>
                        {this.props.error && (
                            <div>
                                <div className="progress__error">{this.props.error}</div>
                                <a onClick={this.handleOnRetry} href="">
                                    Retry
                                </a>
                            </div>
                        )}
                    </div>
                ) : (
                    <Input id={this.props.id} name={this.props.label} type="file" accept={this.props.accept} error={this.props.error} />
                )}
            </div>
        );
    }

    renderLink() {
        return (
            <div className="margin-bottom--2">
                <a href={this.props.url} target="_blank" rel="noopener noreferrer">
                    {this.props.url}
                </a>
            </div>
        );
    }

    render() {
        return (
            <div className="grid">
                {this.props.url && !this.props.error ? this.renderLink() : ""}
                {!this.props.url && <div className="grid__col-9 margin-bottom--0">{this.renderInput()}</div>}
            </div>
        );
    }
}

FileUpload.propTypes = propTypes;

export default FileUpload;

export function bindFileUploadInput(inputID, uploadState, updateState, onSuccess) {
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
            error: null
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
            progress: progressPercentage
        };
        const upload = {
            ...uploadState,
            ...fileUpload
        };
        updateState({ upload });
    });
    r.on("fileError", file => {
        const fileUpload = {
            error: "An error occurred whilst uploading this file."
        };
        const upload = {
            ...uploadState,
            ...fileUpload
        };

        console.error("Error uploading file to server");
        updateState({ upload });
    });
    r.on("fileSuccess", file => {
        const aliasName = file.resumableObj.opts.query.aliasName;
        http.get(`/upload/${file.uniqueIdentifier}`)
            .then(response => {
                const fileUpload = {
                    aliasName: aliasName,
                    progress: 0,
                    url: response.url
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
                    error: "An error occurred whilst uploading this file"
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
