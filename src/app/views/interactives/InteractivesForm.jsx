import React, { useEffect, useState } from "react";

import { createInteractive, getInteractive, editInteractive, resetInteractiveError } from "../../actions/interactives";

import BackButton from "../../components/back-button";
import Input from "../../components/Input";
import ButtonWithShadow from "../../components/button/ButtonWithShadow";
import FooterAndHeaderLayout from "../../components/layout/FooterAndHeaderLayout";
import { useDispatch, useSelector } from "react-redux";

export default function InteractivesForm(props) {
    const dispatch = useDispatch();
    const { successMessage, interactive, errors } = useSelector(state => state.interactives);
    const { rootPath } = useSelector(state => state.state);

    const [internalId, setInternalId] = useState("");
    const [title, setTitle] = useState("");
    const [label, setLabel] = useState("");
    const [file, setFile] = useState(null);
    const [slug, setSlug] = useState("");
    const [interactiveId, setInteractiveId] = useState("");
    const [published, setPublished] = useState(false);

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
            setSlug("");
            setInteractiveId("");
            setPublished(false);
        }
        dispatch(resetInteractiveError());
    }, []);

    useEffect(() => {
        if (interactive.metadata) {
            const { metadata } = interactive;
            setInternalId(metadata.internal_id);
            setTitle(metadata.title);
            setLabel(metadata.label);
            setSlug(metadata.slug);
            setPublished(metadata.published);
        }
    }, [interactive]);

    useEffect(() => {
        if (successMessage.success) {
            if (successMessage.type === "create") {
                props.router.push(`${rootPath}/interactives`);
            }
            if (successMessage.type === "update") {
                props.router.push(`${rootPath}/interactives`);
            }
        }
    }, [successMessage]);

    const onSubmit = e => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("file", file);
        formData.append(
            "update",
            JSON.stringify({
                interactive: {
                    id: interactiveId,
                    metadata: {
                        internal_id: internalId,
                        title: title,
                        label: label,
                        slug: slug,
                    },
                },
            })
        );
        interactiveId ? dispatch(editInteractive(interactiveId, formData)) : dispatch(createInteractive(formData));
    };

    const handleDelete = e => {
        e.preventDefault();
        props.router.push(`${rootPath}/interactives/delete/${interactiveId}`);
    };

    const handleFile = e => {
        const file = e.target.files[0];
        setFile(file);
    };

    return (
        <FooterAndHeaderLayout title="Manage my interactives">
            <div className="grid grid--justify-space-around padding-bottom--2">
                <div className={"grid__col-sm-12 grid__col-md-10 grid__col-xlg-8"}>
                    <BackButton redirectUrl={`${rootPath}/interactives`} classNames={"ons-breadcrumb__item"} />

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
                    <div className="grid__col-sm-11 grid__col-md-6 grid__col-xl-4">
                        {errors.msg ? (
                            <div className="ons-panel ons-panel--error ons-panel--no-title ons-u-mb-s" id="error-panel">
                                <span className="ons-u-vh">Error: </span>
                                <div className="ons-panel__body">
                                    <p className="ons-panel__error">
                                        <strong>Enter a correct internal ID</strong>
                                    </p>
                                    <Input
                                        type="text"
                                        id="internal_id"
                                        className="ons-input ons-input--text ons-input-type__input"
                                        name="internal_id"
                                        disabled={props.isAwaitingResponse}
                                        value={internalId}
                                        error={""}
                                        required
                                        onChange={e => setInternalId(e.target.value)}
                                        label="Internal ID"
                                    />
                                </div>
                            </div>
                        ) : (
                            <Input
                                type="text"
                                id="internal_id"
                                className="ons-input ons-input--text ons-input-type__input"
                                name="internal_id"
                                disabled={props.isAwaitingResponse}
                                value={internalId}
                                error={""}
                                required
                                onChange={e => setInternalId(e.target.value)}
                                label="Internal ID"
                            />
                        )}
                        {errors.msg ? (
                            <div className="ons-panel ons-panel--error ons-panel--no-title ons-u-mb-s" id="error-panel">
                                <span className="ons-u-vh">Error: </span>
                                <div className="ons-panel__body">
                                    <p className="ons-panel__error">
                                        <strong>Enter a correct title</strong>
                                    </p>
                                    <Input
                                        type="text"
                                        id="title"
                                        className="ons-input ons-input--text ons-input-type__input"
                                        name="title"
                                        disabled={props.isAwaitingResponse}
                                        value={title}
                                        required
                                        onChange={e => setTitle(e.target.value)}
                                        label="Title"
                                        help="It will help to search for the interactive later"
                                    />
                                </div>
                            </div>
                        ) : (
                            <Input
                                type="text"
                                id="title"
                                className="ons-input ons-input--text ons-input-type__input"
                                name="title"
                                disabled={props.isAwaitingResponse}
                                value={title}
                                required
                                onChange={e => setTitle(e.target.value)}
                                label="Title"
                                helpMessage="It will help to search for the interactive later"
                            />
                        )}
                        {errors.msg ? (
                            <div className="ons-panel ons-panel--error ons-panel--no-title ons-u-mb-s" id="error-panel">
                                <span className="ons-u-vh">Error: </span>
                                <div className="ons-panel__body">
                                    <p className="ons-panel__error">
                                        <strong>Enter a correct label</strong>
                                    </p>
                                    <Input
                                        type="text"
                                        id="label"
                                        className="ons-input ons-input--text ons-input-type__input"
                                        name="label"
                                        disabled={props.isAwaitingResponse}
                                        value={label}
                                        required
                                        onChange={e => setLabel(e.target.value)}
                                        label="Label"
                                        helpMessage="It will be used to generate the URL"
                                    />
                                </div>
                            </div>
                        ) : (
                            <Input
                                type="text"
                                id="label"
                                className="ons-input ons-input--text ons-input-type__input"
                                name="label"
                                disabled={props.isAwaitingResponse}
                                value={label}
                                required
                                onChange={e => setLabel(e.target.value)}
                                label="Label"
                                helpMessage="It will be used to generate the URL"
                            />
                        )}
                        <Input
                            type="file"
                            id="file"
                            name="file"
                            accept=".zip"
                            className="ons-input ons-input--text ons-input-type__input ons-input--upload"
                            required
                            onChange={handleFile}
                            label="Upload a file"
                            helpMessage="Only file type accepted is ZIP"
                        />
                        {interactiveId && (
                            <>
                                {errors.msg ? (
                                    <div className="ons-panel ons-panel--error ons-panel--no-title ons-u-mb-s" id="error-panel">
                                        <span className="ons-u-vh">Error: </span>
                                        <div className="ons-panel__body">
                                            <p className="ons-panel__error">
                                                <strong>Enter a correct URL</strong>
                                            </p>
                                            <Input
                                                type="text"
                                                id="slug"
                                                className="ons-input ons-input--text ons-input-type__input"
                                                name="slug"
                                                disabled={props.isAwaitingResponse}
                                                value={slug}
                                                required
                                                onChange={e => setSlug(e.target.value)}
                                                label="URL"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <Input
                                        type="text"
                                        id="slug"
                                        className="ons-input ons-input--text ons-input-type__input"
                                        name="slug"
                                        disabled={true}
                                        value={slug}
                                        required
                                        onChange={e => setSlug(e.target.value)}
                                        label="URL"
                                    />
                                )}
                            </>
                        )}
                        <div className={"inline-block padding-top--1"}>
                            {!interactiveId ? (
                                <ButtonWithShadow type="submit" buttonText="Confirm" onClick={onSubmit} isSubmitting={false} />
                            ) : (
                                <div className="inline-block">
                                    <ButtonWithShadow type="submit" buttonText="Save changes" onClick={onSubmit} isSubmitting={false} />
                                    <ButtonWithShadow
                                        type="button"
                                        buttonText="Preview"
                                        class="secondary"
                                        onClick={() => console.log()}
                                        isSubmitting={false}
                                    />
                                    <ButtonWithShadow
                                        type="button"
                                        buttonText="Delete interactive"
                                        class="secondary"
                                        onClick={handleDelete}
                                        isSubmitting={false}
                                        disabled={published}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </FooterAndHeaderLayout>
    );
}
