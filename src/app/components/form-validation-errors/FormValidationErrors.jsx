import React from "react";

const FormValidationErrors = ({ errors }) => {
    if (Object.keys(errors).length === 0) return null;
    return (
        <div role="alert" className="panel panel--error panel--no-title margin-top--1 margin-bottom--1">
            <p className="panel__error">
                <strong>Fix the following:</strong>
            </p>
            <ul className="list list--neutral margin-bottom--1">
                {Object.keys(errors).map(key => (
                    <li key={key}>
                        <a className="panel__error" href={`#${key}`}>
                            {errors[key]}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FormValidationErrors;
