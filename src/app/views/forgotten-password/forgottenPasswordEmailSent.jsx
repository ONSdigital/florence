import React from "react";
import PropTypes from "prop-types";
import Panel from "../../components/panel/Panel";

const propTypes = {
    validationErrors: PropTypes.shape({
        heading: PropTypes.string,
        body: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
    }),
    onSubmit: PropTypes.func,
    email: PropTypes.string
};

const ForgottenPasswordEmailSent = props => {
    const noEmailBody = (
        <div className={"margin-top--1"}>
            <p>
                If you did not get the email you can
                <a href={"/florence/forgotten-password"} className={"colour--primary-link"}>
                    reset your password again.
                </a>
            </p>
            <p>
                Alternatively, to get help and support with your Florence account, please email&nbsp;
                <a href="mailto:publishing@ons.gov.uk">publishing@ons.gov.uk</a>
            </p>
        </div>
    );
    return (
        <div className="grid grid--justify-center">
            <div className="grid__col-4">
                <h1>We sent you an email</h1>
                <p className={"font-size--18 margin-bottom--1"}>
                    If you have a Florence account, we’ve sent an email to <b>{props.email}</b>.
                </p>
                <p>You need to follow the link in the email to reset your password.</p>
                <p className={"margin-bottom--1"}>If you do not reset your password straight away, you may need to reset it again.</p>
                <Panel type={"information"} heading={"If you did not get the email"} body={noEmailBody} />
            </div>
        </div>
    );
};
ForgottenPasswordEmailSent.propTypes = propTypes;
export default ForgottenPasswordEmailSent;
