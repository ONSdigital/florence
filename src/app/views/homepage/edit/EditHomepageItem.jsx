import React, { Component } from "react";
import PropTypes from "prop-types";

import image from "../../../utilities/api-clients/images";
import http from "../../../utilities/http";
import log from "../../../utilities/logging/log";
import notifications from "../../../utilities/notifications";

import Resumable from "../../../resumable";

import Modal from "../../../components/Modal";
import Input from "../../../components/Input";
import FileUpload, { bindFileUploadInput } from "../../../components/file-upload/FileUpload";

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
            upload: {},
            isCreatingImageRecord: false,
            isUploadingImage: false,
            isGettingImage: false
        };
    }

    componentDidMount = () => {
        const hasImage = this.props.data && this.props.data.image;
        if (hasImage) {
            this.getImage(this.props.data.image);
            return;
        }
        this.createImageRecord();
        this.bindInput();
    };

    bindInput = () => {
        bindFileUploadInput(fileUploadID, this.state.upload, this.updateUploadState, this.onFileUploadSuccess);
    };

    updateUploadState = upload => {
        this.setState({ upload });
    };

    onFileUploadSuccess = url => {
        this.addUploadToImageRecord(url);
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
        image
            .create(imageProps)
            .then(image => {
                this.setState({ image: image.id, isCreatingImageRecord: false });
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

    addUploadToImageRecord = imageS3URL => {
        const imageProps = {
            state: "uploaded",
            upload: {
                path: imageS3URL
            }
        };
        image
            .update(this.state.image, imageProps)
            .then(response => {
                // TODO: poll for image
                console.log(response);
            })
            .catch(error => {
                this.setState({ isCreatingImageRecord: false });
                log.event(
                    "error adding upload to image record",
                    log.data({ collection_id: this.params.collectionID, image_id: this.state.image, image_upload_path: imageS3URL }),
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

    getImage = imageID => {
        this.setState({ isGettingImage: true });
        image
            .get(imageID)
            .then(response => {
                if (response.state == "completed" || response.state == "published") {
                    this.getImageDownload(imageID);
                }
                if (response.state == "importing") {
                    // start polling
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

    getImageDownload = imageID => {
        const downloadType = "original";
        image
            .getImageDownload(imageID, downloadType)
            .then(response => {
                const imageState = this.mapImageToState(response);
                this.setState({ isGettingImage: false, imageData: imageState });
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

    handleRetryClick = () => {
        console.log("You retried");
    };

    handleRemoveImageClick = () => {};

    renderImagePreview = () => {
        if (this.state.isGettingImage) {
            return <div>Image is loading</div>;
        }
        if (this.state.imageData && this.state.imageData.url) {
            return (
                <div>
                    <img src={this.state.imageData.url} />
                    <button type="button" className="btn btn--link" onClick={this.props.handleRemoveImageClick}>
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
                {this.props.data && this.props.data.image ? (
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
                            value={this.state.imageTitle}
                            onChange={this.handleInputChange}
                        />
                        <Input
                            id="image-alt-text"
                            type="input"
                            label="Alt text (leave blank if decorative)"
                            disabled={isDisabled}
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
                    <button id="cancel" type="button" className="btn" disabled={isDisabled} onClick={this.props.handleCancelClick}>
                        Cancel
                    </button>
                </div>
            </Modal>
        );
    }
}

EditHomepageItem.propTypes = propTypes;
