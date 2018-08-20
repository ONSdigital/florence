import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import Transition from 'react-transition-group/Transition';
import PropTypes from 'prop-types';

import UserDetails from './UserDetails';
import url from "../../../utilities/url";
import user from "../../../utilities/api-clients/user";
import log, { eventTypes } from '../../../utilities/log';
import notifications from '../../../utilities/notifications';
import { updateActiveUser } from '../../../config/actions';

const propTypes = {
    dispatch: PropTypes.func.isRequired,
    params: PropTypes.shape({
        userID: PropTypes.string.isRequired
    }).isRequired,
    activeUser: PropTypes.shape({
        email: PropTypes.string,
        name: PropTypes.string,
        temporaryPassword: PropTypes.bool
    })
};

export class UserDetailsController extends Component {
    constructor(props) {
        super(props);

        this.state = {
            mountTransition: true,
            isVisible: false,
            isFetchingUser: false,
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
            const userDetails = await user.get(userID).catch(error => reject(error));
            resolve({
                response: userDetails, 
                error: null
            });
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
            const userPermissions = await user.getPermissions(userID).catch(error => reject(error));

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
        }).catch(error => {
            console.error(`Unexpected response when getting permissions for '${userID}'`, error);
            log.add(eventTypes.unexpectedRuntimeError, {message: `Unexpected response when getting permissions for '${userID}': ${JSON.stringify(error)}`});
            return {
                response: null,
                error
            };
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
            autoDismiss: 7000,
            message: ``
        };

        if (bothErrored && haveMatchingStatus) {
            switch (userDetailsError.status) {
                case(403): {
                    notification.message = `Unable to get user's details because you don't have permission`;
                    break;
                }
                case(404): {
                    notification.message = `Unable to get user's details because the user doesn't exist anymore`;
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
                case(403): {
                    notification.message = `Unable to get all of the user's details because you don't have permission`;
                    break;
                }
                case(404): {
                    notification.message = `Unable to get all of the user's details because the user doesn't exist anymore`;
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

    render() {
        return (
            <Transition 
                in={this.state.mountTransition} 
                appear={true} 
                timeout={{enter: 0, exit: 130}}
                onEntered={this.handleTransitionEntered} 
                onExit={this.handleTransitionExit} 
                onExited={this.handleTransitionExited}
            >
                <UserDetails
                    key={this.props.params.userID}
                    isVisible={this.state.isVisible}
                    name={this.props.activeUser.name}
                    email={this.props.params.userID}
                    onClose={this.handleClose}
                    isLoading={this.state.isFetchingUser}
                    hasTemporaryPassword={this.props.activeUser.temporaryPassword}
                    role={this.props.activeUser.role}
                    errorFetchingUserDetails={this.state.errorFetchingUserDetails}
                    errorFetchingUserPermissions={this.state.errorFetchingUserPermissions}
                />
            </Transition>
        )
    }
}

UserDetailsController.propTypes = propTypes;

function mapStateToProps(state) {
    return {
        activeUser: state.state.users.active
    }
}

export default connect(mapStateToProps)(UserDetailsController);