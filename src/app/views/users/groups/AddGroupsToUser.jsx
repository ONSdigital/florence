import React, { useState, useEffect, useCallback } from "react";
import filter from "lodash/filter";
import { withRouter } from "react-router";
import PropTypes from "prop-types";
import notifications from "../../../utilities/notifications";
import { useInput } from "../../../hooks/useInput";
import BackButton from "../../../components/back-button";
import FormFooter from "../../../components/form-footer";
import GroupsTable from "../../../components/table";
import Loader from "../../../components/loader/Loader";
import Magnifier from "../../../icons/Magnifier";
import User from "./User";

const notification = {
    type: "warning",
    message: "User is already a member of this group.",
    autoDismiss: 5000,
};

function AddGroupsToUser(props) {
    const id = props.params.id;

    useEffect(() => {
        if (id) {
            loadUser(id);
            loadGroups();
        }
    }, [id]);

    const { loading, user, groups, loadUser, loadingGroups, loadGroups, addGroupsToUser, isAdding, rootPath } = props;
    const [isSubmitting, setIsSubmitting] = useState(isAdding);
    const [search, setSearch] = useInput("");
    const [userGroups, setUserGroups] = useState([]);

    const hasNewValues = userGroups.length > 0;
    const routerWillLeave = nextLocation => {
        if (hasNewValues && !isSubmitting) return "Your work is not saved! Are you sure you want to leave?";
    };

    useEffect(() => {
        props.router.setRouteLeaveHook(props.route, routerWillLeave);
    });

    const handleRemove = id => setUserGroups(prevState => prevState.filter(group => group.id !== id));

    const handleAdd = group => {
        if (userGroups.includes(group)) {
            notifications.add(notification);
            return;
        }
        setIsSubmitting(true);
        setUserGroups(prevState => prevState.concat(group));
    };

    const getFilteredGroups = useCallback(() => {
        return filter(groups, group => group.name?.toLowerCase().includes(search.value.toLowerCase()));
    }, [search.value]);

    return (
        <div className="grid grid--justify-space-around form-with-sticky-footer">
            <div className="grid__col-11 grid__col-md-9">
                <BackButton redirectUrl={`${rootPath}/users`} classNames="margin-top--2" />
                <div className="grid grid--justify-space-between">
                    <div className="grid__col-md-5">
                        {loading ? (
                            <Loader classNames="grid grid--align-center grid--align-self-center" />
                        ) : (
                            <User {...user} userGroups={userGroups} handleRemove={handleRemove} />
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
                handleSubmit={() =>
                    addGroupsToUser(
                        id,
                        userGroups.map(group => group.id)
                    )
                }
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
