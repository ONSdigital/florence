import { deleteGroup } from "../../../config/thunks";
import Panel from "../../../components/panel/Panel";
import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

const propTypes = { groupID: PropTypes.string, deleteGroup: PropTypes.func };

export const DeleteTeam = props => {
    const { groupID, deleteGroup } = props;
    const panelProps = {
        type: "error",
        heading: "Delete preview group",
        body: (
            <>
                <p>Team members cannot view content linked to this preview team after it has been deleted.</p>
                <button
                    id="delete-group"
                    type="button"
                    key="delete-group"
                    onClick={() => {
                        deleteGroup(groupID);
                    }}
                    className={"btn btn--warning margin-top--1"}
                >
                    Delete Team
                </button>
            </>
        ),
    };

    return (
        <div className="margin-top--1">
            <Panel {...panelProps} />
        </div>
    );
};

const mapDispatchToProps = dispatch => ({
    deleteGroup: groupID => {
        dispatch(deleteGroup(groupID));
    },
});
DeleteTeam.propTypes = propTypes;
export default connect(null, mapDispatchToProps)(DeleteTeam);
