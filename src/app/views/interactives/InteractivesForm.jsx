import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { createInteractive, getInteractive, editInteractive, deleteInteractive, resetInteractiveError } from "../../actions/interactives";

import BackButton from "../../components/back-button";
import Input from "../../components/Input";
import ButtonWithShadow from "../../components/button/ButtonWithShadow";
import FooterAndHeaderLayout from "../../components/layout/FooterAndHeaderLayout";

export class InteractivesForm extends Component {
    static propTypes = {
        params: PropTypes.shape({
            interactiveId: PropTypes.string,
        }),
        createInteractive: PropTypes.func.isRequired,
        editInteractive: PropTypes.func.isRequired,
        deleteInteractive: PropTypes.func.isRequired,
        getInteractive: PropTypes.func.isRequired,
        resetInteractiveError: PropTypes.func.isRequired,
        rootPath: PropTypes.string.isRequired,
        interactive: PropTypes.object,
        errors: PropTypes.object,
    };

    static contextTypes = {
        router: PropTypes.object,
    };

    constructor(props) {
        super(props);

        this.state = {
            internal_id: "",
            title: "",
            label: "",
            file: null,
            slug: "",
            interactiveId: null,
            published: false,
        };

        this.onSubmit = this.onSubmit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleFile = this.handleFile.bind(this);
    }

    componentDidMount() {
        const { interactiveId } = this.props.params;
        if (interactiveId) {
            this.setState({ interactiveId: interactiveId });
            this.props.getInteractive(interactiveId);
        } else {
            this.state = {
                internal_id: "",
                title: "",
                label: "",
                file: null,
                slug: "",
                interactiveId: null,
                published: false,
            };
        }
        this.props.resetInteractiveError();
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.successMessage.success) {
            const rootPath = this.props.rootPath;
            if (nextProps.successMessage.type === "create") {
                this.props.router.push(`${rootPath}/interactives`);
            }
            if (nextProps.successMessage.type === "update") {
                this.props.router.push(`${rootPath}/interactives`);
            }
        }
        if (nextProps.interactive.metadata) {
            const { metadata } = nextProps.interactive;
            this.state.internal_id = metadata.internal_id;
            this.state.title = metadata.title;
            this.state.label = metadata.label;
            this.state.slug = metadata.slug;
            this.state.published = metadata.published;
        }
    }

    onSubmit(e) {
        e.preventDefault();
        const formData = new FormData();
        formData.append("file", this.state.file);
        formData.append(
            "update",
            JSON.stringify({
                interactive: {
                    id: this.state.interactiveId,
                    metadata: {
                        internal_id: this.state.internal_id,
                        title: this.state.title,
                        label: this.state.label,
                        slug: this.state.slug,
                    },
                },
            })
        );
        this.state.interactiveId ? this.props.editInteractive(this.state.interactiveId, formData) : this.props.createInteractive(formData);
    }

    handleDelete(e) {
        const rootPath = this.props.rootPath;
        e.preventDefault();
        this.props.router.push(`${rootPath}/interactives/delete/${this.state.interactiveId}`);
    }

    handleFile(e) {
        const file = e.target.files[0];
        this.setState({ file: file });
    }

    render() {
        const { errors, rootPath } = this.props;
        return (
            <FooterAndHeaderLayout>
                <div className="grid grid--justify-space-around padding-bottom--2">
                    <div className={"grid__col-sm-12 grid__col-md-10 grid__col-xlg-8"}>
                        <BackButton redirectUrl={`${rootPath}/interactives`} classNames={"ons-breadcrumb__item"} />

                        <h1 className="ons-u-fs-xxl ons-u-mt-l">
                            {!this.state.interactiveId ? "Upload a new interactive" : "Edit an existing interactive"}
                        </h1>

                        {this.state.published && (
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
                                            disabled={this.state.isAwaitingResponse}
                                            value={this.state.internal_id}
                                            error={""}
                                            required
                                            onChange={e => this.setState({ [e.target.name]: e.target.value })}
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
                                    disabled={this.state.isAwaitingResponse}
                                    value={this.state.internal_id}
                                    error={""}
                                    required
                                    onChange={e => this.setState({ [e.target.name]: e.target.value })}
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
                                            disabled={this.state.isAwaitingResponse}
                                            value={this.state.title}
                                            required
                                            onChange={e => this.setState({ [e.target.name]: e.target.value })}
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
                                    disabled={this.state.isAwaitingResponse}
                                    value={this.state.title}
                                    required
                                    onChange={e => this.setState({ [e.target.name]: e.target.value })}
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
                                            disabled={this.state.isAwaitingResponse}
                                            value={this.state.label}
                                            required
                                            onChange={e => this.setState({ [e.target.name]: e.target.value })}
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
                                    disabled={this.state.isAwaitingResponse}
                                    value={this.state.label}
                                    required
                                    onChange={e => this.setState({ [e.target.name]: e.target.value })}
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
                                onChange={this.handleFile}
                                label="Upload a file"
                                helpMessage="Only file type accepted is ZIP"
                            />
                            {this.state.interactiveId && (
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
                                                    disabled={this.state.isAwaitingResponse}
                                                    value={this.state.slug}
                                                    required
                                                    onChange={e => this.setState({ [e.target.name]: e.target.value })}
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
                                            value={this.state.slug}
                                            required
                                            onChange={e => this.setState({ [e.target.name]: e.target.value })}
                                            label="URL"
                                        />
                                    )}
                                </>
                            )}
                            <div className={"inline-block padding-top--1"}>
                                {!this.state.interactiveId ? (
                                    <ButtonWithShadow type="submit" buttonText="Confirm" onClick={this.onSubmit} isSubmitting={false} />
                                ) : (
                                    <div className="inline-block">
                                        <ButtonWithShadow type="submit" buttonText="Save changes" onClick={this.onSubmit} isSubmitting={false} />
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
                                            onClick={this.handleDelete}
                                            isSubmitting={false}
                                            disabled={this.state.published}
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
}

const mapStateToProps = state => ({
    rootPath: state.state.rootPath,
    errors: state.interactives.errors,
    successMessage: state.interactives.successMessage,
    interactive: state.interactives.interactive,
});

const mapDispatchToProps = dispatch => {
    return {
        createInteractive: interactive => {
            dispatch(createInteractive(interactive));
        },
        getInteractive: interactiveId => {
            dispatch(getInteractive(interactiveId));
        },
        editInteractive: (interactiveId, interactive) => {
            dispatch(editInteractive(interactiveId, interactive));
        },
        deleteInteractive: interactiveId => {
            dispatch(deleteInteractive(interactiveId));
        },
        resetInteractiveError: () => {
            dispatch(resetInteractiveError());
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(InteractivesForm);
