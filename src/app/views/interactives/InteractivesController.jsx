import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { NavbarComponent } from "./components/NavbarComponent";
import {filterInteractives, getInteractives, resetSuccessMessage} from "../../actions/interactives";
import { Link } from "react-router";
import { FooterComponent } from "./components/FooterComponent";

export class InteractivesController extends Component {
    constructor(props) {
        super(props);

        this.state = {
            internal_id: "",
            title: "",
            filter: {},
            successCreate: false,
            successUpdate: false,
        };

        this.handleFilter = this.handleFilter.bind(this);
        this.handleInteractivesOrder = this.handleInteractivesOrder.bind(this);
    }

    static propTypes = {
        rootPath: PropTypes.string.isRequired,
        interactives: PropTypes.array,
        filteredInteractives: PropTypes.array,
        filterInteractives: PropTypes.func.isRequired,
        getInteractives: PropTypes.func.isRequired,
    };

    componentDidMount() {
        this.props.getInteractives();
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.successMessage.success) {
            if (nextProps.successMessage.type === "create") {
                this.state.successCreate = true;
                this.props.resetSuccessMessage();
            }
            if (nextProps.successMessage.type === "update") {
                this.state.successUpdate = true;
                this.props.resetSuccessMessage();
            }
            if (nextProps.successMessage.type === "delete") {
                console.log('delete')
                this.props.resetSuccessMessage();
            }
        }
    }

    handleFilter() {
        let filters = {}
        if(this.state.title !== ''){
            filters = Object.assign({}, filters, {
                label: this.state.title,
            });
        }
        if(this.state.internal_id !== ''){
            filters = Object.assign({}, filters, {
                internal_id: this.state.internal_id
            });
        }
        this.state.filter.filter = JSON.stringify(filters);
        this.props.filterInteractives(this.state.filter);
    }

    handleInteractivesOrder(e) {
        this.state.filter.sortBy = e.target.value;
        this.props.filterInteractives(this.state.filter);
    }

    clearCheckboxes() {
        const checkboxes = document.querySelectorAll("input[type=checkbox]");
        checkboxes.forEach(function (checkbox) {
            checkbox.checked = false;
        });
    }

    render() {
        const { rootPath, filteredInteractives } = this.props;
        return (
            <div id="interactivesPage" className="ons-page">
                <div className="ons-page__content">
                    <main className="ons-patternlib-page__body">
                        <NavbarComponent/>
                        <div className="ons-container ons-container--wide" style={{ marginTop:"30px" }}>
                            {
                                this.state.successCreate &&
                                <div className="ons-panel ons-panel--success ons-panel--no-title" id="success-id" style={{borderLeftColor: "rgb(15, 130, 67)"}}>
                                    <span className="ons-u-vh">Completed: </span>
                                    <span className="ons-panel__icon ons-u-fs-r">
                                       <svg className="ons-svg-icon" viewBox="0 0 13 10" xmlns="http://www.w3.org/2000/svg"
                                            focusable="false" fill="currentColor">
                                          <path
                                              d="M14.35,3.9l-.71-.71a.5.5,0,0,0-.71,0h0L5.79,10.34,3.07,7.61a.51.51,0,0,0-.71,0l-.71.71a.51.51,0,0,0,0,.71l3.78,3.78a.5.5,0,0,0,.71,0h0L14.35,4.6A.5.5,0,0,0,14.35,3.9Z"
                                              transform="translate(-1.51 -3.04)"/>
                                       </svg>
                                    </span>
                                    <div className="ons-panel__body">Interactive has been successfully submitted</div>
                                </div>
                            }
                            {
                                this.state.successUpdate &&
                                <div className="ons-panel ons-panel--success ons-panel--no-title" id="success-id"
                                     style={{borderLeftColor: "rgb(15, 130, 67)"}}>
                                    <span className="ons-u-vh">Completed: </span>
                                    <span className="ons-panel__icon ons-u-fs-r">
                                       <svg className="ons-svg-icon" viewBox="0 0 13 10"
                                            xmlns="http://www.w3.org/2000/svg"
                                            focusable="false" fill="currentColor">
                                          <path
                                              d="M14.35,3.9l-.71-.71a.5.5,0,0,0-.71,0h0L5.79,10.34,3.07,7.61a.51.51,0,0,0-.71,0l-.71.71a.51.51,0,0,0,0,.71l3.78,3.78a.5.5,0,0,0,.71,0h0L14.35,4.6A.5.5,0,0,0,14.35,3.9Z"
                                              transform="translate(-1.51 -3.04)"/>
                                       </svg>
                                    </span>
                                    <div className="ons-panel__body">Interactive has been successfully updated</div>
                                </div>
                            }
                            <div className='ons-grid' style={{marginTop: "5%"}}>
                                <div className='ons-grid__col ons-col-3@m'>
                                    <h3 className="text-left">Filter by</h3>
                                    <div className="ons-field" >
                                        <label
                                            htmlFor="internal_id"
                                            className={"ons-label"}
                                        >Internal ID</label>
                                        <input
                                            type="text"
                                            id="internal_id"
                                            className={"ons-input ons-input--text ons-input-type__input ons-input--w-1@m"}
                                            placeholder=""
                                            name="internal_id"
                                            onChange={e => this.setState({ [e.target.name]: e.target.value })}
                                            data-testid="internal-id-input"
                                        />
                                    </div>
                                    <div className="ons-field" >
                                        <label
                                            htmlFor="title"
                                            className={"ons-label"}
                                        >Title</label>
                                        <input
                                            type="text"
                                            id="title"
                                            className={"ons-input ons-input--text ons-input-type__input ons-input--w-1@m"}
                                            placeholder=""
                                            name="title"
                                            onChange={e => this.setState({ [e.target.name]: e.target.value })}
                                            data-testid="title-input"
                                        />
                                    </div>
                                    <fieldset className="ons-fieldset">
                                        <legend className="ons-fieldset__legend">Interactive type</legend>
                                        <div className="ons-checkboxes__items">
                                            <span className="ons-checkboxes__item ons-checkboxes__item--no-border">
                                                <span className="ons-checkbox ons-checkbox--no-border">
                                                    <input
                                                        type="checkbox"
                                                        id="data"
                                                        className="ons-checkbox__input ons-js-checkbox "
                                                        value="data"
                                                        data-testid="data-input"
                                                    />
                                                    <label
                                                        className="ons-checkbox__label"
                                                        htmlFor="data" id="data-label"
                                                    >Embeddable (25)</label>
                                                </span>
                                            </span>
                                            <br/>
                                            <span className="ons-checkboxes__item ons-checkboxes__item--no-border">
                                                <span className="ons-checkbox ons-checkbox--no-border">
                                                    <input
                                                        type="checkbox"
                                                        id="publications"
                                                        className="ons-checkbox__input ons-js-checkbox  ons-js-other ons-js-select-all-children"
                                                        value="publications"
                                                        data-testid="publications-input"
                                                    />
                                                    <label
                                                        className="ons-checkbox__label"
                                                        htmlFor="publications"
                                                        id="publications-label"
                                                    >Full-feature (0)</label>
                                                    <span className="ons-checkbox__other" id="publications-other-wrap">
                                                        <fieldset className="ons-fieldset ons-js-other-fieldset">
                                                            <label className="ons-label" htmlFor="select">Primary topic</label>
                                                            <select id="select" name="select" className="ons-input ons-input--select" style={{width:"100%"}}>
                                                              <option value="" selected disabled>Select an option</option>
                                                              <option value="general">General</option>
                                                              <option value="people-who-live-here">People who live here</option>
                                                              <option value="visitors">Visitors</option>
                                                              <option value="household-accommodation">Household and accommodation</option>
                                                              <option value="personal-details">Personal details</option>
                                                              <option value="health">Health</option>
                                                              <option value="qualifications">Qualifications</option>
                                                              <option value="employment">Employment</option>
                                                            </select>
                                                        </fieldset>
                                                        <fieldset className="ons-fieldset ons-js-other-fieldset">
                                                            <label className="ons-label" htmlFor="select">Data source</label>
                                                            <select id="select" name="select" className="ons-input ons-input--select" style={{ width : "100%" }}>
                                                              <option value="" selected disabled>Select an option</option>
                                                              <option value="general">General</option>
                                                              <option value="people-who-live-here">People who live here</option>
                                                              <option value="visitors">Visitors</option>
                                                              <option value="household-accommodation">Household and accommodation</option>
                                                              <option value="personal-details">Personal details</option>
                                                              <option value="health">Health</option>
                                                              <option value="qualifications">Qualifications</option>
                                                              <option value="employment">Employment</option>
                                                            </select>
                                                        </fieldset>
                                                    </span>
                                                  </span>
                                            </span>
                                        </div>
                                    </fieldset>
                                    <div className="ons-u-mb-m" style={{marginTop:"20px"}}>
                                        <button
                                            type="button"
                                            className="ons-btn ons-btn--small"
                                            onClick={this.handleFilter}
                                            data-testid="apply-button"
                                        >
                                            <span className="ons-btn__inner">Apply</span>
                                        </button>
                                        <button
                                            type="button"
                                            className="ons-btn ons-btn--secondary ons-btn--small"
                                            onClick={this.clearCheckboxes}
                                            data-testid="reset-all-button"
                                        >
                                            <span className="ons-btn__inner">Reset all</span>
                                        </button>
                                    </div>
                                </div>
                                <div className='ons-grid__col ons-col-1@m'/>
                                <div className='ons-grid__col ons-col-6@m'>
                                    <div className='head ons-u-mb-m' style={{ display : "flex", justifyContent: "space-between"}}>
                                        <div className="ons-field ons-field--inline">
                                            <label className="ons-label" htmlFor="sort">Sort by</label>
                                            <select
                                                name="sort"
                                                id="sort"
                                                className="ons-input ons-input--select ons-u-wa--@xxs"
                                                onChange={this.handleInteractivesOrder}
                                            >
                                                <option value="desc">Latest published</option>
                                                <option value="asc">Title</option>
                                            </select>
                                        </div>
                                        <Link to={`${rootPath}/interactives/create`}
                                            role="button"
                                            className="ons-btn ons-btn--secondary ons-btn--small ons-btn--link ons-js-submit-btn"
                                            data-testid="upload-interactive-button"
                                        >
                                            <span className="ons-btn__inner">
                                                    Upload interactive
                                            </span>
                                        </Link>
                                    </div>
                                    <div
                                        className="content-list"
                                        data-testid="interactives-content-list"
                                    >
                                        {
                                            filteredInteractives.map(interactive => {
                                                const { id, metadata, published } = interactive
                                                return (
                                                    <article className="ons-article" style={{borderTop: "none", margin: "0 0 0", padding: "0 0 0"}}>
                                                        <div className="ons-article__content">
                                                            <h4 className="ons-article__heading">
                                                            <span className={`ons-status ons-status--small ${published ? 'ons-status--success' : 'ons-status--error'}`} title="Published"/>
                                                                <Link to={`${rootPath}/interactives/edit/${id}`}>
                                                                    {metadata.label}
                                                                </Link>
                                                                - <time dateTime="2020-05-20">16 March 2022</time>
                                                            </h4>
                                                        </div>
                                                    </article>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <FooterComponent />
                    </main>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    rootPath: state.state.rootPath,
    errors: state.interactives.errors,
    interactives: state.interactives.interactives,
    filteredInteractives: state.interactives.filteredInteractives,
    successMessage: state.interactives.successMessage,
});

const mapDispatchToProps = dispatch => {
    return {
        getInteractives: () => {
            dispatch(getInteractives());
        },
        filterInteractives: filters => {
            dispatch(filterInteractives(filters));
        },
        resetSuccessMessage: () => {
            dispatch(resetSuccessMessage());
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(InteractivesController); 
