import React from "react";

import Input from "../../components/Input";
import Panel from "../../components/panel/Panel";
import PropTypes from "prop-types";

const propTypes = {
    validationErrors: PropTypes.shape({
        heading: PropTypes.string,
        body: PropTypes.arrayOf(PropTypes.elementType)
    }),
    onSubmit: PropTypes.func,
    isSubmitting: PropTypes.bool,
    inputs: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            label: PropTypes.string,
            type: PropTypes.string,
            onChange: PropTypes.func,
            error: PropTypes.string
        })
    )
};

const LoginForm = props => {
    const showValidationErrorPanel = props.validationErrors.body && props.validationErrors.body.length > 0;
    return (
        <div className="grid grid--justify-center">
            <div className="grid__col-3">
                <h1>Sign in to your Florence account</h1>
                {showValidationErrorPanel && (
                    <div className={"margin-bottom--1"}>
                        <Panel className={""} type={"error"} heading={props.validationErrors.heading} body={props.validationErrors.body} />
                    </div>
                )}
                <form className="form" onSubmit={props.onSubmit}>
                    {props.inputs.map((input, index) => {
                        return <Input key={index} {...input} disabled={props.isSubmitting} allowAutoComplete={true} />;
                    })}
                    <div>
                        <a href={"/florence/forgotten-password"}>Forgotten your password?</a>
                    </div>
                    <button type="submit" className="btn btn--primary margin-top--1" disabled={props.isSubmitting}>
                        Sign in
                    </button>
                    {props.isSubmitting ? <div className="form__loader loader loader--dark margin-left--1" /> : ""}
                </form>
            </div>
        </div>
    );
};
LoginForm.propTypes = propTypes;
export default LoginForm;
