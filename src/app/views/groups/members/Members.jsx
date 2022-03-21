import React, { useEffect } from "react";
import PropTypes from "prop-types";
import Chip from "../../../components/chip/Chip";
import Loader from "../../../components/loader";

const Members = ({ id, members, handleRemove, loading }) => {
    if (!members) return null;
    return (
        <div data-testid="members" className="simple-table__scroll margin-bottom--1">
            <h2>Members</h2>
            {loading && <Loader classNames="grid grid--align-center grid--align-self-center" />}
            {members && members.length === 0 && <p>Team doesn't have any members. Please add them.</p>}
            <div className="chip__container chip__container--gap-10 ">
                {members.map(member => (
                    <Chip
                        member={member}
                        key={member.id}
                        id={member.id}
                        icon="person"
                        style="standard"
                        text={`${member.forename} ${member.lastname}`}
                        removeFunc={handleRemove}
                    />
                ))}
            </div>
        </div>
    );
};

Members.propTypes = {
    members: PropTypes.arrayOf(
        PropTypes.shape({
            active: PropTypes.bool,
            id: PropTypes.string,
            email: PropTypes.string,
            forename: PropTypes.string,
            lastname: PropTypes.string,
            status: PropTypes.string,
            status_notes: PropTypes.string,
        })
    ).isRequired,
    handleRemove: PropTypes.func.isRequired,
};

export default Members;
