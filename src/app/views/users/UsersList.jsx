import React, { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { useInput } from "../../hooks/useInput";
import { Link } from "react-router";
import filter from "lodash/filter";
import SimpleSelectableList from "../../components/simple-selectable-list/SimpleSelectableList";
import BackButton from "../../components/back-button";
import Magnifier from "../../icons/Magnifier";
import clsx from "clsx";
import Loader from "../../components/loader/Loader";
import search from "../../../components/search";

const mapUsers = (users, rootPath) => {
    return users.map(user => ({
        ...user,
        title: `${user.forename} ${user.lastname}`,
        details: [user.email],
        url: `${rootPath}/users/${user.id}`,
    }));
};

const UsersList = props => {
    const { active, suspended, loading, rootPath, loadUsers } = props;
    const [showActiveUsers, setShowActiveUsers] = useState(true);
    const [search, setSearch] = useInput("");

    useEffect(() => {
        loadUsers();
    }, []);

    const users = showActiveUsers ? mapUsers(active, rootPath) : mapUsers(suspended, rootPath);
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
                {loading ? (
                    <div className="grid grid--justify-center grid--align-center">
                        <Loader classNames="loader--dark loader--large" />
                    </div>
                ) : (
                    <>
                        <div className="grid grid--justify-space-between grid--align-center margin-bottom--1">
                            <div className="grid__col-md-4">
                                <div className="search__input-group ">
                                    <Magnifier classes="search__icon-magnifier" viewBox="0 0 28 28" />
                                    <label htmlFor="search" className="visually-hidden">
                                        Search users by name or email
                                    </label>
                                    <input role="search" name="search" placeholder="Search users by name" {...search} />
                                </div>
                            </div>
                            <div className="grid__col-md-4">
                                <div className="btn-group">
                                    <div className="form__label inline">Show</div>
                                    <label htmlFor="active" className="visually-hidden">
                                        Show active users
                                    </label>
                                    <button
                                        onClick={() => setShowActiveUsers(true)}
                                        id="active"
                                        aria-pressed={showActiveUsers}
                                        className={clsx("btn btn--margin-left", showActiveUsers ? "btn--primary" : "btn--link")}
                                    >
                                        Active users
                                    </button>
                                    <label htmlFor="suspended" className="visually-hidden">
                                        Show suspended users
                                    </label>{" "}
                                    <button
                                        onClick={() => setShowActiveUsers(false)}
                                        aria-pressed={showActiveUsers}
                                        id="suspended"
                                        className={clsx("btn btn--margin-left", !showActiveUsers ? "btn--primary" : "btn--link")}
                                    >
                                        Suspended
                                    </button>
                                </div>
                            </div>
                        </div>
                        {users ? <SimpleSelectableList rows={search.value ? getFilteredUsers() : users} /> : "Nothing to show."}
                    </>
                )}
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
    active: PropTypes.arrayOf(
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
