import React, { Component } from "react";
import PropTypes from "prop-types";

import image from "../../../utilities/api-clients/images";
import http from "../../../utilities/http";
import log from "../../../utilities/logging/log";
import notifications from "../../../utilities/notifications";

import Modal from "../../../components/Modal";
import Input from "../../../components/Input";
import FileUpload from "../../../components/file-upload/FileUpload";
import { bindFileUploadInput } from "../../../components/file-upload/bind";

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

const fileUploadID = "image-file-upload";

export default class EditHomepageItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.data ? this.props.data.id : null,
            description: this.props.data ? this.props.data.description : "",
            image: this.props.data ? this.props.data.image : "",
            uri: this.props.data ? this.props.data.uri : "",
            title: this.props.data ? this.props.data.title : "",
            imageData: {
                url: "",
                title: "",
                altText: ""
            },
            imageState: "",
            upload: {},
            isCreatingImageRecord: false,
            isUpdatingImageRecord: false,
            isUploadingImage: false,
            isGettingImage: false,
            isImportingImage: false,
            importHasErrored: false
        };
    }

    componentDidMount = () => {
        const hasImage = this.props.data && this.props.data.image;
        if (hasImage) {
            this.getImage(this.props.data.image, true);
            return;
        }
        this.createImageRecord();
        this.bindInput();
    };

    bindInput = () => {
        bindFileUploadInput(fileUploadID, this.state.upload, this.updateUploadState, this.onFileUploadSuccess, this.onFileUploadError);
    };

    updateUploadState = upload => {
        this.setState({ ...upload });
    };

    onFileUploadError = () => {
        this.bindInput();
    };

    onFileUploadSuccess = url => {
        this.setState({ isImportingImage: true, imageState: "uploaded" });
        this.addUploadToImageRecord(this.state.image, url);
    };

    handleSuccessClick = async () => {
        this.props.handleSuccessClick(
            { id: this.state.id, description: this.state.description, uri: this.state.uri, title: this.state.title, image: this.state.image },
            this.props.params.homepageDataField
        );
    };

    handleInputChange = event => {
        const value = event.target.value;
        const fieldName = event.target.name;
        this.setState({ [fieldName]: value });
    };

    createImageRecord = () => {
        this.setState({ isCreatingImageRecord: true });
        const imageProps = {
            state: "created",
            collection_id: this.props.params.collectionID,
            type: "eye-candy"
        };
        return image
            .create(imageProps)
            .then(image => {
                this.setState({ image: image.id, isCreatingImageRecord: false, imageState: "created" });
            })
            .catch(error => {
                this.setState({ isCreatingImageRecord: false });
                log.event("error creating image record", log.error(error));
                console.error("error creating image record:", error);
                if (error.status == 401) {
                    return;
                }
                notifications.add({
                    type: "warning",
                    message: "There was an error creating the image record. Please refresh the page",
                    isDismissable: true
                });
            });
    };

    addUploadToImageRecord = (imageID, imageS3URL) => {
        const imageProps = {
            state: "uploaded",
            upload: {
                path: imageS3URL
            }
        };
        this.setState({ isUpdatingImageRecord: true });
        return image
            .update(imageID, imageProps)
            .then(() => {
                this.setState({ isUpdatingImageRecord: false });
                this.pollForUpdates(imageID);
            })
            .catch(error => {
                this.setState({ isUpdatingImageRecord: false });
                log.event(
                    "error adding upload to image record",
                    log.data({ collection_id: this.props.params.collectionID, image_id: imageID, image_upload_path: imageS3URL }),
                    log.error(error)
                );
                console.error("error adding upload to image record:", error);
                if (error.status == 401) {
                    return;
                }
                notifications.add({
                    type: "warning",
                    message: "There was an error creating the image record. Please close the model and try again",
                    isDismissable: true
                });
            });
    };

    getImage = (imageID, shouldPoll = false) => {
        this.setState({ isGettingImage: true });
        return image
            .get(imageID)
            .then(response => {
                if (response.state == "completed" || response.state == "published") {
                    this.setState({ isImportingImage: false, importHasErrored: false, imageState: response.state });
                    this.stopPollingForUpdates();
                    this.getImageDownload(imageID);
                    console.log("HELLO");
                    return;
                }
                if (response.state == "importing") {
                    this.setState({ isImportingImage: true, importHasErrored: false, imageState: response.state });
                    if (shouldPoll) {
                        this.pollForUpdates(imageID);
                    }
                    return;
                }
                if (response.state == "error") {
                    this.setState({ isGettingImage: false, isImportingImage: false, importHasErrored: true, imageState: response.state });
                    this.stopPollingForUpdates();
                    console.error("Image import failed, image ID:", imageID);
                    log.event("image import failed", log.data({ image_id: imageID }), log.error(error));
                    return;
                }
            })
            .catch(error => {
                this.setState({ isGettingImage: false });
                log.event("error getting image details from image-api", log.data({ image_id: imageID }), log.error(error));
                console.error("error getting image details from image-api", error);
                if (error.status == 401) {
                    return;
                }
                notifications.add({
                    type: "warning",
                    message: "There was an error getting the image. You can still edit this item.",
                    isDismissable: true
                });
            });
    };

    pollForUpdates = imageID => {
        window.pollForUpdates = setInterval(() => {
            this.getImage(imageID, false);
        }, 1000);
    };

    stopPollingForUpdates = () => {
        clearInterval(window.pollForUpdates);
    };

    getImageDownload = imageID => {
        const downloadType = "original";
        this.setState({ isGettingImage: true });
        return image
            .getImageDownload(imageID, downloadType)
            .then(response => {
                const imageData = this.mapImageToState(response);
                this.setState({ isGettingImage: false, imageData: imageData });
            })
            .catch(error => {
                this.setState({ isGettingImage: false });
                log.event(
                    "error getting image downloads from image-api",
                    log.data({ image_id: imageID, download_type: downloadType }),
                    log.error(error)
                );
                console.error("error getting image downloads from image-api", error);
                if (error.status == 401) {
                    return;
                }
                notifications.add({
                    type: "warning",
                    message: "There was an error getting the image. You can still edit this item.",
                    isDismissable: true
                });
            });
    };

    mapImageToState = image => {
        try {
            return {
                url: image.href
            };
        } catch (error) {
            log.event("error mapping image data to state", log.error(error));
            // throw an error to let parent mapper catch and display notification
            throw new Error(`Error mapping image data to state: \n ${error}`);
        }
    };

    handleCancelClick = () => {
        this.stopPollingForUpdates();
        this.props.handleCancelClick();
    };

    handleRetryClick = () => {
        this.setState({
            imageState: "created",
            upload: {}
        });
        this.bindInput();
    };

    handleRemoveImageClick = async () => {
        this.setState({
            image: "",
            imageData: {
                url: "",
                title: "",
                altText: ""
            }
        });
        await this.createImageRecord();
        this.bindInput();
    };

    renderImagePreview = () => {
        if (this.state.isImportingImage) {
            return <p>Image being imported</p>;
        }
        if (this.state.importHasErrored) {
            return <p>Image import errored</p>;
        }
        if (this.state.isGettingImage) {
            return <p>Image is loading</p>;
        }
        if (this.state.imageData && this.state.imageData.url) {
            return (
                <div className="grid">
                    <img className="grid__col-12" src={this.state.imageData.url} />
                    <button type="button" className="btn btn--link" onClick={this.handleRemoveImageClick}>
                        Remove image
                    </button>
                </div>
            );
        }
        return;
    };

    renderImageUpload = () => {
        const upload = this.state.upload;
        return (
            <div>
                {this.props.data || (this.state.image && this.state.imageState != "created") ? (
                    this.renderImagePreview()
                ) : (
                    <FileUpload
                        label="File upload"
                        type="file"
                        id={fileUploadID}
                        accept=".png"
                        url={upload.url || null}
                        extension={upload.extension || null}
                        error={upload.error || null}
                        progress={upload.progress >= 0 ? upload.progress : null}
                        onRetry={this.handleRetryClick}
                    />
                )}
            </div>
        );
    };

    renderModalBody = isDisabled => {
        switch (this.props.params.homepageDataField) {
            case "featuredContent": {
                return (
                    <div>
                        <Input
                            id="title"
                            type="input"
                            label="Title"
                            disabled={isDisabled}
                            value={this.state.title}
                            onChange={this.handleInputChange}
                        />
                        <Input id="uri" type="input" label="URL" disabled={isDisabled} value={this.state.uri} onChange={this.handleInputChange} />
                        <Input
                            id="description"
                            type="textarea"
                            label="Description"
                            disabled={isDisabled}
                            value={this.state.description}
                            onChange={this.handleInputChange}
                        />
                        {this.renderImageUpload()}
                        <Input
                            id="image-title"
                            type="input"
                            label="Image title"
                            disabled={isDisabled}
                            value={this.state.imageData.title}
                            onChange={this.handleInputChange}
                        />
                        <Input
                            id="image-alt-text"
                            type="input"
                            label="Alt text (leave blank if decorative)"
                            disabled={isDisabled}
                            value={this.state.imageData.altText}
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
        const isDisabled = this.state.isCreatingImageRecord || this.state.isGettingImage || this.state.isUploadingImage;
        return (
            <Modal>
                <div className="modal__header">
                    <h2>Add an item</h2>
                </div>
                <div className="modal__body">{this.renderModalBody()}</div>
                <div className="modal__footer">
                    <button
                        id="continue"
                        type="button"
                        className="btn btn--primary btn--margin-right"
                        disabled={isDisabled}
                        onClick={this.handleSuccessClick}
                    >
                        Continue
                    </button>
                    <button id="cancel" type="button" className="btn" onClick={this.handleCancelClick}>
                        Cancel
                    </button>
                </div>
            </Modal>
        );
    }
}

EditHomepageItem.propTypes = propTypes;
