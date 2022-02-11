import React, { useEffect } from "react";
import BackButton from "../../../components/back-button/BackButton";
import FormFooter from "../../../components/form-footer";
import Table from "../../../components/table";
import SelectedItemList from "../../../components/selected-items/SelectedItemList";
import Loader from "../../../components/loader/Loader";
import { useState } from "react";

function UserDetails(props) {
    console.log("PROPS GROUPS", props.groups);
    console.log("PROPS loadingGroups", props.loadingGroups);
    const { loading, user, groups, loadUser, loadingGroups, loadGroups } = props;
    const [userGroups, setUserGroups] = useState([]);
    const id = props.params.userID;

    useEffect(() => {
        loadUser(id);
        loadGroups();
    }, []);

    const hasValues = userGroups.length > 0;
    const handleSubmit = () => {
        console.log("Boooo");
    };
    return (
        <div className="grid grid--justify-space-around">
            <div className="grid__col-9">
                <BackButton classNames={"margin-top--2"} />
                <div className="grid grid--justify-space-around">
                    <div className="grid__col-6">
                        <h1 className="margin-top--1 margin-bottom--1">{`${user?.forename} ${user?.lastname}`}</h1>
                        <p>{user?.id}</p>
                        <h2>Team Member</h2>
                        {userGroups.length === 0 && <p>Nothing to show.</p>}
                        {userGroups && <SelectedItemList items={userGroups} onRemoveItem={handleSubmit} />}
                    </div>
                    <div className="grid__col-6">
                        <h2 className="margin-top--1 margin-bottom--1">Add a team for the user to join</h2>
                        {loadingGroups && <Loader />}
                        {!loadingGroups && groups.length > 0 && <Table handleClick={handleSubmit} items={groups} />}
                    </div>
                </div>
            </div>
            <FormFooter hasValues={hasValues} loading={loading} handleSubmit={handleSubmit} />
        </div>
    );
}

export default UserDetails;
