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
            return <Chip key={group.group_name} id={group.group_name} icon={icon} style={style} text={group.description} removeFunc={handleRemove} />;
        })}
    </div>
);

UserGroupsList.propTypes = {
    groups: PropTypes.arrayOf(
        // TODO: backend returns invalid object structure, needs updating the props.groups
        PropTypes.shape({
            group_name: PropTypes.string.isRequired, // id
            description: PropTypes.string, // name
        })
    ).isRequired,
    handleRemove: PropTypes.func,
};

export default UserGroupsList;
