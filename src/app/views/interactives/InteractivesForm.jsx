import React, { useEffect, useState } from "react";
import { browserHistory, Link } from "react-router";

import { createInteractive, getInteractive, editInteractive, resetInteractiveError } from "../../actions/interactives";

import BackButton from "../../components/back-button";
import Input from "../../components/Input";
import ButtonWithShadow from "../../components/button/ButtonWithShadow";
import { useDispatch, useSelector } from "react-redux";
import { getParameterByName } from "../../utilities/utils";
import collections from "../../utilities/api-clients/collections";
import Select from "../../components/Select";
import notifications from "../../utilities/notifications";

export default function InteractivesForm(props) {
    const dispatch = useDispatch();
    const { successMessage, interactive, errors } = useSelector(state => state.interactives);
    const { rootPath } = useSelector(state => state.state);

    const [internalId, setInternalId] = useState("");
    const [title, setTitle] = useState("");
    const [label, setLabel] = useState("");
    const [file, setFile] = useState(null);
    const [urlIndex, setUrlIndex] = useState("");
    const [url, setUrl] = useState("");
    const [interactiveId, setInteractiveId] = useState("");
    const [published, setPublished] = useState(false);
    const [collectionId, setCollectionId] = useState(getParameterByName("collection"));
    const [collection, setCollection] = useState({});
    const [fileError, setFileError] = useState("");
    const [editMode, setEditMode] = useState(false);
    const [blockActions, setBlockActions] = useState(false);

    useEffect(() => {
        const { interactiveId } = props.params;
        if (interactiveId) {
            setInteractiveId(interactiveId);
            dispatch(getInteractive(interactiveId));
        } else {
            setInternalId("");
            setTitle("");
            setLabel("");
            setFile(null);
            setUrl("");
            setUrlIndex(0);
            setInteractiveId("");
            setPublished(false);
        }
        dispatch(resetInteractiveError());
    }, []);

    useEffect(() => {
        if (!collectionId) {
            props.router.push(`${rootPath}/collections`);
        } else {
            const fetchCollection = async () => {
                return await collections.get(collectionId);
            };
            fetchCollection()
                .then(data => {
                    setCollection(data);
                })
                .catch(console.error);
        }
    }, [collectionId]);

    useEffect(() => {
        const { interactiveId } = props.params;
        if (interactiveId && interactive.id) {
            const { metadata } = interactive;
            internalId !== metadata.internal_id || title !== metadata.title || label !== metadata.label || file
                ? setEditMode(true)
                : setEditMode(false);
        }
    }, [internalId, title, label, file]);

    useEffect(() => {
        if (errors.apiErrors && errors.apiErrors.message) {
            notifications.add({
                type: "warning",
                message: errors.apiErrors.message,
                autoDismiss: 5000,
            });
            setBlockActions(true);
        }
    }, [errors.apiErrors]);

    useEffect(() => {
        if (interactive.metadata && interactiveId) {
            const { metadata, archive, html_files } = interactive;
            setInternalId(metadata.internal_id);
            setTitle(metadata.title);
            setLabel(metadata.label);

            //tactical fix to support MVP requirements of supporting single interactive
            //needs more work to support multiple interactives: https://trello.com/c/juxhzj1D
            if (html_files && html_files.length > 0) {
                setUrl(window.location.origin + html_files[0].uri);
            }

            setPublished(metadata.published);

            if (interactive.state === "ImportFailure") {
                setFileError(archive.import_message);
            }
        }
    }, [interactive]);

    useEffect(() => {
        if (successMessage.success) {
            if (successMessage.type === "update") {
                props.router.push(`${rootPath}/collections/${collectionId}`);
            }
            if (interactive.id) {
                const interactiveFromCollection = collection.interactives.find(elements => elements.id === interactive.id);
                const isReviewed = interactiveFromCollection && interactiveFromCollection.state === "Reviewed";
                if (editMode && isReviewed) {
                    collections
                        .setInteractiveStatusToComplete(collectionId, interactive.id)
                        .then(() => {
                            browserHistory.push(`${rootPath}/interactives?collection=${collectionId}`);
                        })
                        .catch(e => {
                            notifications.add({
                                type: "warning",
                                message: e.body ? e.body.message : e.message,
                                autoDismiss: 5000,
                            });
                        });
                } else {
                    collections
                        .addInteractive(collectionId, interactive.id)
                        .then(() => props.router.push(`${rootPath}/collections/${collectionId}`))
                        .catch(e => {
                            notifications.add({
                                type: "warning",
                                message: e.body ? e.body.message : e.message,
                                autoDismiss: 5000,
                            });
                        });
                }
            }
        }
    }, [successMessage, interactive.id]);

    const onSubmit = e => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("file", file);
        formData.append(
            "interactive",
            JSON.stringify({
                id: interactiveId,
                metadata: {
                    internal_id: internalId,
                    title: title,
                    label: label,
                    collection_id: collectionId,
                },
            })
        );

        interactiveId ? dispatch(editInteractive(interactiveId, formData)) : dispatch(createInteractive(formData));
    };

    const onSubmitApproval = async () => {
        collections
            .setInteractiveStatusToReviewed(collectionId, interactiveId)
            .then(() => {
                notifications.add({
                    type: "positive",
                    message: "Interactive successfully submitted for approval",
                    autoDismiss: 5000,
                });
            })
            .catch(e => {
                notifications.add({
                    type: "warning",
                    message: e.body ? e.body.message : e.message,
                    autoDismiss: 5000,
                });
            });
        props.router.push(`${rootPath}/collections/${collectionId}`);
    };

    const copyAllUrls = async () => {
        var allUrls = "";
        if (interactive) {
            try {
                interactive.html_files.map((htm, index) => {
                    allUrls += htm.uri + "\n";
                });
            } catch (err) {
                console.error("Error fetching all interactive URL's", err);
                allUrls = "Error fetching all interactive URL's";
            }
        } else {
            allUrls = "No interactive URL's available";
        }
        navigator.clipboard.writeText(allUrls);
    };

    const handleFile = e => {
        const file = e.target.files[0];
        setFile(file);
    };

    const mapInteractives = interactives => {
        if (interactives) {
            try {
                return interactives.map((interactive, index) => {
                    return {
                        id: index,
                        name: window.location.origin + interactive.uri,
                    };
                });
            } catch (err) {
                console.error("Error mapping interactives to select", err);
            }
        }
        return;
    };

    const displayedErrors = Object.values(errors.validations);

    return (
        <div className="grid grid--justify-space-around padding-bottom--2 padding-top--2">
            <div className="grid__col-sm-12 grid__col-md-10 grid__col-xlg-8">
                <BackButton redirectUrl={`${rootPath}/interactives?collection=${collectionId}`} classNames="ons-breadcrumb__item" />
                {displayedErrors.length > 0 && (
                    <div className="grid__col-sm-12 grid__col-xl-4 padding-top--2">
                        <div className="ons-panel ons-panel--errors">
                            <div className="ons-panel--errors__title">
                                <span className="">There are {displayedErrors.length} problems with your answer: </span>
                            </div>
                            <div className="ons-panel--errors__body">
                                {displayedErrors.map((error, index) => {
                                    return (
                                        <p>
                                            {index + 1}. <span>{error}</span>{" "}
                                        </p>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                <h1 className="ons-u-fs-xxl ons-u-mt-l">{!interactiveId ? "Upload a new interactive" : "Edit an existing interactive"}</h1>

                {published && (
                    <div className="ons-panel ons-panel--info ons-panel--no-title">
                        <span className="ons-u-vh">Important information: </span>
                        <div className="ons-panel__body">
                            <p>This interactive has been published. You can only update the archive file via the upload button below.</p>
                        </div>
                    </div>
                )}

                {/* FORM */}
                <div className="grid__col-sm-12 grid__col-xl-4">
                    {errors.internalId ? (
                        <div className="ons-panel ons-panel--error ons-panel--no-title ons-u-mb-s margin-bottom--1" id="error-panel">
                            <span className="ons-u-vh">Error: </span>
                            <div className="ons-panel__body">
                                <p className="ons-panel__error">
                                    <strong>{errors.internalId}</strong>
                                </p>
                                <div className="grid__col-sm-12 grid__col-md-6 grid__col-xl-4">
                                    <Input
                                        type="text"
                                        id="internal_id"
                                        className="ons-input ons-input--text ons-input-type__input"
                                        name="internal_id"
                                        disabled={blockActions}
                                        value={internalId}
                                        error={""}
                                        required
                                        onChange={e => setInternalId(e.target.value)}
                                        label="Internal ID"
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="grid__col-sm-12 grid__col-md-6 grid__col-xl-4">
                            <Input
                                type="text"
                                id="internal_id"
                                className="ons-input ons-input--text ons-input-type__input"
                                name="internal_id"
                                disabled={blockActions}
                                value={internalId}
                                error={""}
                                required
                                onChange={e => setInternalId(e.target.value)}
                                label="Internal ID"
                            />
                        </div>
                    )}
                    {errors.title ? (
                        <div className="ons-panel ons-panel--error ons-panel--no-title ons-u-mb-s margin-bottom--1" id="error-panel">
                            <span className="ons-u-vh">Error: </span>
                            <div className="ons-panel__body">
                                <p className="ons-panel__error">
                                    <strong>{errors.title}</strong>
                                </p>
                                <div className="grid__col-sm-12 grid__col-md-6 grid__col-xl-4">
                                    <Input
                                        type="text"
                                        id="title"
                                        className="ons-input ons-input--text ons-input-type__input"
                                        name="title"
                                        disabled={blockActions}
                                        value={title}
                                        required
                                        onChange={e => setTitle(e.target.value)}
                                        label="Title"
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="grid__col-sm-12 grid__col-md-6 grid__col-xl-4">
                            <Input
                                type="text"
                                id="title"
                                className="ons-input ons-input--text ons-input-type__input"
                                name="title"
                                disabled={blockActions}
                                value={title}
                                required
                                onChange={e => setTitle(e.target.value)}
                                label="Title"
                                helpMessage="It will help to search for the interactive later"
                            />
                        </div>
                    )}
                    {errors.label ? (
                        <div className="ons-panel ons-panel--error ons-panel--no-title ons-u-mb-s margin-bottom--1" id="error-panel">
                            <span className="ons-u-vh">Error: </span>
                            <div className="ons-panel__body">
                                <p className="ons-panel__error">
                                    <strong>{errors.label}</strong>
                                </p>
                                <div className="grid__col-sm-12 grid__col-md-6 grid__col-xl-4">
                                    <Input
                                        type="text"
                                        id="label"
                                        className="ons-input ons-input--text ons-input-type__input"
                                        name="label"
                                        disabled={blockActions}
                                        value={label}
                                        required
                                        onChange={e => setLabel(e.target.value)}
                                        label="Label"
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="grid__col-sm-12 grid__col-md-6 grid__col-xl-4">
                            <Input
                                type="text"
                                id="label"
                                className="ons-input ons-input--text ons-input-type__input"
                                name="label"
                                disabled={blockActions}
                                value={label}
                                required
                                onChange={e => setLabel(e.target.value)}
                                label="Label"
                                helpMessage="It will be used to generate the URL"
                            />
                        </div>
                    )}
                    {errors.file || fileError ? (
                        <div
                            className={`ons-panel ${
                                fileError ? "ons-panel--file-error" : "ons-panel--error"
                            } ons-panel--no-title ons-u-mb-s margin-bottom--1" id="error-panel`}
                        >
                            <span className="ons-u-vh">Error: </span>
                            <div className="ons-panel__body">
                                <p className="ons-panel__error">
                                    <strong>{errors.file}</strong>
                                </p>
                                <div className="grid__col-sm-12 grid__col-md-6 grid__col-xl-4">
                                    <Input
                                        type="file"
                                        id="file"
                                        name="file"
                                        accept=".zip,.csv,.ods,.xls"
                                        className="ons-input ons-input--text ons-input-type__input ons-input--upload"
                                        required
                                        fileError={fileError}
                                        disabled={blockActions}
                                        onChange={handleFile}
                                        label="Upload a file"
                                        helpMessage="The file must be a CSV, ODS or Excel format and no larger than 2mb in size."
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="grid__col-sm-12 grid__col-md-6 grid__col-xl-4">
                            <Input
                                type="file"
                                id="file"
                                name="file"
                                accept=".zip,.csv,.ods,.xls"
                                className="ons-input ons-input--text ons-input-type__input ons-input--upload"
                                required
                                onChange={handleFile}
                                disabled={blockActions}
                                label="Upload a file"
                                helpMessage="The zip file must not exceed 2.5gb, contain at least 1 html/htm file, and be without password protection or special characters in the filename."
                            />
                        </div>
                    )}

                    {interactiveId && (
                        <>
                            {errors.msg ? (
                                <div className="ons-panel ons-panel--error ons-panel--no-title ons-u-mb-s" id="error-panel">
                                    <span className="ons-u-vh">Error: </span>
                                    <div className="ons-panel__body">
                                        <p className="ons-panel__error">
                                            <strong>Enter a correct URL</strong>
                                        </p>
                                        <div className="grid__col-sm-12 grid__col-md-6 grid__col-xl-4">
                                            <Input
                                                type="text"
                                                id="url"
                                                className="ons-input ons-input--text ons-input-type__input"
                                                name="url"
                                                disabled={blockActions}
                                                value={url}
                                                required
                                                onChange={e => setUrl(e.target.value)}
                                                label="URL"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid__col-sm-12 grid__col-md-6 grid__col-xl-4">
                                    {interactive.html_files && interactive.html_files.length <= 1 ? (
                                        <Input
                                            type="text"
                                            id="url"
                                            className="ons-input ons-input--text ons-input-type__input"
                                            name="url"
                                            disabled={true}
                                            value={url}
                                            required
                                            onChange={e => setUrl(e.target.value)}
                                            label="URL"
                                        />
                                    ) : (
                                        <Select
                                            contents={mapInteractives(interactive.html_files) || []}
                                            id="urls"
                                            onChange={e => setUrlIndex(e.target.value)}
                                            showDefaultOption="false"
                                            label="URL"
                                            disabled={blockActions}
                                        />
                                    )}
                                </div>
                            )}
                        </>
                    )}
                    <div className="inline-block padding-top--1">
                        {!interactiveId ? (
                            <ButtonWithShadow type="submit" buttonText="Confirm" onClick={onSubmit} disabled={blockActions} isSubmitting={false} />
                        ) : (
                            <div className="inline-block">
                                {editMode ? (
                                    <ButtonWithShadow
                                        type="submit"
                                        buttonText="Save changes"
                                        onClick={onSubmit}
                                        isSubmitting={false}
                                        disabled={blockActions}
                                    />
                                ) : (
                                    <ButtonWithShadow
                                        type="submit"
                                        buttonText="Save and submit for approval"
                                        onClick={onSubmitApproval}
                                        isSubmitting={false}
                                        disabled={blockActions}
                                    />
                                )}

                                <ButtonWithShadow buttonText="Copy all URL's" onClick={copyAllUrls} disabled={blockActions} />

                                <Link
                                    to={`${rootPath}/interactives/show/${interactiveId}?collection=${collectionId}&urlIndex=${urlIndex}`}
                                    style={{ pointerEvents: interactive.state === "ImportSuccess" ? "" : "none" }}
                                    className="ons-btn ons-btn--secondary"
                                    disabled={blockActions}
                                >
                                    <span className="ons-btn__inner">Preview</span>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
