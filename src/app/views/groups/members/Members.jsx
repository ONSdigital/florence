import React, { useEffect } from "react";
import PropTypes from "prop-types";
import Chip from "../../../components/chip/Chip";
import Loader from "../../../components/loader";

const Members = ({ id, members, handleRemove, loadMembers, loading }) => {
    useEffect(() => {
        loadMembers(id);
    }, []);

    console.log("members", members);
    return (
        <div classNames="" data-testid="members">
            <h2>Members</h2>
            {loading && <Loader classNames="grid grid--align-center grid--align-self-center" />}
            {members && members.length === 0 && <p>Team doesn't have any members. Please add them.</p>}
            <div className="chip__container chip__container--gap-10">
                {members.map(member => (
                    <Chip
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

// Members.propTypes = {
//     members: PropTypes.arrayOf(
//             id: PropTypes.string,
//             forename: PropTypes.string,
//     ).isRequired,
//     handleRemove: PropTypes.func,
// };

export default Members;
