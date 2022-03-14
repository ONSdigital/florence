import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import url from './../../utilities/url'
// import arrowLeft from "../../../img/arrow-left.svg";

import {
    createInteractive,
    getInteractive,
    editInteractive,
    deleteInteractive,
    resetSuccessMessage
} from "../../actions/interactives";

import { getTaxonomies } from "../../actions/taxonomies";
import { NavbarComponent } from "./components/NavbarComponent";
import Select from "../../components/Select";
import {Link} from "react-router";
import {FooterComponent} from "./components/FooterComponent";

export class InteractivesFormController extends Component {

    static propTypes = {
        getTaxonomies: PropTypes.func.isRequired,
        createInteractive: PropTypes.func.isRequired,
        editInteractive: PropTypes.func.isRequired,
        deleteInteractive: PropTypes.func.isRequired,
        getInteractive: PropTypes.func.isRequired,
        resetSuccessMessage: PropTypes.func.isRequired,
        rootPath: PropTypes.string.isRequired,
        interactive: PropTypes.object,
        taxonomies: PropTypes.array.isRequired
    };

    static contextTypes = {
        router: PropTypes.object
    }

    constructor(props) {
        super(props);

        this.state = {
            title: '',
            file: null,
            primary: '',
            surveys: '',
            topics: '',
            url: '',
            interactiveId: null,
        };

        this.onSubmit = this.onSubmit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleFile = this.handleFile.bind(this);
    }

    onSubmit(e)
    {
        e.preventDefault();
        const formData = new FormData();
        formData.append("file", this.state.file);
        formData.append("update", JSON.stringify({
            interactive: {
                id: this.state.interactiveId,
                metadata: {
                    edition: "exercitation aute consectetur irure",
                    meta_description: "ullamco incididunt eu",
                    title: this.state.title,
                    uri: this.state.url,
                    primary_topic: this.state.primary
                }
            }
        }));
        this.state.interactiveId ?
            this.props.editInteractive(this.state.interactiveId, formData) :
            this.props.createInteractive(formData)
    }

    componentDidMount() {
        const { interactiveId } = this.props.params;
        if(interactiveId){
            this.setState({interactiveId: interactiveId})
            this.props.getInteractive(interactiveId)
        }
        this.props.getTaxonomies()
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if(nextProps.successMessage.success){
            const rootPath = this.props.rootPath
            if(nextProps.successMessage.type === "create"){
                this.props.resetSuccessMessage()
                this.props.router.push(`${rootPath}/interactives/index`);
            }
            if(nextProps.successMessage.type === "update"){
                this.props.resetSuccessMessage()
                this.props.router.push(`${rootPath}/interactives/index`);
            }
            if(nextProps.successMessage.type === "delete"){
                this.props.resetSuccessMessage()
                this.props.router.push(`${rootPath}/interactives/index`);
            }
        }
        if(this.props.interactive.metadata){
            const { metadata } = this.props.interactive
            this.state.title = metadata.title
            this.state.primary = metadata.primary_topic
            this.state.surveys = metadata.surveys
            this.state.topics = metadata.topics
            this.state.url = metadata.uri
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

    handleDelete(e)
    {
        e.preventDefault();
        this.props.deleteInteractive(this.state.interactiveId)
    }

    handleFile(e){
        const file = e.target.files[0]
        this.setState({file: file})
    }

    render() {
        const surveys = [
            {id: 1, name: 'Survey 1'},
            {id: 2, name: 'Survey 2'},
            {id: 3, name: 'Survey 3'},
            {id: 4, name: 'Survey 4'}
        ]

        const { errors, interactive, taxonomies, rootPath } = this.props;

        return (
            <div>
                <NavbarComponent>{!this.state.interactiveId ? 'Upload interactive' : 'Edit interactive'}</NavbarComponent>
                <div>
                    <div className="grid font-size--18">
                        <div className="grid__col-1"/>
                        <div className="grid__col-1 padding-top--2 form__back__button">
                        {
                            this.state.interactiveId &&
                                (<Link to={`${rootPath}/interactives/index`} disabled={this.state.isAwaitingResponse}>
                                    <img src="/arrow-left" alt=""/>Back
                                    {/*<img src={arrowLeft} alt=""/>Back*/}
                                </Link>)
                        }
                        </div>
                    </div>
                    <div className={`grid font-size--18 padding-bottom--4 ${this.state.interactiveId ? 'padding-top--2' : 'padding-top--4'}`}>
                        <div className="grid__col-1"/>
                        <div className="grid__col-7">
                            <div className="grid grid--justify-space-around">
                                <div className="grid__col-12">
                                    <form id="interactives-form" className="form" onSubmit={this.handleSubmit}>
                                        <div className={`form__input form__input__panel ${errors.title ? "form__input--error__panel": ""}`}>
                                            {errors.title && <span>Enter a correct title</span>}
                                            <label className="form__label" htmlFor="team-name">
                                                Title
                                            </label>
                                            <input
                                                type="text"
                                                id="title"
                                                className="input"
                                                name="title"
                                                disabled={this.state.isAwaitingResponse}
                                                value={this.state.title}
                                                onChange={(e) => this.setState({[e.target.name]: e.target.value})}
                                            />
                                        </div>
                                        <div className={`form__input form__input__panel ${errors.file ? "form__input--error__panel": ""}`}>
                                            {errors.file && <span>Enter a correct title</span>}
                                            <label className="form__label" htmlFor="file">
                                                Interactive file
                                            </label>
                                            <span className={'file-description'}>File needs to be in .zip format</span>
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
                                                />
                                            </div>
                                        </div>
                                        <div className={`form__input form__input__panel ${errors.primary ? "form__input--error__panel": ""}`}>
                                            {errors.primary && <span>Enter a correct title</span>}
                                            <Select
                                                id="primary"
                                                name="primary"
                                                label="Primary topic"
                                                contents={this.mapTaxonomiesToSelectOptions(taxonomies)}
                                                onChange={(e) => this.setState({[e.target.name]: e.target.value})}
                                                error={this.state.editionError}
                                                selectedOption={this.state.primary}
                                                disabled={this.state.isReadOnly || this.state.isSavingData}
                                            />
                                        </div>
                                        <div className={`form__input form__input__panel ${errors.surveys ? "form__input--error__panel": ""}`}>
                                            {errors.surveys && <span>Enter a correct title</span>}
                                            <Select
                                                id="surveys"
                                                name="surveys"
                                                label="Surveys"
                                                contents={this.mapValuesToSelectOptions(surveys)}
                                                onChange={(e) => this.setState({[e.target.name]: e.target.value})}
                                                error={this.state.editionError}
                                                selectedOption={this.state.surveys}
                                                disabled={this.state.isAwaitingResponse}
                                            />
                                        </div>
                                        <div className={`form__input form__input__panel ${errors.topics ? "form__input--error__panel": ""}`}>
                                            {errors.topics && <span>Enter a correct title</span>}
                                            <Select
                                                id="topics"
                                                name="topics"
                                                label="Topics"
                                                contents={this.mapTaxonomiesToSelectOptions(taxonomies)}
                                                onChange={(e) => this.setState({[e.target.name]: e.target.value})}
                                                error={this.state.editionError}
                                                selectedOption={this.state.topics}
                                                disabled={this.state.isAwaitingResponse}
                                            />
                                        </div>
                                        <div className={`form__input form__input__panel ${errors.url ? "form__input--error__panel": ""}`}>
                                            <label className="form__label" htmlFor="team-name">
                                                URL
                                            </label>
                                            {errors.url && <span>Enter a correct title</span>}
                                            <input
                                                type="text"
                                                id="url"
                                                className="input"
                                                name="url"
                                                disabled={this.state.isAwaitingResponse}
                                                value={this.state.url}
                                                onChange={(e) => this.setState({[e.target.name]: e.target.value})}
                                            />
                                        </div>
                                        <div className={"form__button__panel padding-top--1"}>
                                            {
                                                !this.state.interactiveId ?
                                                    <button
                                                        type="submit"
                                                        className="btn btn--success"
                                                        disabled={this.state.isAwaitingResponse}
                                                        onClick={this.onSubmit}
                                                    >
                                                        Create
                                                    </button>
                                                    :
                                                    <button
                                                        type="submit"
                                                        className="btn btn--success"
                                                        disabled={this.state.isAwaitingResponse}
                                                        onClick={this.onSubmit}
                                                    >
                                                        Save and preview
                                                    </button>
                                            }
                                            {
                                                !this.state.interactiveId ?
                                                    <Link to={`${rootPath}/interactives/index`} className="btn btn--secondary padding-left--1"  disabled={this.state.isAwaitingResponse}>
                                                        Cancel
                                                    </Link>
                                                    :
                                                    <button
                                                        className="btn btn--secondary padding-left--1"
                                                        disabled={this.state.isAwaitingResponse}
                                                        onClick={this.handleDelete}
                                                    >
                                                        Delete interactive
                                                    </button>
                                            }
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <FooterComponent/>
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

const mapDispatchToProps = (dispatch) => {
    return {
        getTaxonomies: () => {
            dispatch(getTaxonomies())
        },
        createInteractive: (interactive) => {
            dispatch(createInteractive(interactive))
        },
        getInteractive: (interactiveId) => {
            dispatch(getInteractive(interactiveId))
        },
        editInteractive: (interactiveId, interactive) => {
            dispatch(editInteractive(interactiveId, interactive))
        },
        deleteInteractive: (interactiveId) => {
            dispatch(deleteInteractive(interactiveId))
        },
        resetSuccessMessage: () => {
            dispatch(resetSuccessMessage())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(InteractivesFormController);
