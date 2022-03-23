import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import url from "./../../utilities/url";

import {
    createInteractive,
    getInteractive,
    editInteractive,
    deleteInteractive,
    resetSuccessMessage,
    resetInteractiveError
} from "../../actions/interactives";

import { getTaxonomies } from "../../actions/taxonomies";
import { NavbarComponent } from "./components/NavbarComponent";
import Select from "../../components/Select";
import { Link } from "react-router";
import { FooterComponent } from "./components/FooterComponent";

export class InteractivesFormController extends Component {
    static propTypes = {
        params: PropTypes.shape({
            interactiveId: PropTypes.string,
        }),
        getTaxonomies: PropTypes.func.isRequired,
        createInteractive: PropTypes.func.isRequired,
        editInteractive: PropTypes.func.isRequired,
        deleteInteractive: PropTypes.func.isRequired,
        getInteractive: PropTypes.func.isRequired,
        resetSuccessMessage: PropTypes.func.isRequired,
        resetInteractiveError: PropTypes.func.isRequired,
        rootPath: PropTypes.string.isRequired,
        interactive: PropTypes.object,
        errors: PropTypes.object,
        taxonomies: PropTypes.array.isRequired,
    };

    static contextTypes = {
        router: PropTypes.object,
    };

    constructor(props) {
        super(props);

        this.state = {
            title: "",
            file: null,
            primary: "",
            surveys: "",
            topics: "",
            url: "",
            interactiveId: null,
        };

        this.onSubmit = this.onSubmit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleFile = this.handleFile.bind(this);
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
                        edition: "exercitation aute consectetur irure",
                        meta_description: "ullamco incididunt eu",
                        title: this.state.title,
                        uri: this.state.url,
                        primary_topic: this.state.primary,
                    },
                },
            })
        );
        this.state.interactiveId ? this.props.editInteractive(this.state.interactiveId, formData) : this.props.createInteractive(formData);
    }

    componentDidMount() {
        const { interactiveId } = this.props.params;
        if (interactiveId) {
            this.setState({ interactiveId: interactiveId });
            this.props.getInteractive(interactiveId);
        } else {
            this.state = {
                title: "",
                file: null,
                primary: "",
                surveys: "",
                topics: "",
                url: "",
                interactiveId: null,
            };
        }
        this.props.getTaxonomies();
        this.props.resetInteractiveError();
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.successMessage.success) {
            const rootPath = this.props.rootPath;
            if (nextProps.successMessage.type === "create") {
                this.props.resetSuccessMessage();
                this.props.router.push(`${rootPath}/interactives`);
            }
            if (nextProps.successMessage.type === "update") {
                this.props.resetSuccessMessage();
                this.props.router.push(`${rootPath}/interactives`);
            }
            if (nextProps.successMessage.type === "delete") {
                this.props.resetSuccessMessage();
                this.props.router.push(`${rootPath}/interactives`);
            }
        }
        if (this.props.interactive.metadata) {
            const { metadata } = this.props.interactive;
            this.state.title = metadata.title;
            this.state.primary = metadata.primary_topic;
            this.state.surveys = metadata.surveys;
            this.state.topics = metadata.topics;
            this.state.url = metadata.uri;
        }
    }

    mapTaxonomiesToSelectOptions(taxonomies) {
        return taxonomies.map(taxonomy => {
            return { id: url.slug(taxonomy.uri), name: taxonomy.description.title };
        });
    }

    mapValuesToSelectOptions(values) {
        return values.map(value => {
            return { id: value.id, name: value.name };
        });
    }

    handleDelete(e) {
        e.preventDefault();
        this.props.deleteInteractive(this.state.interactiveId);
    }

    handleFile(e) {
        const file = e.target.files[0];
        this.setState({ file: file });
    }

    render() {
        const surveys = [
            { id: 1, name: "Survey 1" },
            { id: 2, name: "Survey 2" },
            { id: 3, name: "Survey 3" },
            { id: 4, name: "Survey 4" },
        ];

        const { errors, taxonomies, rootPath } = this.props;

        return (
            <div>
                <NavbarComponent>{!this.state.interactiveId ? "Upload interactive" : "Edit interactive"}</NavbarComponent>
                <div>
                    <div className="grid font-size--18">
                        <div className="grid__col-1" />
                        <div className="grid__col-sm-12 grid__col-md-7 padding-top--2 interactives__form__back__button">
                            {this.state.interactiveId && (
                                <div>
                                    <Link to={`${rootPath}/interactives`} disabled={this.state.isAwaitingResponse}>
                                        <svg width="8" height="13" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M6.78296 12.6879L7.35296 12.1279C7.44761 12.034 7.50085 11.9062 7.50085 11.7729C7.50085 11.6396 7.44761 11.5118 7.35296 11.4179L2.35296 6.4179L7.35296 1.4179C7.44761 1.32402 7.50085 1.19622 7.50085 1.0629C7.50085 0.92958 7.44761 0.801782 7.35296 0.707899L6.78296 0.147899C6.68907 0.0532428 6.56127 0 6.42796 0C6.29464 0 6.16684 0.0532428 6.07296 0.147899L0.142955 6.0779C-0.047616 6.27232 -0.047616 6.58348 0.142955 6.7779L6.07296 12.6879C6.16684 12.7826 6.29464 12.8358 6.42796 12.8358C6.56127 12.8358 6.68907 12.7826 6.78296 12.6879Z"
                                                fill="#222222"
                                            />
                                        </svg>
                                        <span>Back</span>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className={`grid font-size--18 padding-bottom--4 ${this.state.interactiveId ? "padding-top--2" : "padding-top--4"}`}>
                        <div className="grid__col-1" />
                        <div className="grid__col-sm-12 grid__col-md-7">
                            <div className="grid grid--justify-space-around">
                                <div className="grid__col-12">
                                    <form id="interactives-form" className="form" onSubmit={this.handleSubmit} data-testid="interactive-form">
                                        <div className={`form__input form__input__panel ${errors.title ? "form__input--error__panel" : ""}`}>
                                            {errors.title && <span>Enter a correct title</span>}
                                            <label className="form__label" htmlFor="title">
                                                Title
                                            </label>
                                            <input
                                                type="text"
                                                id="title"
                                                className="input"
                                                name="title"
                                                disabled={this.state.isAwaitingResponse}
                                                value={this.state.title}
                                                onChange={e => this.setState({ [e.target.name]: e.target.value })}
                                                data-testid="title-input"
                                            />
                                        </div>
                                        <div
                                            className={`form__input form__input__panel ${
                                                errors.file || errors.msg ? "form__input--error__panel" : ""
                                            }`}
                                        >
                                            {errors.file && <span>Upload a correct file</span>}
                                            {errors.msg && <span> Upload a correct file </span>}
                                            <label className="form__label" htmlFor="file">
                                                Interactive file
                                            </label>
                                            <span className={"file-description"}>File needs to be in .zip format</span>
                                            <div className="button-wrap">
                                                <label className="button" htmlFor="file">
                                                    Choose file
                                                </label>
                                                <input
                                                    type="file"
                                                    id="file"
                                                    name="file"
                                                    className="input"
                                                    onChange={this.handleFile}
                                                    data-testid="file-input"
                                                />
                                            </div>
                                        </div>
                                        <div className={`form__input form__input__panel ${errors.primary ? "form__input--error__panel" : ""}`}>
                                            {errors.primary && <span>Select a primary topic</span>}
                                            <Select
                                                id="primary"
                                                name="primary"
                                                label="Primary topic"
                                                contents={this.mapTaxonomiesToSelectOptions(taxonomies)}
                                                onChange={e => this.setState({ [e.target.name]: e.target.value })}
                                                error={this.state.editionError}
                                                selectedOption={this.state.primary}
                                                disabled={this.state.isReadOnly || this.state.isSavingData}
                                                data-testid="primary-input"
                                            />
                                        </div>
                                        <div className={`form__input form__input__panel ${errors.surveys ? "form__input--error__panel" : ""}`}>
                                            {errors.surveys && <span>Select surveys</span>}
                                            <Select
                                                id="surveys"
                                                name="surveys"
                                                label="Surveys"
                                                contents={this.mapValuesToSelectOptions(surveys)}
                                                onChange={e => this.setState({ [e.target.name]: e.target.value })}
                                                error={this.state.editionError}
                                                selectedOption={this.state.surveys}
                                                disabled={this.state.isAwaitingResponse}
                                                data-testid="surveys-input"
                                            />
                                        </div>
                                        <div className={`form__input form__input__panel ${errors.topics ? "form__input--error__panel" : ""}`}>
                                            {errors.topics && <span>Select topics</span>}
                                            <Select
                                                id="topics"
                                                name="topics"
                                                label="Topics"
                                                contents={this.mapTaxonomiesToSelectOptions(taxonomies)}
                                                onChange={e => this.setState({ [e.target.name]: e.target.value })}
                                                error={this.state.editionError}
                                                selectedOption={this.state.topics}
                                                disabled={this.state.isAwaitingResponse}
                                                data-testid="topics-input"
                                            />
                                        </div>
                                        <div className={`form__input form__input__panel ${errors.url ? "form__input--error__panel" : ""}`}>
                                            <label className="form__label" htmlFor="url">
                                                URL
                                            </label>
                                            {errors.url && <span>Enter a correct url</span>}
                                            <input
                                                type="text"
                                                id="url"
                                                className="input"
                                                name="url"
                                                disabled={this.state.isAwaitingResponse}
                                                value={this.state.url}
                                                onChange={e => this.setState({ [e.target.name]: e.target.value })}
                                                data-testid="url-input"
                                            />
                                        </div>
                                        <div className={"form__button__panel padding-top--1"}>
                                            {!this.state.interactiveId ? (
                                                <button
                                                    type="submit"
                                                    className="btn btn--success"
                                                    disabled={this.state.isAwaitingResponse}
                                                    onClick={this.onSubmit}
                                                >
                                                    Create
                                                </button>
                                            ) : (
                                                <button
                                                    type="submit"
                                                    className="btn btn--success"
                                                    disabled={this.state.isAwaitingResponse}
                                                    onClick={this.onSubmit}
                                                >
                                                    Save and preview
                                                </button>
                                            )}
                                            {!this.state.interactiveId ? (
                                                <Link
                                                    to={`${rootPath}/interactives`}
                                                    className="btn btn--secondary padding-left--1"
                                                    disabled={this.state.isAwaitingResponse}
                                                    data-testid="cancel-button"
                                                >
                                                    Cancel
                                                </Link>
                                            ) : (
                                                <button
                                                    className="btn btn--secondary padding-left--1"
                                                    disabled={this.state.isAwaitingResponse}
                                                    onClick={this.handleDelete}
                                                >
                                                    Delete interactive
                                                </button>
                                            )}
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <FooterComponent />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    rootPath: state.state.rootPath,
    errors: state.interactives.errors,
    successMessage: state.interactives.successMessage,
    interactive: state.interactives.interactive,
    taxonomies: state.taxonomies.taxonomies,
});

const mapDispatchToProps = dispatch => {
    return {
        getTaxonomies: () => {
            dispatch(getTaxonomies());
        },
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
        resetSuccessMessage: () => {
            dispatch(resetSuccessMessage());
        },
        resetInteractiveError: () => {
            dispatch(resetInteractiveError());
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(InteractivesFormController);
