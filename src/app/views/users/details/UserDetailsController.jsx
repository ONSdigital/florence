import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import Transition from 'react-transition-group/Transition';
import PropTypes from 'prop-types';

import Drawer from '../../../components/drawer/Drawer';
import UserDetails from './UserDetails';
import url from "../../../utilities/url";
import user from "../../../utilities/api-clients/user";
import log, { eventTypes } from '../../../utilities/log';
import notifications from '../../../utilities/notifications';
import { updateActiveUser, removeUserFromAllUsers } from '../../../config/actions';
import auth from '../../../utilities/auth';

const propTypes = {
    dispatch: PropTypes.func.isRequired,
    params: PropTypes.shape({
        userID: PropTypes.string.isRequired
    }).isRequired,
    activeUser: PropTypes.shape({
        email: PropTypes.string,
        name: PropTypes.string,
        hasTemporaryPassword: PropTypes.bool,
        role: PropTypes.string
    }),
    currentUser: PropTypes.shape({
        email: PropTypes.string.isRequired,
        isAdmin: PropTypes.bool.isRequired
    }).isRequired,
    children: PropTypes.element,
    previousPathname: PropTypes.string,
    rootPath: PropTypes.string.isRequired,
    arrivedByRedirect: PropTypes.bool
};

export class UserDetailsController extends Component {
    constructor(props) {
        super(props);

        this.state = {
            mountTransition: true,
            isVisible: false,
            // Note: Checking the previous route ensures that we only animate the drawer when selecting it from the users screen
            // rather than on initial load of the route. This is broken when a publisher click the global 'Users and access' link
            // because they are redirected from '/users' to '/users/their-own-user-id'. This means we need to also check that they
            // haven't been redirected from the users screen, since we don't want to animate on that load either.
            isAnimatable: props.previousPathname === `${props.rootPath}/users` && !props.arrivedByRedirect,
            isFetchingUser: false,
            isDeletingUser: false,
            isChangingPassword: false,
            errorFetchingUserDetails: false,
            errorFetchingUserPermissions: false
        };
    }

    componentWillMount() {
        this.updateStateWithUser();
    }

    componentDidUpdate(previousProps) {
        if (previousProps.params.userID !== this.props.params.userID) {
            this.updateStateWithUser();
        }
    }

    async updateStateWithUser() {
        this.setState({isFetchingUser: true});

        const userID = this.props.params.userID;
        const responses = await Promise.all([
            this.getUserDetails(userID),
            this.getUserPermissions(userID)
        ]);

        this.setState({isFetchingUser: false});

        if ((responses[0].error || responses[1].error) || (!responses[0].response || !responses[1].response)) {
            this.setState({
                errorFetchingUserDetails: (responses[0].error || !responses[0].response) ? true : false,
                errorFetchingUserPermissions: (responses[1].error || !responses[1].response) ? true : false
            });
            this.handleGetUserError(responses[0].error, responses[1].error, userID);
        }

        if (!responses[0].response && !responses[1].response) {
            return;
        }

        const mappedUser = this.mapUserResponsesToState(responses[0].response, responses[1].response);
        this.props.dispatch(updateActiveUser(mappedUser));
    }

    getUserDetails(userID) {
        return new Promise(async (resolve, reject) => {
            user.get(userID).then(userDetails => {
                resolve({
                    response: userDetails, 
                    error: null
                });
            }).catch(error => reject(error));
        }).catch(error => {
            console.error(`Error getting user '${userID}'`, error);
            log.add(eventTypes.unexpectedRuntimeError, {message: `Error getting user '${userID}': ${JSON.stringify(error)}`});
            return {
                response: null,
                error
            };
        });
    }

    getUserPermissions(userID) {
        return new Promise(async (resolve, reject) => {
            user.getPermissions(userID).then(userPermissions => {
                // API still gives a 200 response even when an unrecognised user is requested
                // we can check for this by the 'email' property being left empty, because for 
                // working users it should always be populated
                if (!userPermissions.email) {
                    reject({
                        status: 404
                    });
                }
                resolve({
                    response: userPermissions, 
                    error: null
                });
            }).catch(error => reject(error));
        }).catch(error => {
            console.error(`Error getting permissions for '${userID}'`, error);
            log.add(eventTypes.unexpectedRuntimeError, {message: `Error getting permissions for '${userID}': ${JSON.stringify(error)}`});
            return {
                response: null,
                error
            };
        });
    }

    deleteUser(userID) {
        return new Promise(async (resolve, reject) => {
            user.remove(userID).then(() => {
                resolve({
                    response: null,
                    error: null
                });
            }).catch(error => reject(error));
        }).catch(error => {
            console.error(`Error deleting user '${userID}'`, error);
            log.add(eventTypes.unexpectedRuntimeError, {message: `Error deleting user '${userID}': ${JSON.stringify(error)}`});
            return {
                response: null,
                error
            }
        });
    }

    mapUserResponsesToState(userDetails, userPermissions) {
        return {
            name: userDetails ? userDetails.name : "",
            email: userDetails ? userDetails.email || userPermissions.email : "",
            role: userPermissions ? user.getUserRole(userPermissions.admin, userPermissions.editor) : "",
            hasTemporaryPassword: userDetails ? userDetails.temporaryPassword : false
        };
    }

    handleGetUserError(userDetailsError, userPermissionsError) {
        const bothErrored = userDetailsError && userPermissionsError;
        const haveMatchingStatus = bothErrored ? (userDetailsError.status === userPermissionsError.status) : false;
        let notification = {
            type: "warning",
            isDismissable: true,
            message: ``
        };

        if (bothErrored && haveMatchingStatus) {
            switch (userDetailsError.status) {
                case(401): {
                    // handle by utility 'request' function
                    break;
                }
                case(403): {
                    notification.message = `Unable to get user's details because you don't have permission`;
                    break;
                }
                case(404): {
                    notification.message = `Unable to get user's details because the user doesn't exist anymore, so you have been redirected to the users screen`;
                    this.props.dispatch(push(url.resolve("../")));
                    break;
                }
                case('FETCH_ERR'): {
                    notification.message = `Unable to get user's details due to a network error, please check your connection and try again`;
                    break;
                }
                default: {
                    notification.message = `Unable to get user's details due to an unexpected error`;
                }
            }
            notifications.add(notification);
            return;
        }

        if (bothErrored && !haveMatchingStatus) {
            notification.message = `Unable to get user's details due to an unexpected error`;
            notifications.add(notification);
            return;
        }

        if (!bothErrored) {
            const status = userDetailsError ? userDetailsError.status : userPermissionsError.status;
            switch (status) {
                case(401): {
                    // handle by utility 'request' function
                    break;
                }
                case(403): {
                    notification.message = `Unable to get all of the user's details because you don't have permission`;
                    break;
                }
                case(404): {
                    notification.message = `Unable to get all of the user's details because the user doesn't exist anymore, so you have been redirected to the users screen`;
                    this.props.dispatch(push(url.resolve("../")));
                    break;
                }
                case('FETCH_ERR'): {
                    notification.message = `Unable to get all of the user's details due to a network error, please check your connection and try again`;
                    break;
                }
                default: {
                    notification.message = `Unable to get all of the user's details due to an unexpected error`;
                }
            }
            notifications.add(notification);
            return;
        }

        // Send a default notification (we shouldn't get here but we're handling this scenrario, just in case!)
        notification.message = `An error occured trying to get the user's details`;
        notifications.add(notification);
    }

    handleDeleteUserError(error) {
        let notification = {
            type: "warning",
            isDismissable: true,
            message: ``
        };
        
        switch (error.status) {
            case(401): {
                // handled by utility 'request' function
                break;
            }
            case(403): {
                notification.message = `Unable to delete user because you do not have permission to do so`;
                break;
            }
            case(404): {
                notification.message = `Unable to delete user because it no longer exists`;
                break;
            }
            case('FETCH_ERR'): {
                notification.message = `Unable to delete user due to a network error. Check your connection and try again.`;
                break;
            }
            default: {
                notification.message = `Unable to delete user due to an unexpected error`;
                break;
            }
        }
        
        notifications.add(notification);
    }

    handleTransitionEntered = () => {
        this.setState({isVisible: true});
    }
    
    handleTransitionExit = () => {
        this.setState({
            isVisible: false,
            isAnimatable: true
        });
    }

    handleTransitionExited = () => {
        this.props.dispatch(push(url.resolve("../")));
    }

    handleClose = () => {
        this.setState({mountTransition: false});
    }

    handleDelete = async () => {
        const userID = this.props.params.userID;

        this.setState({isDeletingUser: true});
        const response = await this.deleteUser(userID);
        this.setState({isDeletingUser: false});

        if (response.error) {
            this.handleDeleteUserError(response.error);
            return;
        }

        this.props.dispatch(removeUserFromAllUsers(userID));
        this.props.dispatch(push(url.resolve("../")));
    }

    render() {
        return (
            <div>
                <Transition 
                    in={this.state.mountTransition} 
                    appear={true} 
                    timeout={{enter: 0, exit: 130}}
                    onEntered={this.handleTransitionEntered} 
                    onExit={this.handleTransitionExit} 
                    onExited={this.handleTransitionExited}
                >
                    <Drawer isVisible={this.state.isVisible} isAnimatable={this.state.isAnimatable}>
                        <UserDetails
                            key={this.props.params.userID}
                            name={this.props.activeUser.name}
                            email={this.props.params.userID}
                            onClose={this.handleClose}
                            onDelete={this.handleDelete}
                            isLoading={this.state.isFetchingUser}
                            isDeleting={this.state.isDeletingUser}
                            showChangePassword={this.props.currentUser.isAdmin || this.props.params.userID === this.props.currentUser.email}
                            hasTemporaryPassword={this.props.activeUser.hasTemporaryPassword}
                            role={this.props.activeUser.role}
                            errorFetchingUserDetails={this.state.errorFetchingUserDetails}
                            errorFetchingUserPermissions={this.state.errorFetchingUserPermissions}
                            showFooter={auth.isAdmin(this.props.currentUser)}
                        />
                    </Drawer>
                </Transition>
                {this.props.children}
            </div>
        )
    }
}

UserDetailsController.propTypes = propTypes;

export function mapStateToProps(state) {
    return {
        activeUser: state.state.users.active,
        currentUser: state.state.user,
        arrivedByRedirect: state.routing.locationBeforeTransitions.action === "REPLACE",
        previousPathname: state.routing.locationBeforeTransitions.previousPathname,
        rootPath: state.state.rootPath
    }
}

export default connect(mapStateToProps)(UserDetailsController);