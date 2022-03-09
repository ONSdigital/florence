import logo from "./../../../img/logo.svg"
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import url from './../../utilities/url'

import Select from "../../components/Select";
import FileUpload from "../../components/file-upload/FileUpload";

import { createInteractive } from "../../actions/interactives";
import { getTaxonomies } from "../../actions/taxonomies";
import { NavbarComponent } from "./components/NavbarComponent";

export class InteractivesCreateController extends Component {

    static propTypes = {
        getTaxonomies: PropTypes.func.isRequired,
        createInteractive: PropTypes.func.isRequired,
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
            // file: {},
            // interactiveFile: {},
            primary: '',
            surveys: '',
            topics: '',
            url: '',
        };

        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(e)
    {
        this.props.createInteractive(this.state)
    }

    componentDidMount() {
        this.props.getTaxonomies()
    }

    handleSubmit = event => {
        event.preventDefault();
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

    render() {
        const surveys = [
            {id: 1, name: 'Survey 1'},
            {id: 2, name: 'Survey 2'},
            {id: 3, name: 'Survey 3'},
            {id: 4, name: 'Survey 4'}
        ]

        const { errors, interactive, taxonomies } = this.props;

        return (
            <div>
                <NavbarComponent>Upload interactive</NavbarComponent>
                <div>
                    <div className="grid font-size--18 padding-top--4">
                        <div className="grid__col-1"/>
                        <div className="grid__col-7">
                            <div className="grid grid--justify-space-around">
                                <div className="grid__col-12">
                                    <form className="form" onSubmit={this.handleSubmit}>
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
                                                // value={errors.value}
                                                onChange={(e) => this.setState({[e.target.name]: e.target.value})}
                                            />
                                        </div>
                                        <div className={`form__input form__input__panel ${errors.file ? "form__input--error__panel": ""}`}>
                                            {errors.file && <span>Enter a correct title</span>}
                                            <label className="form__label" htmlFor="team-name">
                                                Interactive file
                                            </label>
                                            <span>File needs to be in .zip format</span>
                                            <FileUpload
                                                label="File upload"
                                                type="file"
                                                id="file"
                                                accept=".zip"
                                                name="file"
                                                url={interactive.url || null}
                                                extension={interactive.extension || null}
                                                error={interactive.error || null}
                                                progress={interactive.progress >= 0 ? interactive.progress : null}
                                                onChange={(e) => this.setState({[e.target.name]: e.target.value})}
                                                onRetry={this.handleRetryClick}
                                            />
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
                                                // error={this.state.editionError}
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
                                                // error={this.state.editionError}
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
                                                // value={errors.value}
                                                onChange={(e) => this.setState({[e.target.name]: e.target.value})}
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="btn btn--success"
                                            disabled={this.state.isAwaitingResponse}
                                            onClick={this.onSubmit}
                                        >
                                            Create
                                        </button>
                                        <button className="btn btn--secondary padding-left--1" disabled={this.state.isAwaitingResponse}>
                                            Cancel
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    rootPath: state.state.rootPath,
    errors: state.interactives.errors,
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
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(InteractivesCreateController);
