import React from "react";
import UserGroupsList from "../groups/UserGroupsList";

const User = ({ id, forename, lastname, userGroups, handleRemove }) => (
    <div data-testid="user">
        <h1 className="margin-top--1 margin-bottom--1">{`${forename} ${lastname}`}</h1>
        <p>{id}</p>
        <h2 className="margin-top--1">Team Member</h2>
        {userGroups && userGroups.length > 0 ? (
            <UserGroupsList groups={userGroups} handleRemove={handleRemove} />
        ) : (
            <p>User is not a member of a team. Please add them to a team.</p>
        )}
    </div>
);

export default User;
