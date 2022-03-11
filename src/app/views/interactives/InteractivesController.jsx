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
import {toggleInArray} from "./../../utilities/utils"
import {ReactTable} from "./components/ReactTable";
import Magnifier from "../../icons/Magnifier";
import {Link} from "react-router";

export class InteractivesController extends Component {
    constructor(props) {
        super(props);

        this.state = {
            query: '',
            filters: {
                topics: [],
                query: ''
            }
        };

        this.handleFilter = this.handleFilter.bind(this);
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
            return {
                data: [releaseDate, metadata.title, metadata.primary_topic, id],
            }
        })
    }

    handleFilter()
    {
        this.state.filters.query = this.state.query
        this.props.filterInteractives(this.state.filters)
    }

    render() {
        const { rootPath, taxonomies, filteredInteractives } = this.props;

        return (
            <div>
                <NavbarComponent>My visualizations</NavbarComponent>
                <div className="grid grid--justify-space-around">
                    <div className={"grid__col-3"}>
                        <h1 className="text-center">Filters</h1>
                            <div className="search__input-group">
                                <Magnifier classes="search__icon-magnifier" viewBox="0 0 28 28" />
                                <input
                                    type="text"
                                    id="query"
                                    name="query"
                                    placeholder="Search by title"
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
                        <button
                            type="submit"
                            className="btn btn--success"
                            disabled={this.state.isAwaitingResponse}
                            onClick={this.handleFilter}
                        >
                            Apply
                        </button>
                        <button className="btn btn--secondary" disabled={this.state.isAwaitingResponse}>
                            Cancel
                        </button>
                    </div>
                    <div className={"grid__col-5"}>
                        <div className="filterable-table-box padding-top--5">
                            <Link to={`${rootPath}/interactives/create`} activeClassName="selected" className="btn btn--secondary">
                                Upload interactive
                            </Link>
                            <ReactTable data={this.mapInteractivesToTableData(filteredInteractives)}/>
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
