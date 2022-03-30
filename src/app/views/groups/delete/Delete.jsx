import React, { useState } from "react";
import PropTypes from "prop-types";
import isEqual from "lodash/isEqual";
import isEmpty from "lodash/isEmpty";
import Loader from "../../../components/loader/Loader";

const Delete = ({ id, deleteGroup, openModal, closeModal, loading }) => {
    const popout = {
        id: "delete",
        title: "Are you sure you want to delete this preview team?",
        body: "Team members cannot view content linked to this preview team after it has been deleted.",
        buttons: [
            {
                onClick: () => handleSubmit(),
                text: "Delete preview team",
                style: "warning",
            },
            {
                onClick: () => closeModal(["delete"]),
                text: "Cancel",
                style: "invert-primary",
            },
        ],
    };

    const handleClick = e => {
        e.preventDefault();
        openModal(popout);
    };

    const handleSubmit = () => {
        closeModal(["delete"]);
        deleteGroup(id);
    };

    return (
        <div className="grid__col-11 grid__col-md-9">
            {loading ? (
                <Loader />
            ) : (
                <div role="alert" className="panel panel--error panel--no-title margin-top--1 margin-bottom--1">
                    <h2 className="panel__error font-size--16">
                        <strong>Delete preview team</strong>
                    </h2>
                    <p>Team members cannot view content linked to this preview team after it has been deleted.</p>
                    <button className="btn btn--warning margin-top--1 margin-bottom--1" onClick={handleClick}>
                        Delete team
                    </button>
                </div>
            )}
        </div>
    );
};

Delete.propTypes = {
    id: PropTypes.string.isRequired,
    deleteGroup: PropTypes.func.isRequired,
    openModal: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
};

export default Delete;
