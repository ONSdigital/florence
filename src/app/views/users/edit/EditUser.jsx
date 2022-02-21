import React, { useEffect, useCallback, useState } from "react";
import isEqual from "lodash/isEqual";
import PropTypes from "prop-types";
import { Link } from "react-router";
import url from "../../../utilities/url";
import Input from "../../../components/Input";
import Warning from "../../../icons/Warning";
import validate from "./validate";
import FormValidationError from "./ValidationErrors";
import BackButton from "../../../components/back-button/BackButton";
import FormFooter from "../../../components/form-footer";
import SelectedItemList from "../../../components/selected-items/SelectedItemList";
import Loader from "../../../components/loader/index";
import RadioGroup from "../../../components/radio-buttons/RadioGroup";
import TextArea from "../../../components/text-area/TextArea";

const options = [
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

const EditUser = props => {
    const id = props.params.userID;

    useEffect(() => {
        if (id) {
            props.loadUser(id);
        }
    }, [id]);

    const { user, userGroups, loading, updateUser } = props;
    const [values, setValues] = useState(null);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const hasErrors = errors && Object.keys(errors).length > 0;
    const hasValues = !isEqual(values, user);

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

    if (loading) return <Loader classNames="grid grid--align-center grid--align-self-center grid--full-height" />;

    if (!user) return <h1>No user found.</h1>;

    return (
        <form className="form">
            <div className="grid grid--justify-space-around">
                <div className="grid__col-11 grid__col-md-9">
                    <BackButton classNames={"margin-top--2"} />
                    <div className="grid grid--justify-space-between">
                        <div className="grid__col-md-6">
                            <h1 className="margin-top--1 margin-bottom--1">{`${user.forename} ${user.lastname}`}</h1>
                            <p>{user.id}</p>
                            {hasErrors && <FormValidationError errors={errors} />}
                            <div className="grid">
                                <div className="grid__col-lg-6 margin-top--1">
                                    <Input
                                        id="forename"
                                        name="forename"
                                        label="First name"
                                        type="text"
                                        error={errors?.forename}
                                        value={values?.forename ? values.forename : ""}
                                        onChange={handleChange}
                                    />
                                    <Input
                                        id="lastname"
                                        name="lastname"
                                        label="Last name"
                                        type="text"
                                        error={errors?.lastname}
                                        onChange={handleChange}
                                        value={values?.lastname ? values.lastname : ""}
                                    />
                                    <h2 className="margin-top--1">Team Member</h2>
                                    {!userGroups.length == 0 && <p>User is not a member of a team. Please add them to a team.</p>}
                                    {userGroups && (
                                        <SelectedItemList
                                            classNames="selected-item-list__item--info"
                                            items={userGroups.map(gr => ({ id: gr, name: gr }))}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="grid__col-md-5">
                            <div className="form-group margin-top--1 margin-bottom--1">
                                <RadioGroup
                                    groupName="active"
                                    radioData={options}
                                    selectedValue={values?.active ? "active" : "suspended"}
                                    onChange={handleAccessChange}
                                    legend="User Access"
                                    inline
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
                                    Add the reason for changing the users' access. For example, they have left or no longer need access to Florence.
                                    Do not include any personal information.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <FormFooter hasValues={hasValues} loading={loading} handleSubmit={handleSubmit} />
            </div>
        </form>
    );
};

export default EditUser;
