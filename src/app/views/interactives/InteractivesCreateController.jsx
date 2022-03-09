import logo from "./../../../img/logo.svg"
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Select from "../../components/Select";
import FileUpload from "../../components/file-upload/FileUpload";

import {createInteractive} from "../../actions/interactives";

export class InteractivesController extends Component {

    static propTypes = {
        createInteractive: PropTypes.func.isRequired,
        rootPath: PropTypes.string.isRequired,
        interactive: PropTypes.object
    };

    static contextTypes = {
        router: PropTypes.object
    }

    constructor(props) {
        super(props);

        this.state = {
            title: '',
            file: {},
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
        console.log('this.state', this.state)
        this.props.createInteractive(this.state)
    }

    handleSubmit = event => {
        event.preventDefault();
    }

    mapValuesToSelectOptions(values) {
        return values.map(value => {
            return { id: value.id, name: value.name };
        });
    }

    render() {
        const logoStyles = {float: "left", position: "absolute", top: "50%", transform: "translateY(-50%)", left: "42px"}
        const wellStyles = {float: "left", color: "#FFFFFF", fontSize : "30px", fontFamily: "Open Sans", fontWeight: '700'}
        const primaryTopics = [
            {id: 1, name: 'Business, industry & trade'},
            {id: 2, name: 'Economy'},
            {id: 3, name: 'Employment and labour market'},
            {id: 4, name: 'People, population & community'}
        ]

        const { errors } = this.props;

        return (
            <div>
                <ul className="global-nav__list" style={{backgroundColor: "#033E58"}}>
                    <li className="global-nav__item" style={logoStyles}>
                        <img src={logo} alt="ONS"/>
                    </li>
                </ul>
                <ul className="global-nav__list" style={{backgroundColor: "#3B7A9E"}}>
                    <li className="global-nav__item" style={wellStyles}>
                        <a className="global-nav__link" href="/florence/collections">Upload Interactive</a>
                    </li>
                </ul>
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
                                                // url={upload.url || null}
                                                // extension={upload.extension || null}
                                                // error={upload.error || null}
                                                // progress={upload.progress >= 0 ? upload.progress : null}
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
                                                contents={this.mapValuesToSelectOptions(primaryTopics)}
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
                                                contents={this.mapValuesToSelectOptions(primaryTopics)}
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
                                                contents={this.mapValuesToSelectOptions(primaryTopics)}
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
    interactive: state.interactives.interactive
});

const mapDispatchToProps = (dispatch) => {
    return {
        createInteractive: (interactive) => {
            dispatch(createInteractive(interactive))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(InteractivesController);
