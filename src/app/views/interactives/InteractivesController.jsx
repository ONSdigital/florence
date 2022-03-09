import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import PropTypes from "prop-types";

import { updateAllInteractives, updateActiveInteractive, emptyActiveInteractive, updateActiveInteractiveMembers } from "../../config/actions";
import interactives from "../../utilities/api-clients/interactives";
import url from "../../utilities/url";
import notifications from "../../utilities/notifications";
import log from "../../utilities/logging/log";
import logo from "./../../../img/logo.svg"

import SelectableBoxController from "../../components/selectable-box/SelectableBoxController";
import Drawer from "../../components/drawer/Drawer";
import InteractiveCreate from "./interactive-create/InteractiveCreate";
import InteractiveDetails from "./interactive-details/InteractiveDetails";
import InteractiveEditController from "./interactive-edit/InteractiveEditController";
import InteractiveDeleteController from "./interactive-delete/InteractiveDeleteController";
import Modal from "../../components/Modal";
import {Link} from "react-router";

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

    // UNSAFE_componentWillMount() {
    //     this.fetchInteractives();
    // }
    //
    // UNSAFE_componentWillReceiveProps(nextProps) {
    //     // Update with new active interactive
    //     const activeInteractive = nextProps.allInteractives.find(interactive => {
    //         return interactive.path === nextProps.params.interactive;
    //     });
    //     if (activeInteractive && nextProps.activeInteractive.id !== activeInteractive.id) {
    //         this.fetchMembers(activeInteractive.name);
    //
    //         if (!this.props.params.interactive) {
    //             this.setState({ drawerIsAnimatable: true });
    //         }
    //
    //         this.props.dispatch(updateActiveInteractive(activeInteractive));
    //         return;
    //     }
    //
    //     // No active interactive in parameter anymore
    //     if (!nextProps.params.interactive && nextProps.activeInteractive && nextProps.activeInteractive.id) {
    //         this.setState({
    //             drawerIsAnimatable: true,
    //             clearActiveInteractive: true,
    //         });
    //     }
    //
    //     // Open edit interactive modal
    //     if (nextProps.routes[nextProps.routes.length - 1].path === "edit") {
    //         this.setState({ isEditingInteractive: true });
    //     }
    //
    //     // Open delete interactive modal
    //     if (nextProps.routes[nextProps.routes.length - 1].path === "delete") {
    //         this.setState({ isDeletingInteractive: true });
    //     }
    // }
    //
    // shouldComponentUpdate(nextProps, nextState) {
    //     // Allow render because drawer animtation flag has changed
    //     if (this.state.drawerIsAnimatable !== nextState.drawerIsAnimatable) {
    //         return true;
    //     }
    //
    //     // Allow render because the interactive editing modal is being displayed
    //     if (nextProps.routes[nextProps.routes.length - 1].path === "edit" && nextState.isEditingInteractive) {
    //         return true;
    //     }
    //
    //     // Allow render because the interactive editing modal is being displayed
    //     if (nextProps.routes[nextProps.routes.length - 1].path === "delete" && nextState.isDeletingInteractive) {
    //         return true;
    //     }
    //
    //     // Don't update component if all interactives haven't been fetched yet
    //     if (!nextProps.allInteractives) {
    //         return false;
    //     }
    //
    //     // Component is still fetching interactives and we don't have interactives in Redux yet - don't render any changes
    //     if (nextState.isUpdatingAllInteractives && nextProps.allInteractives.length === 0) {
    //         return false;
    //     }
    //
    //     return true;
    // }
    //
    // componentWillUnmount() {
    //     this.props.dispatch(emptyActiveInteractive());
    // }
    //
    // handleDrawerTransitionEnd = () => {
    //     this.setState({ drawerIsAnimatable: false });
    //
    //     if (this.state.clearActiveInteractive) {
    //         this.setState({ clearActiveInteractive: false });
    //         this.props.dispatch(emptyActiveInteractive());
    //     }
    // };
    //
    // handleMembersEditClick = () => {
    //     this.props.dispatch(push(`${location.pathname}/edit`));
    // };
    //
    // handleDrawerCancelClick = () => {
    //     this.props.dispatch(push(url.resolve("../")));
    // };
    //
    // handleInteractiveDeleteClick = () => {
    //     this.props.dispatch(push(`${location.pathname}/delete`));
    // };
    //
    // handleInteractiveDeleteSuccess = () => {
    //     this.props.dispatch(push(url.resolve("../../")));
    //     const notification = {
    //         type: "positive",
    //         message: `Interactive '${this.props.activeInteractive.name}' successfully deleted`,
    //         isDismissable: true,
    //         autoDismiss: 15000,
    //     };
    //     notifications.add(notification);
    //     this.fetchInteractives();
    // };
    //
    // handleInteractiveCreateSuccess = () => {
    //     this.fetchInteractives();
    // };
    //
    // fetchInteractives() {
    //     this.setState({ isUpdatingAllInteractives: true });
    //     interactives
    //         .getAll()
    //         .then(allInteractives => {
    //             // Add any props (such as 'path') to response from API
    //             const allInteractivesWithProps = allInteractives.map(interactive => {
    //                 const path = url.sanitise(interactive.name + "_" + interactive.id);
    //                 return Object.assign({}, interactive, {
    //                     path: path,
    //                 });
    //             });
    //
    //             // Update all interactives
    //             const interactiveParameter = this.props.params.interactive;
    //             this.props.dispatch(updateAllInteractives(allInteractivesWithProps));
    //             this.setState({ isUpdatingAllInteractives: false });
    //
    //             // Update active interactive
    //             if (interactiveParameter) {
    //                 const activeInteractive = allInteractivesWithProps.find(interactive => {
    //                     return interactive.path === interactiveParameter;
    //                 });
    //                 // Only update Redux if new active interactive is different from the current one
    //                 if (activeInteractive && activeInteractive !== this.props.activeInteractive) {
    //                     this.props.dispatch(updateActiveInteractive(activeInteractive));
    //                     return;
    //                 }
    //                 // Give error because the interactive in the URL can't be found in the data
    //                 if (!activeInteractive) {
    //                     const notification = {
    //                         message: `Interactive '${interactiveParameter}' is not recognised so you've been redirected to the interactives screen`,
    //                         type: "neutral",
    //                         autoDismiss: 15000,
    //                         isDismissable: true,
    //                     };
    //                     notifications.add(notification);
    //                     this.props.dispatch(push(url.resolve("../")));
    //                 }
    //             }
    //         })
    //         .catch(error => {
    //             log.event(`Error fetching interactives`, log.data({ status_code: error.status }), log.error(error));
    //             switch (error.status) {
    //                 case 401: {
    //                     // This is handled by the request function, so do nothing here
    //                     break;
    //                 }
    //                 case "RESPONSE_ERR": {
    //                     const notification = {
    //                         type: "warning",
    //                         message:
    //                             "An error's occurred whilst trying to get interactives. You may only be able to see previously loaded information but won't be able to edit any interactive members",
    //                         isDismissable: true,
    //                     };
    //                     notifications.add(notification);
    //                     break;
    //                 }
    //                 case "UNEXPECTED_ERR": {
    //                     const notification = {
    //                         type: "warning",
    //                         message:
    //                             "An unexpected error's occurred whilst trying to get interactives. You may only be able to see previously loaded information but won't be able to edit any interactive members",
    //                         isDismissable: true,
    //                     };
    //                     notifications.add(notification);
    //                     break;
    //                 }
    //                 case "FETCH_ERR": {
    //                     const notification = {
    //                         type: "warning",
    //                         message:
    //                             "There's been a network error whilst trying to get interactives. You may only be able to see previously loaded information and not be able to edit any interactive members",
    //                         isDismissable: true,
    //                     };
    //                     notifications.add(notification);
    //                     break;
    //                 }
    //                 default: {
    //                     log.event(`Unhandled error fetching interactives`, log.data({ status_code: error.status }), log.error(error));
    //                     const notification = {
    //                         type: "warning",
    //                         message: "There's been an error fetching the interactives. You may only be able to see previously loaded information.",
    //                         isDismissable: true,
    //                     };
    //                     notifications.add(notification);
    //                     break;
    //                 }
    //             }
    //
    //             console.error("Error fetching all interactives:\n", error);
    //         });
    // }
    //
    // fetchMembers(interactiveName) {
    //     this.setState({ isUpdatingInteractiveMembers: true });
    //     interactives
    //         .get(interactiveName)
    //         .then(interactive => {
    //             // A new interactive is now active, don't do anything with the fetched data
    //             if (interactiveName !== this.props.activeInteractive.name) {
    //                 return;
    //             }
    //
    //             this.props.dispatch(updateActiveInteractiveMembers(interactive.members));
    //             this.setState({ isUpdatingInteractiveMembers: false });
    //         })
    //         .catch(error => {
    //             log.event(`Error fetching members of interactive`, log.data({ status_code: error.status, interactive: interactiveName }), log.error(error));
    //             switch (error.status) {
    //                 case 404: {
    //                     const notification = {
    //                         type: "warning",
    //                         message: `Couldn't find members for the interactive: '${interactiveName}'. This interactive may have been deleted.`,
    //                         isDismissable: true,
    //                     };
    //                     notifications.add(notification);
    //                     break;
    //                 }
    //                 case "RESPONSE_ERR": {
    //                     const notification = {
    //                         type: "warning",
    //                         message: `An error's occurred whilst trying to get the members for the interactive '${interactiveName}'`,
    //                         isDismissable: true,
    //                     };
    //                     notifications.add(notification);
    //                     break;
    //                 }
    //                 case "UNEXPECTED_ERR": {
    //                     const notification = {
    //                         type: "warning",
    //                         message: `An unexpected error's occurred whilst trying to get the members for the interactive '${interactiveName}'`,
    //                         isDismissable: true,
    //                     };
    //                     notifications.add(notification);
    //                     break;
    //                 }
    //                 case "FETCH_ERR": {
    //                     const notification = {
    //                         type: "warning",
    //                         message: `There's been a network error whilst trying to get the members for the interactive '${interactiveName}'`,
    //                         isDismissable: true,
    //                     };
    //                     notifications.add(notification);
    //                     break;
    //                 }
    //                 default: {
    //                     log.event(
    //                         `Unhandled error fetching interactive`,
    //                         log.data({
    //                             status_code: error.status,
    //                             interactive: interactiveName,
    //                         }),
    //                         log.error(error)
    //                     );
    //                     const notification = {
    //                         type: "warning",
    //                         message: "There's been an error fetching the members of interactive '${interactiveName}'",
    //                         isDismissable: true,
    //                     };
    //                     notifications.add(notification);
    //                     break;
    //                 }
    //             }
    //             console.error(`Error fetching interactive '${interactiveName}':\n`, error);
    //         });
    // }
    //
    // handleInteractiveClick = clickedInteractive => {
    //     // Make no change if clicked interactive is already the selected interactive
    //     if (clickedInteractive.isSelected) {
    //         return;
    //     }
    //     const path = url.sanitise(clickedInteractive.name + "_" + clickedInteractive.id);
    //     this.props.dispatch(push(`${this.props.rootPath}/interactives/${path}`));
    // };
    //
    // renderDrawer() {
    //     return (
    //         <Drawer
    //             isVisible={this.props.activeInteractive && this.props.activeInteractive.id && !this.state.clearActiveInteractive ? true : false}
    //             isAnimatable={this.state.drawerIsAnimatable}
    //             handleTransitionEnd={this.handleDrawerTransitionEnd}
    //         >
    //             {this.props.activeInteractive && this.props.activeInteractive.id ? (
    //                 <InteractiveDetails
    //                     {...this.props.activeInteractive}
    //                     userIsAdmin={this.props.userIsAdmin}
    //                     onCancel={this.handleDrawerCancelClick}
    //                     onDelete={this.handleInteractiveDeleteClick}
    //                     onEditMembers={this.handleMembersEditClick}
    //                     isShowingLoader={this.state.isUpdatingInteractiveMembers}
    //                     isReadOnly={this.state.isUpdatingAllInteractives}
    //                 />
    //             ) : (
    //                 ""
    //             )}
    //         </Drawer>
    //     );
    // }
    render() {
        const logoStyles = {float: "left", position: "absolute", top: "50%", transform: "translateY(-50%)", left: "42px"}
        const wellStyles = {float: "left", color: "#FFFFFF", fontSize : "30px", fontFamily: "Open Sans", fontWeight: '700'}
        const { rootPath } = this.props;

        return (
            <div>
                <ul className="global-nav__list" style={{backgroundColor: "#033E58"}}>
                    <li className="global-nav__item" style={logoStyles}>
                        <img src={logo} alt="ONS"/>
                    </li>
                </ul>
                <ul className="global-nav__list" style={{backgroundColor: "#3B7A9E"}}>
                    <li className="global-nav__item" style={wellStyles}>
                        <a className="global-nav__link" href="/florence/collections">My visualizations</a>
                    </li>
                </ul>
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
