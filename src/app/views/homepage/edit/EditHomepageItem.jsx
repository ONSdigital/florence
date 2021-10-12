import React, { Component } from "react";
import PropTypes from "prop-types";

import image from "../../../utilities/api-clients/images";
import log from "../../../utilities/logging/log";
import notifications from "../../../utilities/notifications";

import Modal from "../../../components/Modal";
import Input from "../../../components/Input";
import FileUpload from "../../../components/file-upload/FileUpload";
import { bindFileUploadInput } from "../../../components/file-upload/bind";

const propTypes = {
    params: PropTypes.shape({
        homepageDataField: PropTypes.string.isRequired,
        collectionID: PropTypes.string.isRequired,
    }),
    data: PropTypes.shape({
        id: PropTypes.number,
        description: PropTypes.string,
        uri: PropTypes.string,
        image: PropTypes.string,
        title: PropTypes.string,
    }),
    handleSuccessClick: PropTypes.func.isRequired,
    handleCancelClick: PropTypes.func.isRequired,
};

const FILE_UPLOAD_ID = "image-file-upload";

// Values correspond to server side status of image import
const STATUS_IMAGE_RECORD_CREATED = "Image record created";
const STATUS_IMPORTING_IMAGE = "Image being imported";
const STATUS_IMPORTING_ERROR = "Image import errored";
const STATUS_GETTING_IMAGE = "Image is loading";
const STATUS_IMAGE_LOADED = "Image loaded";

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
            },
            imageState: "",
            upload: {},
            isCreatingImageRecord: false,
            isUpdatingImageRecord: false,
            isUploadingImage: false,
            isGettingImage: false,
            isImportingImage: false,
            imageImportStatus: STATUS_IMAGE_RECORD_CREATED,
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
        bindFileUploadInput(FILE_UPLOAD_ID, this.updateUploadState, this.onFileUploadSuccess, this.onFileUploadError);
    };

    updateUploadState = upload => {
        const newUploadState = {
            ...this.state.upload,
            ...upload,
        };
        this.setState({ upload: newUploadState });
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
            type: "eye-candy",
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
                if (error.status === 401) {
                    return;
                }
                notifications.add({
                    type: "warning",
                    message: "There was an error creating the image record. Please refresh the page",
                    isDismissable: true,
                });
            });
    };

    // getImageKeyFromURL extracts the last part of the upload URL (aka the 'key' in AWS speak)
    // it is usually some like {id}-{filename}{filetype}
    getImageKeyFromURL = url => {
        return url.substring(url.lastIndexOf("/") + 1);
    };

    addUploadToImageRecord = (imageID, imageS3URL) => {
        const imageKey = this.getImageKeyFromURL(imageS3URL);
        const imageProps = {
            state: "uploaded",
            filename: this.state.upload ? this.state.upload.filename : imageKey,
            upload: {
                path: imageKey,
            },
        };
        this.setState({ imageImportStatus: STATUS_IMPORTING_IMAGE, isUpdatingImageRecord: true });
        return image
            .update(imageID, imageProps)
            .then(() => {
                this.setState({ isUpdatingImageRecord: false });
                this.pollForUpdates(imageID);
            })
            .catch(async error => {
                this.stopPollingForUpdates(imageID);
                this.setState({
                    imageData: {
                        url: "",
                    },
                    imageState: "created",
                    upload: {},
                    isUpdatingImageRecord: false,
                    isUploadingImage: false,
                    isGettingImage: false,
                    isImportingImage: false,
                    imageImportStatus: STATUS_IMAGE_RECORD_CREATED,
                });
                await this.createImageRecord();
                this.bindInput();
                log.event(
                    "error adding upload to image record",
                    log.data({ collection_id: this.props.params.collectionID, image_id: imageID, image_upload_path: imageS3URL }),
                    log.error(error)
                );
                console.error("error adding upload to image record:", error);
                if (error.status === 401) {
                    return;
                }
                notifications.add({
                    type: "warning",
                    message: "There was an error creating the image record. Please try again",
                    isDismissable: true,
                });
            });
    };

    getImage = (imageID, shouldPoll = false) => {
        this.setState({ isGettingImage: true });
        return image
            .get(imageID)
            .then(response => {
                if (response.state === "imported" || response.state === "completed" || response.state === "published") {
                    this.setState({ imageImportStatus: STATUS_GETTING_IMAGE, isGettingImage: false, imageState: response.state });
                    this.stopPollingForUpdates();
                    this.getImageDownload(imageID);
                    return;
                }
                if (response.state === "importing") {
                    this.setState({ imageImportStatus: STATUS_IMPORTING_IMAGE, imageState: response.state });
                    if (shouldPoll) {
                        this.pollForUpdates(imageID);
                    }
                    return;
                }
                if (response.state === "failed_import") {
                    this.setState({ imageImportStatus: STATUS_IMPORTING_ERROR, isGettingImage: false, imageState: response.state });
                    this.stopPollingForUpdates();
                    console.error("Image import failed, image ID:", imageID);
                    log.event("image import failed", log.data({ image_id: imageID }));
                }
            })
            .catch(error => {
                this.setState({ isGettingImage: false });
                log.event("error getting image details from image-api", log.data({ image_id: imageID }), log.error(error));
                console.error("error getting image details from image-api", error);
                if (error.status === 401) {
                    return;
                }
                notifications.add({
                    type: "warning",
                    message: "There was an error getting the image. You can still edit this item.",
                    isDismissable: true,
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
            .getDownloads(imageID, downloadType)
            .then(response => {
                const imageData = this.mapImageToState(response);
                this.setState({ isGettingImage: false, imageImportStatus: STATUS_IMAGE_LOADED, imageData: imageData });
            })
            .catch(error => {
                this.setState({ isGettingImage: false });
                log.event(
                    "error getting image downloads from image-api",
                    log.data({ image_id: imageID, download_type: downloadType }),
                    log.error(error)
                );
                console.error("error getting image downloads from image-api", error);
                if (error.status === 401) {
                    return;
                }
                notifications.add({
                    type: "warning",
                    message: "There was an error getting the image. You can still edit this item.",
                    isDismissable: true,
                });
            });
    };

    mapImageToState = image => {
        try {
            return {
                url: image.href,
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
            upload: {},
        });
        this.bindInput();
    };

    handleRemoveImageClick = async () => {
        this.setState({
            image: "",
            imageData: {
                url: "",
            },
            upload: {},
            imageImportStatus: STATUS_IMAGE_RECORD_CREATED,
        });
        await this.createImageRecord();
        this.bindInput();
    };

    renderImagePreview = () => {
        if (this.state.imageImportStatus !== STATUS_IMAGE_RECORD_CREATED && this.state.imageImportStatus !== STATUS_IMAGE_LOADED) {
            return <p>{this.state.imageImportStatus}</p>;
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
    };

    renderImageUpload = () => {
        const upload = this.state.upload;
        return (
            <div>
                {this.state.image && this.state.imageState !== "created" ? (
                    this.renderImagePreview()
                ) : (
                    <FileUpload
                        label="File upload"
                        type="file"
                        id={FILE_UPLOAD_ID}
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
            case "featuredContent":
            case "aroundONS": {
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
                    </div>
                );
            }
            default: {
                return <p>Something went wrong: unsupported field type</p>;
            }
        }
    };

    render() {
        console.log(this.state.imageData.url);
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
