import React from "react";

import Input from "../../components/Input";
import Panel from "../../components/panel/Panel";
import PropTypes from "prop-types";
import ButtonWithSpinner from "../../components/button/ButtonWithSpinner";

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
    const firstTimeSignIn = new URLSearchParams(location.search).get("first-time");
    const isFirstTimeSignIn = firstTimeSignIn != null && firstTimeSignIn === "true";
    return (
        <div className="grid grid--justify-center">
            <div className="grid__col-3">
                <h1>Sign in to your Florence account</h1>
                {showValidationErrorPanel && (
                    <div className="margin-bottom--1">
                        <Panel type={"error"} heading={props.validationErrors.heading} body={props.validationErrors.body} />
                    </div>
                )}
                <form className="form" onSubmit={props.onSubmit}>
                    {props.inputs.map((input, index) => {
                        return <Input key={index} {...input} disabled={props.isSubmitting} allowAutoComplete={true} />;
                    })}
                    {!isFirstTimeSignIn && (
                        <div>
                            <a href={"/florence/forgotten-password"}>Forgotten your password?</a>
                        </div>
                    )}
                    <ButtonWithSpinner isSubmitting={props.isSubmitting} buttonText="Sign in" />
                </form>
            </div>
        </div>
    );
};
LoginForm.propTypes = propTypes;
export default LoginForm;
