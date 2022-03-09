import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import {Link} from "react-router";
import {NavbarComponent} from "./components/NavbarComponent";
import interactives from './../../utilities/api-clients/interactives'
import Search from "../../components/search";
import DoubleSelectableBox from "../../components/selectable-box/double-column/DoubleSelectableBox";
import Create from "../collections/create";
import cookies from "../../utilities/cookies";
import {push} from "react-router-redux";
import {getTaxonomies} from "../../actions/taxonomies";
import {createInteractive} from "../../actions/interactives";
import url from "../../utilities/url";
import DoubleSelectableBoxItem from "../../components/selectable-box/double-column/DoubleSelectableBoxItem";
import clsx from "clsx";
import Sort from "../../components/sort";
import {ReactTable} from "./components/ReactTable";

export class InteractivesController extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isUpdatingAllInteractives: false,
            isUpdatingInteractiveMembers: false,
            drawerIsAnimatable: false,
            clearActiveInteractive: false,
            isEditingInteractive: false,
            isDeletingInteractive: false,
        };
    }

    static propTypes = {
        getTaxonomies: PropTypes.func.isRequired,
        createInteractive: PropTypes.func.isRequired,
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

    render() {
        const { rootPath, taxonomies } = this.props;

        return (
            <div>
                <NavbarComponent>My visualizations</NavbarComponent>
                <div className="grid grid--justify-space-around">
                    <div className={"grid__col-4"}>
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
                                                    <input type="checkbox" value={url.slug(taxonomy.uri)}/>
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
                            onClick={this.onSubmit}
                        >
                            Apply
                        </button>
                        <button className="btn btn--secondary" disabled={this.state.isAwaitingResponse}>
                            Cancel
                        </button>
                    </div>
                    <div>
                        <ReactTable/>
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
