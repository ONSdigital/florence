import React from "react";
import PropTypes from "prop-types";
import Panel from "../../components/panel/Panel";
import ButtonWithSpinner from "../../components/button/ButtonWithSpinner";
import Input from "../../components/Input";

const propTypes = {
    validationErrors: PropTypes.shape({
        heading: PropTypes.string,
        body: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.element,
            PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.element, PropTypes.elementType]))
        ])
    }),
    onSubmit: PropTypes.func,
    waitingResponse: PropTypes.bool,
    emailInput: PropTypes.shape({
        id: PropTypes.string,
        label: PropTypes.string,
        type: PropTypes.string,
        onChange: PropTypes.func,
        error: PropTypes.string
    })
};

const ForgottenPasswordRequest = props => {
    const validationErrorsToDisplay = props.validationErrors.body && props.validationErrors.body.length > 0;
    return (
        <div className="grid grid--justify-center">
            <div className="grid__col-4">
                <h1>Forgotten password</h1>
                <p className={"font-size--18 margin-bottom--2"}>We'll email you a link to reset your password.</p>
                {validationErrorsToDisplay && (
                    <div className="margin-bottom--1">
                        <Panel type={"error"} heading={props.validationErrors.heading} body={props.validationErrors.body} />
                    </div>
                )}
                <form className="form" onSubmit={props.onSubmit}>
                    <Input {...props.emailInput} allowAutoComplete={true} />
                    <ButtonWithSpinner isSubmitting={props.waitingResponse} buttonText={"Send the link"} />
                </form>
            </div>
        </div>
    );
};
ForgottenPasswordRequest.propTypes = propTypes;
export default ForgottenPasswordRequest;
