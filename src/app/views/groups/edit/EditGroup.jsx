import React, { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import { withRouter } from "react-router";
import isEqual from "lodash/isEqual";
import isEmpty from "lodash/isEmpty";
import BackButton from "../../../components/back-button";
import Loader from "../../../components/loader";
import Input from "../../../components/Input";
import validate from "./validate";
import Members from "../members";
import DeletePanel from "../delete";
import FormFooter from "../../../components/form-footer/FormFooter";
import UsersTable from "../../../components/table";
import Magnifier from "../../../icons/Magnifier";
import clsx from "clsx";

const EditGroup = props => {
    const id = props.params.id;

    useEffect(() => {
        if (id) {
            props.loadGroup(id);
        }
    }, []);

    useEffect(() => {
        if (id) {
            props.loadMembers(id);
        }
    }, []);

    useEffect(() => {
        props.loadUsers();
    }, []);

    const { group, loading, users, updateGroup, loadingUsers, members, loadingMembers, updateGroupMembers } = props;
    const [values, setValues] = useState(null);
    const [search, setSearch] = useState("");
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [groupMembers, setGroupMembers] = useState(members);
    const [availableUsers, setAvailableUsers] = useState(users); // all available - those in groups groupMembers

    const hasErrors = !isEmpty(errors);
    const hasNewValues = !isEqual(values, group);
    const hasUpdatedMembers = !isEqual(groupMembers, members);
    const specialGroup = group?.id === "role-admin" || group?.id === "role-publisher";

    const routerWillLeave = nextLocation => {
        if ((hasNewValues || hasUpdatedMembers) && !isSubmitting) return "Your work is not saved! Are you sure you want to leave?";
    };

    useEffect(() => {
        setAvailableUsers(users);
        setGroupMembers(members);
    }, [users, members]);

    useEffect(() => {
        const newAvailableUsers = availableUsers.filter(user => !groupMembers.some(m => m.id === user.id));
        setAvailableUsers(newAvailableUsers);
    }, [groupMembers]);

    useEffect(() => {
        props.router.setRouteLeaveHook(props.route, routerWillLeave);
    });

    useEffect(() => {
        if (group) {
            setValues({ ...group }); // ths is not necessary but in future we will edit more fields
        }
    }, [group]);

    useEffect(() => {
        const str = search.toLowerCase();
        const newAvailableUsers = users.filter(user => !groupMembers.some(m => m.id === user.id));
        const result = newAvailableUsers.filter(user => user.name?.toLowerCase().includes(str) || users.email?.toLowerCase().includes(str));

        setAvailableUsers(result);
    }, [search, groupMembers, users]);

    const handleSubmit = e => {
        if (e) e.preventDefault();
        setErrors(validate(values));
        setIsSubmitting(true);

        if (hasErrors || values.name === "") return;

        updateGroup(id, { name: values.name, precedence: 10 });
        if (hasUpdatedMembers) {
            updateGroupMembers(
                id,
                groupMembers.map(({ id }) => ({ user_id: id }))
            );
        }
    };

    const handleInputChange = useCallback(e => {
        const key = e.target.name;
        const val = e.target.value;
        setIsSubmitting(false);

        if (hasErrors) {
            delete errors[e.target.name];
            setErrors(errors);
        }
        setValues(values => ({ ...values, [key]: val }));
    }, []);

    const handleSearchChange = e => setSearch(e.target.value);

    const handleRemove = user => {
        setGroupMembers(prevState => prevState.filter(member => member.id !== user.id));
        setAvailableUsers(prevState => prevState.concat(user));
    };

    const handleAdd = member => {
        setGroupMembers(prevState => prevState.concat(member));
        setAvailableUsers(prevState => prevState.filter(user => user.id !== member.id));
    };
    console.log("specialGroup", specialGroup);
    if (loading) return <Loader classNames="grid grid--align-center grid--align-self-center grid--full-height" />;
    if (!group) return <h1>No group found.</h1>;

    return (
        <div className="form form-with-sticky-footer">
            <div className="grid grid--justify-space-around">
                <div className="grid__col-11 grid__col-md-9">
                    <BackButton classNames="margin-top--2" />
                    <h1 className="margin-top--1 margin-bottom--1">{group.name}</h1>
                    <div className="grid grid--justify-space-between">
                        <div className="grid__col-md-6 margin-top--half">
                            {!specialGroup && (
                                <Input
                                    error={errors?.name}
                                    id="name"
                                    label="Name"
                                    name="name"
                                    type="text"
                                    value={values ? values.name : ""}
                                    onChange={handleInputChange}
                                />
                            )}
                            {loadingMembers && <Loader classNames="grid grid--align-center grid--align-self-center grid--full-height" />}
                            {groupMembers && <Members members={groupMembers} handleRemove={handleRemove} />}
                            {!specialGroup && <DeletePanel id={id} />}
                        </div>
                        <div className="grid__col-md-5">
                            <h2 className="font-size--16">Add member to team</h2>
                            {loadingUsers ? (
                                <Loader classNames="grid grid--align-center grid--align-self-center" />
                            ) : (
                                <>
                                    <div className="search__input-group margin-bottom--1">
                                        <Magnifier classes="search__icon-magnifier" viewBox="0 0 28 28" />
                                        <label htmlFor="search" className="visually-hidden">
                                            Search users by name or email
                                        </label>
                                        <input
                                            role="search"
                                            name="search"
                                            placeholder="Search users by name"
                                            value={search ? search : ""}
                                            onChange={handleSearchChange}
                                        />
                                    </div>
                                    <UsersTable testid="users-table" items={availableUsers} handleClick={handleAdd} />
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <FormFooter hasNewValues={hasNewValues} hasErrors={hasErrors} loading={loading} handleSubmit={handleSubmit} />
            </div>
        </div>
    );
};

EditGroup.prototype = {
    params: PropTypes.objectOf({ id: PropTypes.string.isRequired }),
    group: PropTypes.exact({
        created: PropTypes.string,
        id: PropTypes.string,
        members: PropTypes.array,
        name: PropTypes.string,
        precedence: PropTypes.number,
    }).isRequired,
    updateGroup: PropTypes.func.isRequired,
    loadGroup: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
};

export default withRouter(EditGroup);
