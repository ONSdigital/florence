import React from "react";
import Panel from "../../components/panel/Panel";

const SetForgottenPasswordConfirmed = props => {
    const setForgotPasswordPanelBody = (
        <p>
            If you have technical problems with your account, please email&nbsp;<a href="mailto:publishing@ons.gov.uk">publishing@ons.gov.uk</a>
        </p>
    );

    return (
        <div className="grid grid--justify-center">
            <div className="grid__col-3">
                <h1>Your password has been changed</h1>
                <p className="font-size--18">
                    <b>What happens next</b>
                </p>
                <p className="margin-bottom--2">
                    You can now&nbsp;
                    <a href="/florence/login">sign in</a>
                    &nbsp;to your Florence account.
                </p>
                <Panel type={"information"} body={setForgotPasswordPanelBody} />
            </div>
        </div>
    );
};

export default SetForgottenPasswordConfirmed;
