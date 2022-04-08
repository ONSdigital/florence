import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { filterInteractives, getInteractives, resetSuccessMessage } from "../../actions/interactives";
import { Link } from "react-router";
import AlertSuccess from "../../components/alert/AlertSuccess";
import FooterAndHeaderLayout from "../../components/layout/FooterAndHeaderLayout";
import Input from "../../components/Input";
import Select from "../../components/Select";
import ButtonWithShadow from "../../components/button/ButtonWithShadow";
import Checkbox from "../../components/Checkbox";

export class InteractivesIndex extends Component {
    constructor(props) {
        super(props);

        this.state = {
            internal_id: "",
            title: "",
            filter: {},
            successCreate: false,
            successUpdate: false,
            successDelete: false,
            showSelects: true,
        };

        this.handleFilter = this.handleFilter.bind(this);
        this.handleInteractivesOrder = this.handleInteractivesOrder.bind(this);
        this.showSelects = this.showSelects.bind(this);
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
                this.state.successDelete = true;
                this.props.resetSuccessMessage();
            }
        }
    }

    handleFilter() {
        let filters = {};
        if (this.state.title !== "") {
            filters = Object.assign({}, filters, {
                label: this.state.title,
            });
        }
        if (this.state.internal_id !== "") {
            filters = Object.assign({}, filters, {
                internal_id: this.state.internal_id,
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

    showSelects() {
        this.state.showSelects = !this.state.showSelects;
    }

    render() {
        const { rootPath, filteredInteractives } = this.props;

        const topics = [
            { id: 1, name: "General" },
            { id: 2, name: "People who live here" },
            { id: 3, name: "Visitors" },
            { id: 4, name: "Household and accommodation" },
            { id: 5, name: "Personal details" },
            { id: 6, name: "Health" },
            { id: 7, name: "Qualifications" },
            { id: 8, name: "Employment" },
        ];

        const sortOptions = [
            { id: 1, name: "Latest published" },
            { id: 2, name: "Title" },
        ];

        const dataSources = topics;

        return (
            <FooterAndHeaderLayout>
                <div className="grid grid--justify-space-around padding-bottom--2">
                    <div className={"grid__col-sm-12 grid__col-md-10 grid__col-xlg-8"}>
                        {this.state.successCreate && <AlertSuccess text="Interactive has been successfully submitted" />}
                        {this.state.successUpdate && <AlertSuccess text="Interactive has been successfully updated" />}
                        {this.state.successDelete && <AlertSuccess text="Interactive has been successfully deleted" />}
                        <div className="grid grid--justify-space-around margin-top--1">
                            <div className={"grid__col-sm-12 grid__col-md-3"}>
                                <h3 className="text-left">Filter by</h3>
                                <Input
                                    type="text"
                                    id="internal_id"
                                    placeholder=""
                                    name="internal_id"
                                    onChange={e => this.setState({ [e.target.name]: e.target.value })}
                                    label="Internal ID"
                                />
                                <Input
                                    type="text"
                                    id="title"
                                    placeholder=""
                                    name="title"
                                    onChange={e => this.setState({ [e.target.name]: e.target.value })}
                                    data-testid="title-input"
                                    label="Title"
                                />
                                <fieldset className="ons-fieldset">
                                    <legend className="ons-fieldset__legend">Interactive type</legend>
                                    <div className="ons-checkboxes__items">
                                        <span className="ons-checkboxes__item ons-checkboxes__item--no-border">
                                            <Checkbox value="embeddable" label="Embeddable (25)" id="embeddable" />
                                        </span>
                                        <span className="ons-checkboxes__item ons-checkboxes__item--no-border">
                                            <Checkbox value="full-feature" label="Full-feature (0)" id="full-feature" onChange={this.showSelects} />
                                            {this.state.showSelects && (
                                                <span className="ons-checkbox__other" id="publications-other-wrap">
                                                    <Select contents={topics} label="Primary topic" id="topics" />
                                                    <Select contents={dataSources} label="Data source" id="data-source" />
                                                </span>
                                            )}
                                        </span>
                                    </div>
                                </fieldset>
                                <div className="inline-block margin-top--2">
                                    <ButtonWithShadow type="button" buttonText="Apply" onClick={this.handleFilter} isSubmitting={false} />
                                    <ButtonWithShadow
                                        type="button"
                                        buttonText="Reset all"
                                        class="secondary"
                                        onClick={this.clearCheckboxes}
                                        isSubmitting={false}
                                    />
                                </div>
                            </div>
                            <div className={"grid__col-sm-12 grid__col-md-6"}>
                                <div className="grid--justify-space-between" style={{ display: "flex" }}>
                                    <div className="grid--align-center" style={{ display: "flex" }}>
                                        <label className="ons-label padding-right--1" htmlFor="sort-options">
                                            Sort by
                                        </label>
                                        <Select contents={sortOptions} id="sort-options" />
                                    </div>
                                    <div className="">
                                        <ButtonWithShadow
                                            type="button"
                                            buttonText="Upload interactive"
                                            class="secondary"
                                            onClick={() => this.props.router.push(`${rootPath}/interactives/create`)}
                                            isSubmitting={false}
                                        />
                                    </div>
                                </div>
                                <ul className="list--neutral" role="list">
                                    {filteredInteractives.map((interactive, key) => {
                                        const { id, metadata, published } = interactive;
                                        return (
                                            <li key={key} className="list__item" role="listitem">
                                                <Link to={`${rootPath}/interactives/edit/${id}`} className="font-weight--600">
                                                    {metadata.label}
                                                </Link>
                                                - <b>16 March 2022</b>
                                            </li>
                                        );
                                    })}
                                </ul>
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

export default connect(mapStateToProps, mapDispatchToProps)(InteractivesIndex);
