import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import {NavbarComponent} from "./components/NavbarComponent";
import Search from "../../components/search";
import {getTaxonomies} from "../../actions/taxonomies";
import {createInteractive} from "../../actions/interactives";
import url from "../../utilities/url";
import {toggleInArray} from "./../../utilities/utils"
import {ReactTable} from "./components/ReactTable";

export class InteractivesController extends Component {
    constructor(props) {
        super(props);

        this.state = {
            topics: [],
        };

        this.handleFilter = this.handleFilter.bind(this);
        this.handleTopics = this.handleTopics.bind(this);
    }

    static propTypes = {
        rootPath: PropTypes.string.isRequired,
        interactive: PropTypes.object,
        taxonomies: PropTypes.array.isRequired
    };

    componentDidMount() {
        this.props.getTaxonomies()
    }

    mapTaxonomiesToSelectOptions(taxonomies) {
        return taxonomies.map(taxonomy => {
            return { id: url.slug(taxonomy.uri), name: taxonomy.description.title };
        });
    }

    mapInteractivesToTableData(interactives)
    {
        return interactives.map(interactive => {
            return {
                data: [interactive.id, interactive.file, interactive.metadata1],
            }
        })
    }

    handleFilter()
    {
        console.log('state', this.state)
    }

    render() {
        const { rootPath, taxonomies } = this.props;

        const interactives = [
            {
                "id": 1,
                "file": '/docs/file1.pdf',
                "metadata1": "metadata1 id 1",
                "metadata2": "metadata2 id 1",
                "metadata3": "metadata3 id 1",
            }, {
                "id": 2,
                "file": '/docs/file2.pdf',
                "metadata1": "metadata1 id 2",
                "metadata2": "metadata2 id 2",
                "metadata3": "metadata3 id 2",
            }, {
                "id": 3,
                "file": '/docs/file3.pdf',
                "metadata1": "metadata1 id 3",
                "metadata2": "metadata2 id 3",
                "metadata3": "metadata3 id 3",
            }, {
                "id": 4,
                "file": '/docs/file4.pdf',
                "metadata1": "metadata1 id 4",
                "metadata2": "metadata2 id 4",
                "metadata3": "metadata3 id 4",
            }, {
                "id": 5,
                "file": '/docs/file5.pdf',
                "metadata1": "metadata1 id 5",
                "metadata2": "metadata2 id 5",
                "metadata3": "metadata3 id 5",
            }, {
                "id": 6,
                "file": '/docs/file6.pdf',
                "metadata1": "metadata1 id 6",
                "metadata2": "metadata2 id 6",
                "metadata3": "metadata3 id 6",
            }, {
                "id": 7,
                "file": '/docs/file7.pdf',
                "metadata1": "metadata1 id 7",
                "metadata2": "metadata2 id 7",
                "metadata3": "metadata3 id 7",
            }, {
                "id": 8,
                "file": '/docs/file8.pdf',
                "metadata1": "metadata1 id 8",
                "metadata2": "metadata2 id 8",
                "metadata3": "metadata3 id 8",
            }, {
                "id": 9,
                "file": '/docs/file9.pdf',
                "metadata1": "metadata1 id 9",
                "metadata2": "metadata2 id 9",
                "metadata3": "metadata3 id 9",
            }, {
                "id": 10,
                "file": '/docs/file10.pdf',
                "metadata1": "metadata1 id 10",
                "metadata2": "metadata2 id 10",
                "metadata3": "metadata3 id 10",
            },
            {
                "id": 1,
                "file": '/docs/file1.pdf',
                "metadata1": "metadata1 id 1",
                "metadata2": "metadata2 id 1",
                "metadata3": "metadata3 id 1",
            }, {
                "id": 2,
                "file": '/docs/file2.pdf',
                "metadata1": "metadata1 id 2",
                "metadata2": "metadata2 id 2",
                "metadata3": "metadata3 id 2",
            }, {
                "id": 3,
                "file": '/docs/file3.pdf',
                "metadata1": "metadata1 id 3",
                "metadata2": "metadata2 id 3",
                "metadata3": "metadata3 id 3",
            }, {
                "id": 4,
                "file": '/docs/file4.pdf',
                "metadata1": "metadata1 id 4",
                "metadata2": "metadata2 id 4",
                "metadata3": "metadata3 id 4",
            }, {
                "id": 5,
                "file": '/docs/file5.pdf',
                "metadata1": "metadata1 id 5",
                "metadata2": "metadata2 id 5",
                "metadata3": "metadata3 id 5",
            }, {
                "id": 6,
                "file": '/docs/file6.pdf',
                "metadata1": "metadata1 id 6",
                "metadata2": "metadata2 id 6",
                "metadata3": "metadata3 id 6",
            }, {
                "id": 7,
                "file": '/docs/file7.pdf',
                "metadata1": "metadata1 id 7",
                "metadata2": "metadata2 id 7",
                "metadata3": "metadata3 id 7",
            }, {
                "id": 8,
                "file": '/docs/file8.pdf',
                "metadata1": "metadata1 id 8",
                "metadata2": "metadata2 id 8",
                "metadata3": "metadata3 id 8",
            }, {
                "id": 9,
                "file": '/docs/file9.pdf',
                "metadata1": "metadata1 id 9",
                "metadata2": "metadata2 id 9",
                "metadata3": "metadata3 id 9",
            }, {
                "id": 10,
                "file": '/docs/file10.pdf',
                "metadata1": "metadata1 id 10",
                "metadata2": "metadata2 id 10",
                "metadata3": "metadata3 id 10",
            },
            {
                "id": 1,
                "file": '/docs/file1.pdf',
                "metadata1": "metadata1 id 1",
                "metadata2": "metadata2 id 1",
                "metadata3": "metadata3 id 1",
            }, {
                "id": 2,
                "file": '/docs/file2.pdf',
                "metadata1": "metadata1 id 2",
                "metadata2": "metadata2 id 2",
                "metadata3": "metadata3 id 2",
            }, {
                "id": 3,
                "file": '/docs/file3.pdf',
                "metadata1": "metadata1 id 3",
                "metadata2": "metadata2 id 3",
                "metadata3": "metadata3 id 3",
            }, {
                "id": 4,
                "file": '/docs/file4.pdf',
                "metadata1": "metadata1 id 4",
                "metadata2": "metadata2 id 4",
                "metadata3": "metadata3 id 4",
            }, {
                "id": 5,
                "file": '/docs/file5.pdf',
                "metadata1": "metadata1 id 5",
                "metadata2": "metadata2 id 5",
                "metadata3": "metadata3 id 5",
            }, {
                "id": 6,
                "file": '/docs/file6.pdf',
                "metadata1": "metadata1 id 6",
                "metadata2": "metadata2 id 6",
                "metadata3": "metadata3 id 6",
            }, {
                "id": 7,
                "file": '/docs/file7.pdf',
                "metadata1": "metadata1 id 7",
                "metadata2": "metadata2 id 7",
                "metadata3": "metadata3 id 7",
            }, {
                "id": 8,
                "file": '/docs/file8.pdf',
                "metadata1": "metadata1 id 8",
                "metadata2": "metadata2 id 8",
                "metadata3": "metadata3 id 8",
            }, {
                "id": 9,
                "file": '/docs/file9.pdf',
                "metadata1": "metadata1 id 9",
                "metadata2": "metadata2 id 9",
                "metadata3": "metadata3 id 9",
            }, {
                "id": 10,
                "file": '/docs/file10.pdf',
                "metadata1": "metadata1 id 10",
                "metadata2": "metadata2 id 10",
                "metadata3": "metadata3 id 10",
            },
            {
                "id": 1,
                "file": '/docs/file1.pdf',
                "metadata1": "metadata1 id 1",
                "metadata2": "metadata2 id 1",
                "metadata3": "metadata3 id 1",
            }, {
                "id": 2,
                "file": '/docs/file2.pdf',
                "metadata1": "metadata1 id 2",
                "metadata2": "metadata2 id 2",
                "metadata3": "metadata3 id 2",
            }, {
                "id": 3,
                "file": '/docs/file3.pdf',
                "metadata1": "metadata1 id 3",
                "metadata2": "metadata2 id 3",
                "metadata3": "metadata3 id 3",
            }, {
                "id": 4,
                "file": '/docs/file4.pdf',
                "metadata1": "metadata1 id 4",
                "metadata2": "metadata2 id 4",
                "metadata3": "metadata3 id 4",
            }, {
                "id": 5,
                "file": '/docs/file5.pdf',
                "metadata1": "metadata1 id 5",
                "metadata2": "metadata2 id 5",
                "metadata3": "metadata3 id 5",
            }, {
                "id": 6,
                "file": '/docs/file6.pdf',
                "metadata1": "metadata1 id 6",
                "metadata2": "metadata2 id 6",
                "metadata3": "metadata3 id 6",
            }, {
                "id": 7,
                "file": '/docs/file7.pdf',
                "metadata1": "metadata1 id 7",
                "metadata2": "metadata2 id 7",
                "metadata3": "metadata3 id 7",
            }, {
                "id": 8,
                "file": '/docs/file8.pdf',
                "metadata1": "metadata1 id 8",
                "metadata2": "metadata2 id 8",
                "metadata3": "metadata3 id 8",
            }, {
                "id": 9,
                "file": '/docs/file9.pdf',
                "metadata1": "metadata1 id 9",
                "metadata2": "metadata2 id 9",
                "metadata3": "metadata3 id 9",
            }, {
                "id": 100,
                "file": '/docs/file10.pdf',
                "metadata1": "metadata1 id 10",
                "metadata2": "metadata2 id 10",
                "metadata3": "metadata3 id 10",
            }
        ];

        return (
            <div>
                <NavbarComponent>My visualizations</NavbarComponent>
                <div className="grid grid--justify-space-around">
                    <div className={"grid__col-3"}>
                        <h1 className="text-center">Filters</h1>
                        <Search />
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
                                                        onClick={(e) => this.handleTopics}
                                                        onChange={(e) => this.setState({[e.target.name]: toggleInArray(this.state.topics, e.target.value)})}
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
                            <ReactTable data={this.mapInteractivesToTableData(interactives)}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(InteractivesController);
