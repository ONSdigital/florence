import React, { useState, useEffect, useCallback } from "react";
import { withRouter } from "react-router";
import PropTypes from "prop-types";
import notifications from "../../../utilities/notifications";
import { useInput } from "../../../hooks/useInput";
import BackButton from "../../../components/back-button";
import FormFooter from "../../../components/form-footer";
import GroupsTable from "../../../components/table";
import Loader from "../../../components/loader/Loader";
import Magnifier from "../../../icons/Magnifier";
import { addPopout, removePopouts } from "../../../config/actions";
import User from "./User";

const notification = {
    type: "warning",
    message: "User is already a member of this group.",
    autoDismiss: 5000,
};

function AddGroupsToUser(props) {
    const id = props.params.userID;

    useEffect(() => {
        if (id) {
            loadUser(id);
            loadGroups(isNewSignIn);
        }
    }, [id]);

    const { isNewSignIn, loading, user, groups, loadUser, loadingGroups, loadGroups, addGroupsToUser, isAdding, rootPath } = props;
    const [search, setSearch] = useInput("");
    const [userGroups, setUserGroups] = useState([]);

    const hasNewValues = userGroups.length > 0;
    const routerWillLeave = (nextLocation) => {
        if (hasNewValues) return 'Your work is not saved! Are you sure you want to leave?'
    }

    useEffect(() => {
        props.router.setRouteLeaveHook(props.route, routerWillLeave)
    })

    const handleRemove = name => {
        setUserGroups(prevState => prevState.filter(group => group !== name));
    };
    const handleAdd = name => {
        if (userGroups.includes(name)) {
            notifications.add(notification);
            return;
        }
        setUserGroups(prevState => prevState.concat(name));
    };

    const getFilteredGroups = useCallback(() => {
        return groups.filter(group => group.group_name.toLowerCase().includes(search.value.toLowerCase()));
    }, [search.value]);

    return (
        <div className="grid grid--justify-space-around">
            <div className="grid__col-11 grid__col-md-9">
                <BackButton redirectUrl={`${rootPath}/users`} classNames="margin-top--2" />
                <div className="grid grid--justify-space-between">
                    <div className="grid__col-md-5">
                        {loading ? (
                            <Loader classNames="grid grid--align-center grid--align-self-center" />
                        ) : (
                            <User testid="user" {...user} userGroups={userGroups} handleRemove={handleRemove} />
                        )}
                    </div>
                    <div className="grid__col-md-6">
                        <h2 className="margin-top--1 margin-bottom--1">Add a team for the user to join</h2>
                        <div className="search__input-group margin-bottom--1">
                            <Magnifier classes="search__icon-magnifier" viewBox="0 0 28 28" />
                            <label htmlFor="search" className="visually-hidden">
                                Search teams by name
                            </label>
                            <input role="search" name="search" placeholder="Search teams by name" {...search} />
                        </div>
                        {loadingGroups ? (
                            <Loader classNames="grid grid--align-center grid--align-self-center" />
                        ) : (
                            <GroupsTable testid="groups-table" items={search.value ? getFilteredGroups() : groups} handleClick={handleAdd} />
                        )}
                    </div>
                </div>
            </div>
            <FormFooter
                hasNewValues={hasNewValues}
                loading={isAdding}
                redirectUrl={`${rootPath}/users`}
                handleSubmit={() => addGroupsToUser(id, userGroups)}
            />
        </div>
    );
}

AddGroupsToUser.propTypes = {
    user: PropTypes.object,
    groups: PropTypes.array,
    isAdding: PropTypes.bool,
    loading: PropTypes.bool,
    params: PropTypes.object,
    addGroupsToUser: PropTypes.func.isRequired,
    loadGroups: PropTypes.func.isRequired,
    loadUser: PropTypes.func.isRequired,
};

export default withRouter(AddGroupsToUser);
