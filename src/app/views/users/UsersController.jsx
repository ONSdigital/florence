import React, { Component } from "react";
import { connect } from "react-redux";
import { push, replace } from "react-router-redux";
import PropTypes from "prop-types";

import users from "../../utilities/api-clients/user";
import notifications from "../../utilities/notifications";
import log from "../../utilities/logging/log";
import auth from "../../utilities/auth";

import SelectableBox from "../../components/selectable-box-new/SelectableBox";
import UsersCreateController from "./create/UsersCreateController";
import { addAllUsers } from "../../config/actions";

const propTypes = {
    rootPath: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    children: PropTypes.element,
    params: PropTypes.shape({
        userID: PropTypes.string,
    }).isRequired,
    loggedInUser: PropTypes.object,
    users: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export class UsersController extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isFetchingUsers: false,
        };

        this.isAdmin = auth.isAdmin(this.props.loggedInUser);
    }

    UNSAFE_componentWillMount() {
        if (!this.isAdmin && !this.props.params.userID) {
            this.props.dispatch(replace(`${this.props.rootPath}/users/${this.props.loggedInUser.email}`));
        }
        return this.getAllUsers();
    }

    getAllUsers() {
        this.setState({ isFetchingUsers: true });
        return users
            .getAll()
            .then(allUsersResponse => {
                const allUsers = allUsersResponse.map(user => {
                    return this.mapUserToState(user);
                });
                this.props.dispatch(addAllUsers(allUsers));
                this.setState({ isFetchingUsers: false });
            })
            .catch(error => {
                this.setState({ isFetchingUsers: false });
                log.event("Error fetching users", log.data({ status_code: error.status }), log.error(error));
                switch (error) {
                    case 404: {
                        const notification = {
                            type: "warning",
                            message: `No API route available to get users.`,
                            autoDismiss: 5000,
                        };
                        notifications.add(notification);
                        break;
                    }
                    case "RESPONSE_ERR": {
                        const notification = {
                            type: "warning",
                            message: "An error's occurred whilst trying to get users. You may only be able to see previously loaded information.",
                            isDismissable: true,
                        };
                        notifications.add(notification);
                        break;
                    }
                    case "UNEXPECTED_ERR": {
                        const notification = {
                            type: "warning",
                            message:
                                "An unexpected error's occurred whilst trying to get users. You may only be able to see previously loaded information.",
                            isDismissable: true,
                        };
                        notifications.add(notification);
                        break;
                    }
                    case "FETCH_ERR": {
                        const notification = {
                            type: "warning",
                            message:
                                "There's been a network error whilst trying to get users. You may only be able to see previously loaded information.",
                            isDismissable: true,
                        };
                        notifications.add(notification);
                        break;
                    }
                    default: {
                        log.event("Unhandled error fetching users", log.data({ status_code: error.status }), log.error(error));
                        const notification = {
                            type: "warning",
                            message:
                                "An unexpected error's occurred whilst trying to get users. You may only be able to see previously loaded information.",
                            isDismissable: true,
                        };
                        notifications.add(notification);
                        break;
                    }
                }
                console.error("Error getting all users:\n", error);
            });
    }

    mapUserToState(user) {
        try {
            const id = user.email;
            const columnValues = [user.name, user.email];
            const returnValue = { id: user.email };
            return { ...user, id, columnValues, returnValue };
        } catch (error) {
            const notification = {
                type: "warning",
                message: "Error mapping users to state",
                isDismissable: true,
                autoDismiss: 3000,
            };
            notifications.add(notification);
            console.error("Error mapping users to state: ", error);
            log.event("Error mapping users to state", log.error(error));
            return false;
        }
    }

    handleUserSelection = user => {
        this.props.dispatch(push(`${this.props.rootPath}/users/${user.id}`));
    };

    handleUserCreateSuccess = user => {
        this.props.dispatch(push(`${this.props.rootPath}/users/${user.email}`));
        this.getAllUsers();
    };

    render() {
        return (
            <div>
                <div className="grid grid--justify-space-around">
                    <div className="grid__col-4">
                        <h1>Select a user</h1>
                        <SelectableBox
                            columns={[
                                { heading: "User", width: "6" },
                                { heading: "Email", width: "6" },
                            ]}
                            rows={this.props.users}
                            isUpdating={this.state.isFetchingUsers}
                            handleItemClick={this.handleUserSelection}
                            activeRowID={this.props.params.userID}
                        />
                    </div>
                    <div className="grid__col-4">{this.isAdmin && <UsersCreateController onCreateSuccess={this.handleUserCreateSuccess} />}</div>
                </div>
                {this.props.children}
            </div>
        );
    }
}

UsersController.propTypes = propTypes;

export function mapStateToProps(state) {
    return {
        rootPath: state.state.rootPath,
        users: state.state.users.all,
        loggedInUser: state.user,
    };
}

export default connect(mapStateToProps)(UsersController);
