import React, { Component } from "react";
import PropTypes from "prop-types";

import Input from "../Input";

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
                {!this.props.url && <div className="grid__col-12 margin-bottom--0">{this.renderInput()}</div>}
            </div>
        );
    }
}

FileUpload.propTypes = propTypes;

export default FileUpload;
