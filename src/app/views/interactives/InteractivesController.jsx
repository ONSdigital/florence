import React, { Component } from "react";
import { connect } from "react-redux";

import {Link} from "react-router";
import {NavbarComponent} from "./components/NavbarComponent";
import interactives from './../../utilities/api-clients/interactives'

const propTypes = {
//     dispatch: PropTypes.func.isRequired,
//     allInteractives: PropTypes.arrayOf(PropTypes.object).isRequired,
//     activeInteractive: PropTypes.object,
//     rootPath: PropTypes.string.isRequired,
//     routes: PropTypes.arrayOf(PropTypes.object).isRequired,
//     userIsAdmin: PropTypes.bool.isRequired,
//     params: PropTypes.object.isRequired,
};

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

    render() {
        const { rootPath } = this.props;

        return (
            <div>
                <NavbarComponent>My visualizations</NavbarComponent>
                <div>
                    <div className="grid grid--justify-space-around">
                        <div className="grid__col-4">
                            <h1>Filters</h1>
                            <div className="selectable-box">
                                <div className="grid"><h2
                                    className="selectable-box__heading grid__col-6 grid__cell">User</h2><h2
                                    className="selectable-box__heading grid__col-6 grid__cell">Email</h2></div>
                                <ul className="selectable-box__list">
                                    <li id="mryan321@gmail.com" className="selectable-box__item   ">
                                        <div className="grid">
                                            <div className="grid__col-6">mryan321</div>
                                            <div className="grid__col-6">mryan321@gmail.com</div>
                                        </div>
                                    </li>
                                    <li id="florence@magicroundabout.ons.gov.uk" className="selectable-box__item   ">
                                        <div className="grid">
                                            <div className="grid__col-6">Florence</div>
                                            <div className="grid__col-6">florence@magicroundabout.ons.gov.uk</div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="grid__col-6">
                            <div className="grid grid--justify-space-around">
                                <div className="grid__col-4">
                                    {/*<button className="btn btn--secondary" type="submit">Upload interactive</button>*/}
                                    <Link to={`${rootPath}/interactives/create`} activeClassName="selected" className="btn btn--secondary">
                                        Upload interactive
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

InteractivesController.propTypes = propTypes;

function mapStateToProps(state) {
    return {
        // activeInteractive: state.state.interactives.active,
        // allInteractives: state.state.interactives.all,
        // userIsAdmin: state.user.isAdmin,
        rootPath: state.state.rootPath,
    };
}

export default connect(mapStateToProps)(InteractivesController);
