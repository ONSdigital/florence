import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import {NavbarComponent} from "./components/NavbarComponent";
import {getTaxonomies} from "../../actions/taxonomies";
import {
    createInteractive,
    filterInteractives,
    getInteractives
} from "../../actions/interactives";
import moment from "moment";
import url from "../../utilities/url";
import {toggleInArray} from "../../utilities/utils"
import {ReactTable} from "./components/ReactTable";
import {Link} from "react-router";
import {FooterComponent} from "./components/FooterComponent";

export class InteractivesController extends Component {
    constructor(props) {
        super(props);

        this.state = {
            query: '',
            filters: {
                topics: [],
                query: '',
                sortBy: 'desc'
            }
        };

        this.handleFilter = this.handleFilter.bind(this);
        this.handleInteractivesOrder = this.handleInteractivesOrder.bind(this);
    }

    static propTypes = {
        rootPath: PropTypes.string.isRequired,
        interactives: PropTypes.array,
        filteredInteractives: PropTypes.array,
        taxonomies: PropTypes.array.isRequired,
        filterInteractives: PropTypes.func.isRequired,
        getTaxonomies: PropTypes.func.isRequired,
        getInteractives: PropTypes.func.isRequired,
    };

    componentDidMount() {
        this.props.getTaxonomies()
        this.props.getInteractives()
    }

    mapTaxonomiesToSelectOptions(taxonomies) {
        return taxonomies.map(taxonomy => {
            return { id: url.slug(taxonomy.uri), name: taxonomy.description.title };
        });
    }

    mapInteractivesToTableData(interactives)
    {
        return interactives.map(interactive => {
            const {id, metadata} = interactive
            const releaseDate = moment(metadata.release_date).format('DD MMMM YYYY')
            const taxonomy = this.props.taxonomies.find(taxonomy => taxonomy.uri === '/'+metadata.primary_topic.replace(/-/g, "/"))
            const taxonomyTitle = taxonomy ? taxonomy.description.title : ''
            return {
                data: [releaseDate, metadata.title, taxonomyTitle, id],
            }
        })
    }

    handleFilter()
    {
        this.state.filters.query = this.state.query
        this.props.filterInteractives(this.state.filters)
    }

    handleInteractivesOrder(e)
    {
        this.state.filters.sortBy = e.target.value
        this.props.filterInteractives(this.state.filters)
    }

    clearCheckboxes()
    {
        const checkboxes = document.querySelectorAll('input[type=checkbox]');
        checkboxes.forEach(function (checkbox){
            checkbox.checked = false
        })
    }

    render() {
        const { rootPath, taxonomies, filteredInteractives } = this.props;

        return (
            <div id="interactives-visualization">
                <NavbarComponent>My visualizations</NavbarComponent>
                <div className="grid grid--justify-space-around padding-top--4 padding-bottom--4">
                    <div id="filters" className={"grid__col-3"}>
                        <h2 className="text-left">Filters</h2>
                        <label htmlFor="query">Title</label>
                        <div className="search__input-group">
                            <input
                                type="text"
                                id="query"
                                placeholder="Search by title"
                                name="query"
                                onChange={(e) => this.setState({[e.target.name]: e.target.value})}
                            />
                        </div>
                        <label htmlFor="">Primary topic</label>
                        <div className="scrollable-box">
                            <ul id="selectable-box" className="scrollable-box__list" data-testid="selectable-box">
                                {
                                    taxonomies.map(taxonomy => {
                                        return (
                                            <li>
                                                <div className="grid">
                                                    <input
                                                        type="checkbox"
                                                        value={url.slug(taxonomy.uri)}
                                                        name="topics"
                                                        onChange={(e) => this.setState({[e.target.name]: toggleInArray(this.state.filters.topics, e.target.value)})}
                                                    />
                                                    <div>{taxonomy.description.title}</div>
                                                </div>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </div>
                        <div className={'grid grid--justify-space-between filter-buttons padding-top--1'}>
                            <button
                                type="submit"
                                className="btn btn--success"
                                disabled={this.state.isAwaitingResponse}
                                onClick={this.handleFilter}
                            >
                                Apply
                            </button>
                            <button className="btn btn--secondary" onClick={this.clearCheckboxes}>
                                Cancel
                            </button>
                        </div>
                    </div>
                    <div id="interactives-table" className={"grid__col-5"}>
                        <div className="filterable-table-box">
                            <div className={"grid grid--justify-space-between filterable-buttons"}>
                                <div className={"sort-filter"}>
                                    <label htmlFor="">Sort by</label>
                                     <select name="sort" id="sort" onChange={this.handleInteractivesOrder}>
                                         <option value="desc">Latest</option>
                                         <option value="asc">Oldest</option>
                                     </select>
                                </div>
                                <Link to={`${rootPath}/interactives/create`} activeClassName="selected" className="btn btn--secondary">
                                    Upload interactive
                                </Link>
                            </div>
                            <ReactTable data={this.mapInteractivesToTableData(filteredInteractives)}/>
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
    interactives: state.interactives.interactives,
    filteredInteractives: state.interactives.filteredInteractives,
    taxonomies: state.taxonomies.taxonomies,
});

const mapDispatchToProps = (dispatch) => {
    return {
        getTaxonomies: () => {
            dispatch(getTaxonomies())
        },
        getInteractives: () => {
            dispatch(getInteractives())
        },
        createInteractive: (interactive) => {
            dispatch(createInteractive(interactive))
        },
        filterInteractives: (filters) => {
            dispatch(filterInteractives(filters))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(InteractivesController);
