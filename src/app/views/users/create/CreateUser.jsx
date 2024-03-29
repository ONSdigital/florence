import React from "react";
import isEqual from "lodash/isEqual";
import isEmpty from "lodash/isEmpty";
import PropTypes from "prop-types";
import { Link } from "react-router";
import url from "../../../utilities/url";
import Input from "../../../components/Input";
import useForm from "../../../hooks/useForm";
import Warning from "../../../icons/Warning";
import validate from "./validate";
import BackButton from "../../../components/back-button";
import FormFooter from "../../../components/form-footer";
import FormValidationErrors from "../../../components/form-validation-errors";

// this is used to determine if changes has been made
const initialValues = { lastname: "", forename: "", email: "" };

const CreateUser = ({ createUser, rootPath, loading }) => {
    const { values, errors, handleChange, handleSubmit } = useForm(handleSave, validate, initialValues);
    const hasErrors = !isEmpty(errors);
    const hasNewValues = !isEqual(values, initialValues);

    function handleSave() {
        if (!hasErrors) createUser(values);
    }

    return (
        <form className="form form-with-sticky-footer">
            <div className="grid grid--justify-space-around">
                <div className="grid__col-11 grid__col-md-9">
                    <BackButton classNames="margin-top--2" />
                    <h2 className="margin-top--1">Create user</h2>
                    {hasErrors && <FormValidationErrors errors={errors} />}
                    <div className="grid">
                        <div className="grid__col-lg-6">
                            <Input
                                id="forename"
                                name="forename"
                                label="First name"
                                type="text"
                                error={errors?.forename}
                                onChange={handleChange}
                                value={values?.forename}
                            />
                            <Input
                                id="lastname"
                                name="lastname"
                                label="Last name"
                                type="text"
                                error={errors?.lastname}
                                onChange={handleChange}
                                value={values?.lastname}
                            />
                            <Input
                                id="email"
                                name="email"
                                label="Email address"
                                type="email"
                                error={errors?.email}
                                onChange={handleChange}
                                value={values?.email}
                            />
                        </div>
                    </div>
                </div>
                <FormFooter hasNewValues={hasNewValues} loading={loading} handleSubmit={handleSubmit} />
            </div>
        </form>
    );
};

CreateUser.propTypes = {
    createUser: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    rootPath: PropTypes.string.isRequired,
};

export default CreateUser;
