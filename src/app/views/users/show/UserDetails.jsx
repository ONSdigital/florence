import React, { useEffect } from "react";
import BackButton from "../../../components/back-button/BackButton";
import FormFooter from "../../../components/form-footer";
import Table from "../../../components/table";
import SelectedItemList from "../../../components/selected-items/SelectedItemList";
import Loader from "../../../components/loader/Loader";
import { useState } from "react";

function UserDetails(props) {
    const { loading, user, groups, loadUser, loadingGroups, loadGroups, addGroupsToUser, isAdding } = props;
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

    return (
        <div className="grid grid--justify-space-around">
            <div className="grid__col-9">
                <BackButton to={"/users"} classNames={"margin-top--2"} />
                <div className="grid grid--justify-space-around">
                    <div className="grid__col-6">
                        <h1 className="margin-top--1 margin-bottom--1">{`${user?.forename} ${user?.lastname}`}</h1>
                        <p>{user?.id}</p>
                        <h2>Team Member</h2>
                        {userGroups.length === 0 && <p>Nothing to show.</p>}
                        {userGroups && <SelectedItemList items={userGroups.map(gr => ({ id: gr, name: gr }))} onRemoveItem={handleRemove} />}
                    </div>
                    <div className="grid__col-6">
                        <h2 className="margin-top--1 margin-bottom--1">Add a team for the user to join</h2>
                        {loadingGroups && <Loader classNames="grid grid--align-center grid--align-self-center grid--full-height" />}
                        {!loadingGroups && groups.length > 0 && <Table handleClick={handleAdd} items={groups} />}
                    </div>
                </div>
            </div>
            <FormFooter hasValues={hasValues} loading={isAdding} redirectUrl="users/create" handleSubmit={() => addGroupsToUser(id, userGroups)} />
        </div>
    );
}

export default UserDetails;
