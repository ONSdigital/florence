import React, { Component } from "react";
import { connect } from "react-redux";
import { push, replace } from "react-router-redux";
import PropTypes from "prop-types";

import users from "../../utilities/api-clients/user";
import notifications from "../../utilities/notifications";
import log from "../../utilities/logging/log";
import auth from "../../utilities/auth";

import { addAllUsers } from "../../config/actions";
import SimpleSelectableList from "../../components/simple-selectable-list/SimpleSelectableList";
import BackButton from "../../components/button/BackButton";
import Input from "../../components/Input";

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

export class UsersListController extends Component {
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
                const allUsers = allUsersResponse.users.map(user => {
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
            const title = `${user.forename} ${user.lastname}`;
            const details = [user.email];
            const url = `${this.props.rootPath}/users/${id}`;
            return { ...user, id, title, details, url };
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

    handleSearchInput = event => {
        const searchTerm = event.target.value.toLowerCase();
        const filteredUsers = this.props.users.filter(
          user => user.title.toLowerCase().search(searchTerm) !== -1 || user.email.toLowerCase().search(searchTerm) !== -1
        );
        this.setState({
            filteredUsers,
            searchTerm,
        });
    };

    render() {
        return (
            <div>
                <div className="grid grid--justify-space-around">
                    <div className="grid__col-9">
                        <BackButton fill='#000000' url={`${this.props.rootPath}/collections`} />
                        <div className="grid grid--align-baseline">
                            <div className="grid__col-1">
                                <h1>Users</h1>
                            </div>
                            <div className="grid__col-1">
                                <a href='#'>
                                    Create new user
                                </a>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="grid__col-4">
                                <Input id="search-content-types" placeholder="Search user by name or email" onChange={this.handleSearchInput} />
                            </div>
                        </div>
                        <SimpleSelectableList rows={this.state.filteredUsers ? this.state.filteredUsers : this.props.users} />
                    </div>
                </div>
                {this.props.children}
            </div>
        );
    }
}

UsersListController.propTypes = propTypes;

export function mapStateToProps(state) {
    return {
        rootPath: state.state.rootPath,
        users: state.state.users.all,
        loggedInUser: state.user,
    };
}

export default connect(mapStateToProps)(UsersListController);
