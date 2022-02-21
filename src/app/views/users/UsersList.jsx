import React, { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import log from "../../utilities/logging/log";
import auth from "../../utilities/auth";
import url from "../../utilities/url";
import SimpleSelectableList from "../../components/simple-selectable-list/SimpleSelectableList";
import { useInput } from "../../hooks/useInput";
import { Link } from "react-router";
import BackButton from "../../components/back-button/BackButton";
import Magnifier from "../../icons/Magnifier";

const UsersList = props => {
    const { users, isLoading, rootPath, loadUsers } = props;
    const isAdmin = auth.isAdmin(props.loggedInUser);
    const [search, setSearch] = useInput("");
    useEffect(() => {
        // TODO: remove this ?
        // if (!isAdmin && !props.params.userID) {
        //     props.dispatch(replace(`${props.rootPath}/users/${props.loggedInUser.email}`));
        // }
        loadUsers();
    }, []);

    const getFilteredUsers = useCallback(() => {
        const str = search.value.toLowerCase();
        return users.filter(
            user => user.forename.toLowerCase().includes(str) || user.lastname.toLowerCase().includes(str) || user.email.toLowerCase().includes(str)
        );
    }, [search.value]);

    return (
        <div className="grid grid--justify-space-around">
            <div className="grid__col-9">
                <BackButton classNames={"margin-top--2"} />
                <div className="grid grid--align-baseline">
                    <div className="grid__col">
                        <h1>Users</h1>
                    </div>
                    <div className="grid__col">
                        <Link className="margin-left--1" href={`${rootPath}/users/create`}>
                            Create new user
                        </Link>
                    </div>
                </div>
                <div className="grid">
                    <div className="search__input-group margin-bottom--1">
                        <Magnifier classes="search__icon-magnifier" viewBox="0 0 28 28" />
                        <label htmlFor="search" className="visually-hidden">
                            Search users by name
                        </label>
                        <input role="search" name="search" placeholder="Search teams by name" {...search} />
                    </div>
                </div>
                <SimpleSelectableList rows={search.value ? getFilteredUsers() : users} showLoadingState={isLoading} />
            </div>
        </div>
    );
};

UsersList.propTypes = {
    rootPath: PropTypes.string.isRequired,
    params: PropTypes.shape({
        userID: PropTypes.string,
    }).isRequired,
    loggedInUser: PropTypes.object,
    users: PropTypes.arrayOf(
        PropTypes.shape({
            forename: PropTypes.string,
            lastname: PropTypes.string,
            email: PropTypes.string,
            status: PropTypes.string,
            active: PropTypes.boolean,
            id: PropTypes.string,
            status_notes: PropTypes.string,
        })
    ).isRequired,
    loadUsers: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
};

export default UsersList;
