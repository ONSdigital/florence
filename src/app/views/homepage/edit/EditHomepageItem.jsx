import React, { Component } from "react";
import PropTypes from "prop-types";

import image from "../../../utilities/api-clients/image";
import http from "../../../utilities/http";

import Resumable from "resumeablejs";

import Modal from "../../../components/Modal";
import Input from "../../../components/Input";
import FileUpload from "../../../components/file-upload/FileUpload";

const propTypes = {
    params: PropTypes.shape({
        homepageDataField: PropTypes.string.isRequired,
        collectionID: PropTypes.string.isRequired
    }),
    data: PropTypes.shape({
        id: PropTypes.number,
        description: PropTypes.string,
        uri: PropTypes.string,
        image: PropTypes.string,
        title: PropTypes.string
    }),
    handleSuccessClick: PropTypes.func.isRequired,
    handleCancelClick: PropTypes.func.isRequired
};

export default class EditHomepageItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.data ? this.props.data.id : null,
            description: this.props.data ? this.props.data.description : "",
            image: this.props.data ? this.props.data.image : "",
            uri: this.props.data ? this.props.data.uri : "",
            title: this.props.data ? this.props.data.title : "",
            imageID: "",
            imageURL: "",
            imageTitle: "",
            ImageAltText: "",
            upload: {},
            isUploadingImage: false
        };
    }

    componentDidMount = () => {
        this.bindInputs();
    };

    handleSuccessClick = async () => {
        const imageUploaded = this.handleImageUpload();
        if (!imageUploaded) {
            return;
        }
        this.props.handleSuccessClick(this.state, this.props.params.homepageDataField);
    };

    handleInputChange = event => {
        const value = event.target.value;
        const fieldName = event.target.name;
        this.setState({ [fieldName]: value });
    };

    handleImageUpload = async () => {
        this.setState({ isUploadingImage: true });
        const imageRecord = await this.createImageRecord();
        if (!imageRecord.id) {
            return false;
        }
        return true;
    };

    createImageRecord = () => {
        const imageProps = {
            collection_id: this.props.params.collectionID,
            type: "eye-candy"
        };
        image
            .create(imageProps)
            .then(image => image)
            .catch(error => {
                // TODO: Handle error properly
                console.log(error);
            });
    };

    addUploadToImageRecord = imageS3URL => {
        const imageProps = {
            url: imageS3URL,
            status: "uploaded"
        };
        image.update().then(response => {
            console.log(response);
        });
    };

    bindInputs() {
        const input = document.getElementById("image-file-upload");
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
                ...this.state.upload,
                ...fileUpload
            };
            this.setState({ upload });
        });
        r.on("fileProgress", file => {
            const progressPercentage = Math.round(Number(file.progress() * 100));
            const fileUpload = {
                progress: progressPercentage
            };
            const upload = {
                ...this.state.upload,
                ...fileUpload
            };
            this.setState({ upload });
        });
        r.on("fileError", file => {
            const fileUpload = {
                error: "An error occurred whilst uploading this file."
            };
            const upload = {
                ...this.state.upload,
                ...fileUpload
            };

            console.error("Error uploading file to server");
            this.setState({ upload });
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
                        ...this.state.upload,
                        ...fileUpload
                    };

                    this.setState({ upload });

                    //this.addUploadedFileToJob(aliasName, response.url);
                })
                .catch(error => {
                    const fileUpload = {
                        error: "An error occurred whilst uploading this file"
                    };

                    const upload = {
                        ...this.state.upload,
                        ...fileUpload
                    };

                    console.error("Error fetching uploaded file's URL: ", error);
                    this.setState({ upload });
                });
        });
    }

    handleRetryClick = () => {
        console.log("You retried");
    };

    renderModalBody = () => {
        const upload = this.state.upload;
        switch (this.props.params.homepageDataField) {
            case "featuredContent": {
                return (
                    <div>
                        <Input
                            id="title"
                            type="input"
                            label="Title"
                            disabled={this.state.isUploadingImage}
                            value={this.state.title}
                            onChange={this.handleInputChange}
                        />
                        <Input
                            id="uri"
                            type="input"
                            label="URL"
                            disabled={this.state.isUploadingImage}
                            value={this.state.uri}
                            onChange={this.handleInputChange}
                        />
                        <Input
                            id="description"
                            type="textarea"
                            label="Description"
                            disabled={this.state.isUploadingImage}
                            value={this.state.description}
                            onChange={this.handleInputChange}
                        />
                        <FileUpload
                            label="File upload"
                            type="file"
                            id="image-file-upload"
                            accept=".png, .jpeg, .svg"
                            url={upload.url || null}
                            extension={upload.extension || null}
                            error={upload.error || null}
                            progress={upload.progress >= 0 ? upload.progress : null}
                            onRetry={this.handleRetryClick}
                        />
                        <Input
                            id="image-title"
                            type="input"
                            label="Image title"
                            disabled={this.state.isUploadingImage}
                            value={this.state.imageTitle}
                            onChange={this.handleInputChange}
                        />
                        <Input
                            id="image-alt-text"
                            type="input"
                            label="Alt text (leave blank if decorative)"
                            disabled={this.state.isUploadingImage}
                            value={this.state.image}
                            onChange={this.handleInputChange}
                        />
                    </div>
                );
            }
            default: {
                return <p>Something went wrong: unsupported field type</p>;
            }
        }
    };

    render() {
        return (
            <Modal>
                <div className="modal__header">
                    <h2>Add an item</h2>
                </div>
                <div className="modal__body">{this.renderModalBody()}</div>
                <div className="modal__footer">
                    <button id="continue" type="button" className="btn btn--primary btn--margin-right" onClick={this.handleSuccessClick}>
                        Continue
                    </button>
                    <button id="cancel" type="button" className="btn" onClick={this.props.handleCancelClick}>
                        Cancel
                    </button>
                </div>
            </Modal>
        );
    }
}

EditHomepageItem.propTypes = propTypes;
