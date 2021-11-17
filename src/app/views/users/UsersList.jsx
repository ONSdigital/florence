import React, {Component, useEffect, useState} from "react";
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


export const getAllUsers = (dispatch, rootPath, setIsFetchingUsers) => {
    setIsFetchingUsers(true);
    users
      .getAll()
      .then(allUsersResponse => {
          const allUsers = allUsersResponse.users.map(user => {
              return mapUserToState(rootPath, user);
          });
          dispatch(addAllUsers(allUsers));
          setIsFetchingUsers(false);
      })
      .catch(error => {
          setIsFetchingUsers(false);
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
};

export const mapUserToState = (rootPath, user) => {
    try {
        const id = user.email;
        const title = `${user.forename} ${user.lastname}`;
        const details = [user.email];
        const url = `${rootPath}/users/${id}`;
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
};

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

export const UsersList = (props) => {
    const [isFetchingUsers, setIsFetchingUsers] = useState(false);
    const isAdmin = auth.isAdmin(props.loggedInUser);
    const [filteredUsers, setFilteredUsers] = useState(null);

    useEffect(() => {
        if (!isAdmin && !props.params.userID) {
            props.dispatch(replace(`${props.rootPath}/users/${props.loggedInUser.email}`));
        }
        getAllUsers(props.dispatch, props.rootPath, setIsFetchingUsers);
    }, []);

    const handleSearchInput = event => {
        const searchTerm = event.target.value.toLowerCase();
        const filteredUsers = props.users.filter(
            user => user.title.toLowerCase().search(searchTerm) !== -1 || user.email.toLowerCase().search(searchTerm) !== -1
        );
        setFilteredUsers(filteredUsers);
    };

    return (
        <div>
            <div className="grid grid--justify-space-around">
                <div className="grid__col-9">
                    <BackButton fill="#000000" url={`${props.rootPath}/collections`} />
                    <div className="grid grid--align-baseline">
                        <div className="grid__col-1">
                            <h1>Users</h1>
                        </div>
                        <div className="grid__col-1">
                            <a href="#">Create new user</a>
                        </div>
                    </div>
                    <div className="grid">
                        <div className="grid__col-4">
                            <Input id="search-content-types" placeholder="Search user by name or email" onChange={handleSearchInput} />
                        </div>
                    </div>
                    <SimpleSelectableList rows={filteredUsers ? filteredUsers : props.users} showLoadingState={isFetchingUsers} />
                </div>
            </div>
            {props.children}
        </div>
    );
}

UsersList.propTypes = propTypes;

export function mapStateToProps(state) {
    return {
        rootPath: state.state.rootPath,
        users: state.state.users.all,
        loggedInUser: state.user,
    };
}

export default connect(mapStateToProps)(UsersList);
