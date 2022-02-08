import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import url from "../../../utilities/url";
import Input from "../../../components/Input";
import useForm from "../../../hooks/useForm";
import Warning from "../../../icons/Warning";
import validate from "./validate";
import FormValidationError from "./ValidationErrors";

const NewUser = ({ createUser, rootPath, loading }) => {
    const { values, errors, handleChange, handleSubmit } = useForm(handleSave, validate, {});
    const hasErrors = Object.keys(errors).length > 0;
    const hasValues = Object.keys(values).length > 0;

    function handleSave() {
        createUser(values);
    }

    return (
        <form className="form">
            <div className="grid grid--justify-space-around">
                <div className="grid__col-9">
                    <div className="margin-top--2">
                        &#9664;&nbsp;<Link to={url.resolve("../")}>Back</Link>
                    </div>
                    <h2 className="margin-top--1">Create user</h2>
                    {hasErrors && <FormValidationError errors={errors} />}
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
            </div>
            <div className="grid grid--justify-space-around padding-bottom--1 padding-top--1 form__footer">
                <div className="grid__col-9">
                    <div className="grid grid--align-baseline">
                        <button type="submit" className="btn btn--positive btn--margin-right" onClick={handleSubmit} disabled={hasErrors}>
                            {loading ? <div className="loader loader--dark" data-testid="loader" /> : "Save changes"}
                        </button>
                        <Link to={url.resolve("../")} className="btn btn--invert-primary btn--margin-right">
                            Cancel
                        </Link>
                        {hasValues && (
                            <span>
                                <Warning classes="svg-icon--action-bar" ariaLabel="warning icon" viewBox="0 0 512 512" />
                                &nbsp;You have unsaved changes
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </form>
    );
};

NewUser.propTypes = {
    createUser: PropTypes.func.isRequired,
    pushToUsers: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    rootPath: PropTypes.string.isRequired,
};

export default NewUser;
