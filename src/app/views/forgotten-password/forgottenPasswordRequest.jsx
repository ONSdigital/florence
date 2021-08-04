import React from "react";
import Input from "../../components/Input";
import PropTypes from "prop-types";
import Panel from "../../components/panel/Panel";

const propTypes = {
    validationErrors: PropTypes.shape({
        hading: PropTypes.string,
        body: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
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
    return (
        <div className="grid grid--justify-center">
            <div className="grid__col-4">
                <h1>Forgotten password</h1>
                <p className={"font-size--18 margin-bottom--2"}>We'll email you a link to reset your password.</p>
                {props.validationErrors.body && (
                    <div className={"margin-bottom--1"}>
                        <Panel className={""} type={"error"} heading={props.validationErrors.heading} body={props.validationErrors.body} />
                    </div>
                )}
                <form className="form" onSubmit={props.onSubmit}>
                    <Input {...props.emailInput} allowAutoComplete={true} />
                    <button type="submit" className="btn btn--primary margin-top--1">
                        Send the link
                    </button>
                    {props.waitingResponse ? <div className="form__loader loader loader--dark margin-left--1" /> : ""}
                </form>
            </div>
        </div>
    );
};
ForgottenPasswordRequest.propTypes = propTypes;
export default ForgottenPasswordRequest;
