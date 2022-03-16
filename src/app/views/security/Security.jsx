import React from "react";
import PropTypes from "prop-types";
import BackButton from "../../components/back-button";
import Loader from "../../components/loader/Loader";

const Security = ({ signOutAllUsers, openModal, closeModal, loading }) => {
    const popout = {
        id: "sign-out",
        title: "Are you sure you want to sign out all users?",
        body: "Users will need to sign in to Florence again and may lose unsaved changes.",
        buttons: [
            {
                onClick: () => handleSubmit(),
                text: "Sign out all users",
                style: "positive",
            },
            {
                onClick: () => closeModal(["sign-out"]),
                text: "Cancel",
                style: "invert-primary",
            },
        ],
    };

    const handleClick = () => {
        openModal(popout);
    };

    const handleSubmit = () => {
        closeModal(["sign-out"]);
        signOutAllUsers();
    };

    return (
        <div className="grid grid--justify-space-around">
            <div className="grid__col-11 grid__col-md-9">
                <BackButton classNames="margin-top--2" />
                <h2 className="margin-top--1">Security</h2>
                <div className="grid">
                    <div className="grid__col-lg-6">
                        {loading ? (
                            <Loader />
                        ) : (
                            <div role="alert" className="panel panel--error panel--no-title margin-top--1 margin-bottom--1">
                                <p className="panel__error">
                                    <strong>Secure Florence</strong>
                                </p>
                                <p>All users will be signed out straight away and will need to sign in again.</p>
                                <button type="submit" className="btn btn--warning margin-top--1 margin-bottom--1" onClick={handleClick}>
                                    Sign out all users
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

Security.propTypes = {
    signOutAllUsers: PropTypes.func.isRequired,
    openModal: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
};

export default Security;
