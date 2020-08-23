import React, { Component } from "react";
import PropTypes from "prop-types";

import image from "../../../utilities/api-clients/images";
import http from "../../../utilities/http";
import log from "../../../utilities/logging/log";
import notifications from "../../../utilities/notifications";

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
        this.bindInputs();
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
                const imageData = this.mapImageToState(response);
                this.setState({ isGettingImage: false, imageData: imageData });
            })
            .catch(error => {
                this.setState({ isCreatingImageRecord: false });
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

    mapImageToState = image => {
        try {
            return {
                url: image.upload.path
            };
        } catch (error) {
            log.event("error mapping image data to state", log.error(error));
            // throw an error to let parent mapper catch and display notification
            throw new Error(`Error mapping image data to state: \n ${error}`);
        }
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

                    this.addUploadToImageRecord(response.url);
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

    handleRemoveImageClick = () => {};

    renderImagePreview = () => {
        return (
            <div>
                <div>{this.state.imageData.url ? <img src={this.state.imageData.url} /> : null}</div>
                <button type="button" className="btn btn--link" onClick={this.props.handleRemoveImageClick}>
                    Remove image
                </button>
            </div>
        );
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
                        id="image-file-upload"
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
