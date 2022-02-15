import React, { useState, useEffect, useCallback } from "react";
import { useInput } from "../../../hooks/useInput";
import BackButton from "../../../components/back-button/BackButton";
import FormFooter from "../../../components/form-footer";
import Table from "../../../components/table";
import SelectedItemList from "../../../components/selected-items/SelectedItemList";
import Loader from "../../../components/loader/Loader";
import Magnifier from "../../../icons/Magnifier";

function AddGroupsToUser(props) {
    const { loading, user, groups, loadUser, loadingGroups, loadGroups, addGroupsToUser, isAdding, rootPath } = props;
    const [search, setSearch] = useInput("");
    const [userGroups, setUserGroups] = useState([]);
    const id = props.params.userID;

    useEffect(() => {
        loadUser(id);
        loadGroups();
    }, []);

    const hasValues = userGroups.length > 0;

    const handleRemove = name => {
        setUserGroups(prevState => prevState.filter(group => group !== name));
    };
    const handleAdd = name => {
        setUserGroups(prevState => prevState.concat(name));
    };

    const getFliteredUsers = useCallback(() => {
        return groups.filter(group => group.group_name.toLowerCase().includes(search.value.toLowerCase()));
    }, [search.value]);

    return (
        <div className="grid grid--justify-space-around">
            <div className="grid__col-9">
                <BackButton redirectUrl={`${rootPath}/users`} classNames={"margin-top--2"} />
                <div className="grid grid--justify-space-around">
                    <div className="grid__col-6">
                        <h1 className="margin-top--1 margin-bottom--1">{`${user?.forename} ${user?.lastname}`}</h1>
                        <p>{user?.id}</p>
                        <h2 className="margin-top--1">Team Member</h2>
                        {userGroups.length === 0 && <p>Nothing to show.</p>}
                        {userGroups && (
                            <SelectedItemList
                                classNames="selected-item-list__item--subtle"
                                removeClassName="selected-item-list__remove--subtle"
                                items={userGroups.map(gr => ({ id: gr, name: gr }))}
                                onRemoveItem={handleRemove}
                            />
                        )}
                    </div>
                    <div className="grid__col-6">
                        <h2 className="margin-top--1 margin-bottom--1">Add a team for the user to join</h2>
                        <div className="search__input-group margin-bottom--1">
                            <Magnifier classes="search__icon-magnifier" viewBox="0 0 28 28" />
                            <label htmlFor="search" className="visually-hidden">
                                Search teams by name
                            </label>
                            <input role="search" name="search" placeholder="Search teams by name" {...search} />
                        </div>
                        {loadingGroups && <Loader classNames="grid grid--align-center grid--align-self-center grid--full-height" />}
                        {!loadingGroups && groups.length > 0 && <Table handleClick={handleAdd} items={search.value ? getFliteredUsers() : groups} />}
                    </div>
                </div>
            </div>
            <FormFooter
                hasValues={hasValues}
                loading={isAdding}
                redirectUrl={`${rootPath}/users`}
                handleSubmit={() => addGroupsToUser(id, userGroups)}
            />
        </div>
    );
}

export default AddGroupsToUser;
