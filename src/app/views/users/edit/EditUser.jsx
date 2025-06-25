import React, { useEffect, useState } from "react";
import { withRouter } from "react-router";
import isEqual from "lodash/isEqual";
import isEmpty from "lodash/isEmpty";
import Input from "../../../components/Input";
import validate from "./validate";
import FormValidationErrors from "../../../components/form-validation-errors";
import BackButton from "../../../components/back-button";
import FormFooter from "../../../components/form-footer";
import Loader from "../../../components/loader";
import RadioGroup from "../../../components/radio-buttons/RadioGroup";
import UserGroupsList from "../groups/UserGroupsList";
import { default as IdentityAPI } from "../../../utilities/api-clients/user";

const USER_ACCESS_OPTIONS = [
    {
        id: "active",
        value: "active",
        label: "Active",
    },
    {
        id: "suspended",
        value: "suspended",
        label: "Suspended",
    },
];

export const EditUser = props => {
    const id = props.params.id;

    useEffect(() => {
        if (id) {
            props.loadUser(id);
            props.loadUserGroups(id);
        }
    }, [id]);

    const { user, userGroups, loading, updateUser, setUserPassword } = props;
    const [values, setValues] = useState(null);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const hasErrors = !isEmpty(errors);
    const hasNewValues = !isEqual(values, user);

    const routerWillLeave = nextLocation => {
        if (hasNewValues && !isSubmitting) return "Your work is not saved! Are you sure you want to leave?";
    };

    useEffect(() => {
        props.router.setRouteLeaveHook(props.route, routerWillLeave);
    });

    useEffect(() => {
        if (user) {
            setValues({ ...user });
        }
    }, [user]);

    const handleSubmit = e => {
        if (e) e.preventDefault();
        setErrors(validate(values));
        setIsSubmitting(true);
        if (hasErrors) return;
        updateUser(id, values);
    };

    const handleAccountReset = e => {
        if (e) e.preventDefault();
        setIsSubmitting(true);
        if (hasErrors) return;
        setUserPassword(id);
    };

    const handleChange = e => {
        const key = e.target.name;
        const val = e.target.value;
        setIsSubmitting(false);

        if (Object.keys(errors).length > 0) {
            delete errors[e.target.name];
            setErrors(errors);
        }
        setValues(values => ({ ...values, [key]: val }));
    };

    const handleAccessChange = e => {
        setValues(values => ({ ...values, active: e.id === "active" }));
    };

    const isAdmin = props.loggedInUser.isAdmin || false;

    if (loading) return <Loader classNames="grid grid--align-center grid--align-self-center grid--full-height" />;

    if (!user) return <h1>No user found.</h1>;

    return (
        <form className="form form-with-sticky-footer">
            <div className="grid grid--justify-space-around">
                <div className="grid__col-11 grid__col-md-9">
                    <BackButton classNames="margin-top--2" />
                    <div className="grid grid--justify-space-between">
                        <div className="grid__col-md-6">
                            <h1 className="margin-top--1 margin-bottom--1">{`${user.forename} ${user.lastname}`}</h1>

                            <dl>
                                <dt id="email">Email</dt>
                                <dd aria-labelledby="email">{user.email}</dd>
                                {isAdmin && (
                                    <>
                                        <dt id="status">Status</dt>
                                        <dd aria-labelledby="status">{IdentityAPI.translateStatus(user.status)}</dd>
                                    </>
                                )}
                            </dl>
                            {hasErrors && <FormValidationErrors errors={errors} />}
                            {isAdmin && (
                                <>
                                    <Input
                                        error={errors?.forename}
                                        id="forename"
                                        label="First name"
                                        name="forename"
                                        type="text"
                                        value={values?.forename ? values.forename : ""}
                                        onChange={handleChange}
                                    />
                                    <Input
                                        error={errors?.lastname}
                                        id="lastname"
                                        label="Last name"
                                        name="lastname"
                                        type="text"
                                        value={values?.lastname ? values.lastname : ""}
                                        onChange={handleChange}
                                    />
                                </>
                            )}
                            <h2 className="margin-top--1">Team Member</h2>
                            {userGroups && userGroups.length > 0 ? (
                                <UserGroupsList groups={userGroups} />
                            ) : (
                                <p>{`User is not a member of a team.${isAdmin ? " Please add them to a team." : ""}`}</p>
                            )}
                        </div>
                        {isAdmin && (
                            <div className="grid__col-md-5">
                                <div className="margin-bottom--1">
                                    <h2>User account reset</h2>
                                    <p className="margin-bottom--1">
                                        If a user has not used their temporary password issued on account creation within 1 week, their account will
                                        need to be reset to receive 'Forgotton password' emails
                                    </p>

                                    <button
                                        disabled={hasErrors}
                                        type="submit"
                                        className="btn btn--warning btn--margin-right"
                                        onClick={handleAccountReset}
                                    >
                                        {loading ? <div className="loader loader--dark" data-testid="loader" /> : "Reset Account"}
                                    </button>
                                </div>

                                <div className="form-group margin-top--1 margin-bottom--1">
                                    <RadioGroup
                                        groupName="active"
                                        inline
                                        legend="User Access"
                                        radioData={USER_ACCESS_OPTIONS}
                                        selectedValue={values?.active ? "active" : "suspended"}
                                        onChange={handleAccessChange}
                                    />
                                    <Input
                                        id="status_notes"
                                        label="Notes"
                                        name="status_notes"
                                        type="textarea"
                                        value={values?.status_notes}
                                        onChange={handleChange}
                                    />
                                    <p>
                                        Add the reason for changing the users' access. For example, they have left or no longer need access to
                                        Florence. Do not include any personal information.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                {isAdmin && <FormFooter hasNewValues={hasNewValues} hasErrors={hasErrors} loading={loading} handleSubmit={handleSubmit} />}
            </div>
        </form>
    );
};

export default withRouter(EditUser);
