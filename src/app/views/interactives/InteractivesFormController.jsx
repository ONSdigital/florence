import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import {
    createInteractive,
    getInteractive,
    editInteractive,
    deleteInteractive,
    resetInteractiveError
} from "../../actions/interactives";

import { NavbarComponent } from "./components/NavbarComponent";
import { Link } from "react-router";

export class InteractivesFormController extends Component {
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
                    }
                },
            })
        );
        this.state.interactiveId ?
            this.props.editInteractive(this.state.interactiveId, formData) :
            this.props.createInteractive(formData);
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
            <div id="interactivesPage" className="ons-page">
                <div className="ons-page__content">
                    <main className="ons-patternlib-page__body">
                        <NavbarComponent/>
                        <div className="ons-container ons-container--wide">
                            <nav className="ons-breadcrumb" aria-label="Back">
                                <ol className="ons-breadcrumb__items ons-u-fs-s">
                                    <li className="ons-breadcrumb__item" id="breadcrumb-1">
                                        <Link to={`${rootPath}/interactives`} className="ons-breadcrumb__link">Back</Link>
                                        <svg className="ons-svg-icon" viewBox="0 0 8 13"
                                             xmlns="http://www.w3.org/2000/svg" focusable="false" fill="currentColor">
                                            <path d="M5.74,14.28l-.57-.56a.5.5,0,0,1,0-.71h0l5-5-5-5a.5.5,0,0,1,0-.71h0l.57-.56a.5.5,0,0,1,.71,0h0l5.93,5.93a.5.5,0,0,1,0,.7L6.45,14.28a.5.5,0,0,1-.71,0Z"
                                                transform="translate(-5.02 -1.59)"/>
                                        </svg>
                                    </li>
                                </ol>
                            </nav>
                            <h1 className="ons-u-fs-xxl ons-u-mt-l">{!this.state.interactiveId ? "Upload a new interactive" : "Edit an existing interactive"}</h1>

                            {this.state.published &&
                                <div className="ons-panel ons-panel--info ons-panel--no-title">
                                    <span className="ons-u-vh">Important information: </span>
                                    <div className="ons-panel__body"><p>This interactive has been published. You can
                                        only
                                        update the archive file via the upload button below.</p>
                                    </div>
                                </div>
                            }

                            {errors.msg ?
                                <div className="ons-panel ons-panel--error ons-panel--no-title ons-u-mb-s" id="error-panel">
                                    <span className="ons-u-vh">Error: </span>
                                    <div className="ons-panel__body">
                                        <p className="ons-panel__error">
                                            <strong>Enter a correct internal ID</strong>
                                        </p>
                                        <div className="ons-field">
                                            <label className="ons-label" htmlFor="internal_id">Internal ID</label>
                                            <input
                                                type="text"
                                                id="internal_id"
                                                className="ons-input ons-input--text ons-input-type__input"
                                                name="internal_id"
                                                disabled={this.state.isAwaitingResponse}
                                                value={this.state.internal_id}
                                                required
                                                onChange={e => this.setState({ [e.target.name]: e.target.value })}
                                                data-testid="internal-id-input"
                                            />
                                        </div>
                                    </div>
                                </div>
                                :
                                <div className="ons-field" id="title-field">
                                    <label className="ons-label" htmlFor="internal_id">Internal ID</label>
                                    <input
                                        type="text"
                                        id="internal_id"
                                        className="ons-input ons-input--text ons-input-type__input"
                                        name="internal_id"
                                        disabled={this.state.isAwaitingResponse}
                                        value={this.state.internal_id}
                                        required
                                        onChange={e => this.setState({ [e.target.name]: e.target.value })}
                                        data-testid="internal-id-input"
                                    />
                                </div>
                            }

                            {errors.msg ?
                                <div className="ons-panel ons-panel--error ons-panel--no-title ons-u-mb-s" id="error-panel">
                                    <span className="ons-u-vh">Error: </span>
                                    <div className="ons-panel__body">
                                        <p className="ons-panel__error">
                                            <strong>Enter a correct title</strong>
                                        </p>
                                        <div className="ons-field">
                                            <label className="ons-label" htmlFor="title">Title</label>
                                            <input
                                                type="text"
                                                id="title"
                                                className="ons-input ons-input--text ons-input-type__input"
                                                name="title"
                                                disabled={this.state.isAwaitingResponse}
                                                value={this.state.title}
                                                required
                                                onChange={e => this.setState({ [e.target.name]: e.target.value })}
                                                data-testid="title-input"
                                            />
                                        </div>
                                    </div>
                                </div>
                                :
                                <div className="ons-field" id="title-field">
                                    <label className="ons-label" htmlFor="title">Title</label>
                                    <span id="description-hint"
                                          className="ons-label__description  ons-input--with-description">It will help to search for the interactive later</span>
                                    <input
                                        type="text"
                                        id="title"
                                        className="ons-input ons-input--text ons-input-type__input"
                                        name="title"
                                        disabled={this.state.isAwaitingResponse}
                                        value={this.state.title}
                                        required
                                        onChange={e => this.setState({ [e.target.name]: e.target.value })}
                                        data-testid="title-input"
                                    />
                                </div>
                            }

                            {errors.msg ?
                                <div className="ons-panel ons-panel--error ons-panel--no-title ons-u-mb-s" id="error-panel">
                                    <span className="ons-u-vh">Error: </span>
                                    <div className="ons-panel__body">
                                        <p className="ons-panel__error">
                                            <strong>Enter a correct label</strong>
                                        </p>
                                        <div className="ons-field">
                                            <label className="ons-label" htmlFor="label">Label</label>
                                            <input
                                                type="text"
                                                id="label"
                                                className="ons-input ons-input--text ons-input-type__input"
                                                name="label"
                                                disabled={this.state.isAwaitingResponse}
                                                value={this.state.label}
                                                required
                                                onChange={e => this.setState({ [e.target.name]: e.target.value })}
                                                data-testid="label-input"
                                            />
                                        </div>
                                    </div>
                                </div>
                                :
                                <div className="ons-field" id="title-field">
                                    <label className="ons-label" htmlFor="label">Label</label>
                                    <span id="description-hint"
                                          className="ons-label__description  ons-input--with-description">It will be used to generate the URL</span>
                                    <input
                                        type="text"
                                        id="label"
                                        className="ons-input ons-input--text ons-input-type__input"
                                        name="label"
                                        disabled={this.state.isAwaitingResponse}
                                        value={this.state.label}
                                        required
                                        onChange={e => this.setState({ [e.target.name]: e.target.value })}
                                        data-testid="label-input"
                                    />
                                </div>
                            }
                            <div className="ons-field">
                                <div className="ons-field">
                                    <label className="ons-label ons-label--with-description" htmlFor="file">Upload a
                                        file</label>
                                    <span id="description-hint"
                                          className="ons-label__description  ons-input--with-description">Only file type accepted is ZIP</span>
                                    <input
                                        type="file"
                                        id="file"
                                        name="file"
                                        accept=".zip"
                                        className="ons-input ons-input--text ons-input-type__input ons-input--upload"
                                        required
                                        onChange={this.handleFile}
                                        data-testid="file-input"
                                    />
                                </div>
                            </div>

                            {this.state.interactiveId &&
                                <>
                                    {errors.msg ?
                                        <div className="ons-panel ons-panel--error ons-panel--no-title ons-u-mb-s" id="error-panel">
                                            <span className="ons-u-vh">Error: </span>
                                            <div className="ons-panel__body">
                                                <p className="ons-panel__error">
                                                    <strong>Enter a correct URL</strong>
                                                </p>
                                                <div className="ons-field">
                                                    <label className="ons-label" htmlFor="slug">URL</label>
                                                    <input
                                                        type="text"
                                                        id="slug"
                                                        className="ons-input ons-input--text ons-input-type__input"
                                                        name="slug"
                                                        disabled={this.state.isAwaitingResponse}
                                                        value={this.state.slug}
                                                        required
                                                        onChange={e => this.setState({ [e.target.name]: e.target.value })}
                                                        data-testid="slug-input"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        :
                                        <div className="ons-field" id="title-field">
                                            <label className="ons-label" htmlFor="slug">URL</label>
                                            <input
                                                type="text"
                                                id="slug"
                                                className="ons-input ons-input--text ons-input-type__input"
                                                name="slug"
                                                disabled={this.state.isAwaitingResponse}
                                                value={this.state.slug}
                                                required
                                                onChange={e => this.setState({ [e.target.name]: e.target.value })}
                                                data-testid="slug-input"
                                            />
                                        </div>
                                    }
                                </>
                            }

                            {!this.state.interactiveId ?
                                <button
                                    type="submit"
                                    className="ons-btn ons-u-mb-m ons-u-mt-l ons-btn--link ons-js-submit-btn ons-btn--loader ons-js-loader ons-js-submit-btn"
                                    id="button"
                                    onClick={this.onSubmit}
                                >
                                    <span className="ons-btn__inner">Confirm</span>
                                </button>
                                :
                                <>
                                <a
                                    href="#"
                                    role="button"
                                    className="ons-btn ons-u-mb-m ons-u-mt-l ons-btn--link ons-js-submit-btn ons-btn--loader ons-js-loader ons-js-submit-btn"
                                    onClick={this.onSubmit}
                                    data-testid="save-changes-button"
                                >
                                    <span className="ons-btn__inner">Save changes
                                        <svg className="ons-svg-icon ons-u-ml-xs" xmlns="http://www.w3.org/2000/svg" focusable="false"
                                             viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" fill="currentcolor">
                                            <rect x="0" y="0" width="100" height="100" fill="none"></rect>
                                            <rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' transform='rotate(0 50 50) translate(0 -30)'>
                                                <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0s' repeatCount='indefinite'/>
                                            </rect>
                                            <rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' transform='rotate(30 50 50) translate(0 -30)'>
                                                <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.08333333333333333s'
                                                         repeatCount='indefinite'/>
                                            </rect>
                                            <rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' transform='rotate(60 50 50) translate(0 -30)'>
                                                <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.16666666666666666s'
                                                         repeatCount='indefinite'/>
                                            </rect>
                                            <rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' transform='rotate(90 50 50) translate(0 -30)'>
                                                <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.25s' repeatCount='indefinite'/>
                                            </rect>
                                            <rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' transform='rotate(120 50 50) translate(0 -30)'>
                                                <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.3333333333333333s'
                                                         repeatCount='indefinite'/>
                                            </rect>
                                            <rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' transform='rotate(150 50 50) translate(0 -30)'>
                                                <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.4166666666666667s'
                                                         repeatCount='indefinite'/>
                                            </rect>
                                            <rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' transform='rotate(180 50 50) translate(0 -30)'>
                                                <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.5s' repeatCount='indefinite'/>
                                            </rect>
                                            <rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' transform='rotate(210 50 50) translate(0 -30)'>
                                                <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.5833333333333334s'
                                                         repeatCount='indefinite'/>
                                            </rect>
                                            <rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' transform='rotate(240 50 50) translate(0 -30)'>
                                                <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.6666666666666666s'
                                                         repeatCount='indefinite'/>
                                            </rect>
                                            <rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' transform='rotate(270 50 50) translate(0 -30)'>
                                                <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.75s' repeatCount='indefinite'/>
                                            </rect>
                                            <rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' transform='rotate(300 50 50) translate(0 -30)'>
                                                <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.8333333333333334s'
                                                         repeatCount='indefinite'/>
                                            </rect>
                                            <rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' transform='rotate(330 50 50) translate(0 -30)'>
                                                <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.9166666666666666s'
                                                         repeatCount='indefinite'/>
                                            </rect>
                                        </svg>
                                    </span>
                                </a>
                                <a
                                    href="#"
                                    role="button"
                                    className="ons-btn ons-u-mb-m ons-u-mt-l ons-btn--secondary ons-btn--link ons-js-submit-btn ons-btn--loader ons-js-loader ons-js-submit-btn"
                                    data-testid="preview-button"
                                >
                                    <span className="ons-btn__inner">Preview
                                        <svg className="ons-svg-icon ons-u-ml-xs" xmlns="http://www.w3.org/2000/svg" focusable="false"
                                             viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" fill="currentcolor">
                                            <rect x="0" y="0" width="100" height="100" fill="none"></rect>
                                            <rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' transform='rotate(0 50 50) translate(0 -30)'>
                                                <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0s' repeatCount='indefinite'/>
                                            </rect>
                                            <rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' transform='rotate(30 50 50) translate(0 -30)'>
                                                <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.08333333333333333s'
                                                         repeatCount='indefinite'/>
                                            </rect>
                                            <rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' transform='rotate(60 50 50) translate(0 -30)'>
                                                <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.16666666666666666s'
                                                         repeatCount='indefinite'/>
                                            </rect>
                                            <rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' transform='rotate(90 50 50) translate(0 -30)'>
                                                <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.25s' repeatCount='indefinite'/>
                                            </rect>
                                            <rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' transform='rotate(120 50 50) translate(0 -30)'>
                                                <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.3333333333333333s'
                                                         repeatCount='indefinite'/>
                                            </rect>
                                            <rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' transform='rotate(150 50 50) translate(0 -30)'>
                                                <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.4166666666666667s'
                                                         repeatCount='indefinite'/>
                                            </rect>
                                            <rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' transform='rotate(180 50 50) translate(0 -30)'>
                                                <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.5s' repeatCount='indefinite'/>
                                            </rect>
                                            <rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' transform='rotate(210 50 50) translate(0 -30)'>
                                                <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.5833333333333334s'
                                                         repeatCount='indefinite'/>
                                            </rect>
                                            <rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' transform='rotate(240 50 50) translate(0 -30)'>
                                                <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.6666666666666666s'
                                                         repeatCount='indefinite'/>
                                            </rect>
                                            <rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' transform='rotate(270 50 50) translate(0 -30)'>
                                                <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.75s' repeatCount='indefinite'/>
                                            </rect>
                                            <rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' transform='rotate(300 50 50) translate(0 -30)'>
                                                <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.8333333333333334s'
                                                         repeatCount='indefinite'/>
                                            </rect>
                                            <rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' transform='rotate(330 50 50) translate(0 -30)'>
                                                <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.9166666666666666s'
                                                         repeatCount='indefinite'/>
                                            </rect>
                                        </svg>
                                    </span>
                                </a>
                                <button
                                    type="button"
                                    className="ons-btn ons-u-mb-m ons-u-mt-l ons-btn--secondary ons-btn--disabled"
                                    onClick={this.handleDelete}
                                    disabled={this.state.published}
                                >
                                    <span className="ons-btn__inner">Delete interactive</span>
                                </button>
                                </>
                            }
                        </div>
                    </main>
                </div>
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(InteractivesFormController);
