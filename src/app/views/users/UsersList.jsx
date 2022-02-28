import React, { useEffect, useState, useCallback } from "react";
import filter from "lodash/filter";
import PropTypes from "prop-types";
import log from "../../utilities/logging/log";
import auth from "../../utilities/auth";
import url from "../../utilities/url";
import SimpleSelectableList from "../../components/simple-selectable-list/SimpleSelectableList";
import { useInput } from "../../hooks/useInput";
import { Link } from "react-router";
import BackButton from "../../components/back-button";
import Magnifier from "../../icons/Magnifier";

const UsersList = props => {
    const { users, loading, rootPath, loadUsers, loggedInUser } = props;
    const isAdmin = auth.isAdmin(loggedInUser);
    const [search, setSearch] = useInput("");

    useEffect(() => {
        loadUsers();
    }, []);

    const getFilteredUsers = useCallback(() => {
        const str = search.value.toLowerCase();
        return filter(users, user => (user.forename + " " + user.lastname).toLowerCase().includes(str) || user.email.toLowerCase().includes(str));
    }, [search.value]);

    return (
        <div className="grid grid--justify-space-around">
            <div className="grid__col-9">
                <BackButton classNames="margin-top--2" />
                <div className="grid grid--align-baseline">
                    <div className="grid__col">
                        <h1>Users</h1>
                    </div>
                    <div className="grid__col">
                        <Link role="link" className="margin-left--1" href={`${rootPath}/users/create`}>
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
                        <input role="search" name="search" placeholder="Search users by name" {...search} />
                    </div>
                </div>
                <SimpleSelectableList rows={search.value ? getFilteredUsers() : users} showLoadingState={loading} />
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
            url: PropTypes.string,
            title: PropTypes.string,
            details: PropTypes.array,
        })
    ),
    loadUsers: PropTypes.func.isRequired,
    loading: PropTypes.bool,
};

export default UsersList;
