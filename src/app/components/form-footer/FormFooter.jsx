import React from "react";
import BackButton from "../back-button";
import Warning from "../../icons/Warning";
import url from "../../utilities/url";
import { Link } from "react-router";

function FormFooter({ loading, hasErrors, hasValues, handleSubmit }) {
    return (
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
    );
}

export default FormFooter;
