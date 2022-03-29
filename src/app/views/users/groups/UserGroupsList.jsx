import React from "react";
import PropTypes from "prop-types";
import Chip from "../../../components/chip/Chip";

const UserGroupsList = ({ groups, handleRemove }) => (
    <div className="chip__container chip__container--gap-10" data-testid="UserGroupsList">
        {groups.map(group => {
            let icon = "person";
            let style = "standard";

            if (group.precedence === 1) {
                icon = "shield-tick";
                style = "green";
            }

            if (group.precedence === 2) {
                icon = "shield-person";
                style = "blue";
            }
            return <Chip key={group.id} id={group.id} icon={icon} style={style} text={group.name} removeFunc={handleRemove} />;
        })}
    </div>
);

UserGroupsList.propTypes = {
    groups: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
        })
    ).isRequired,
    handleRemove: PropTypes.func,
};

export default UserGroupsList;
