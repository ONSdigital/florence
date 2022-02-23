import React from "react";
import SelectedItemList from "../../../components/selected-items/SelectedItemList";

function User({ id, forename, lastname, testid, userGroups, handleRemove }) {
    return (
        <div data-testid={testid}>
            <h1 className="margin-top--1 margin-bottom--1">{`${forename} ${lastname}`}</h1>
            <p>{id}</p>
            <h2 className="margin-top--1">Team Member</h2>
            {userGroups.length === 0 && <p>Nothing to show.</p>}
            {userGroups && (
                <SelectedItemList
                    classNames="selected-item-list__item--info"
                    removeClassNames="selected-item-list__remove--info"
                    items={userGroups.map(gr => ({ id: gr, name: gr }))}
                    handleRemoveItem={handleRemove}
                />
            )}
        </div>
    );
}

export default User;
