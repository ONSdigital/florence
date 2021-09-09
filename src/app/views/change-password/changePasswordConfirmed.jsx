import React from "react";
import Panel from "../../components/panel/Panel";

const ChangePasswordConfirmed = props => {
    const changePasswordPanelBody = [
        <p key="info-technical">
            If you have technical problems with your account, please email&nbsp;<a href="mailto:publishing@ons.gov.uk">publishing@ons.gov.uk</a>
        </p>
    ];

    return (
        <div className="grid grid--justify-center">
            <div className="grid__col-3">
                <h1>Your password has been changed</h1>
                <a href="/florence/collections" className="margin-bottom--2 margin-right--5 anchor-btn">
                    Start using Florence
                </a>
                <Panel type={"information"} body={changePasswordPanelBody} />
            </div>
        </div>
    );
};

export default ChangePasswordConfirmed;
