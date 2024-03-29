import React from "react";
import Warning from "../../icons/Warning";
import url from "../../utilities/url";
import { Link } from "react-router";

function FormFooter({ loading, hasErrors, hasNewValues, handleSubmit, redirectUrl }) {
    const to = redirectUrl ? redirectUrl : url.resolve("../");
    return (
        <div className="grid grid--justify-space-around padding-bottom--1 padding-top--1 form-footer" data-testid="form-footer">
            <div className="grid__col-9">
                <div className="grid grid--align-baseline">
                    <button
                        disabled={hasErrors}
                        type="submit"
                        className="btn btn--positive btn--margin-right"
                        onClick={handleSubmit}
                        disabled={hasErrors}
                    >
                        {loading ? <div className="loader loader--dark" data-testid="loader" /> : "Save changes"}
                    </button>
                    <Link role="button" to={to} className="btn btn--invert-primary btn--margin-right">
                        Cancel
                    </Link>
                    {hasNewValues && (
                        <span>
                            <Warning classes="svg-icon--action-bar" ariaLabel="warning icon" viewBox="0 0 512 512" />
                            &nbsp;You have unsaved changes
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

export default FormFooter;
