import React, { Component } from "react";
import PropTypes from "prop-types";

const propTypes = {
    errors: PropTypes.arrayOf(PropTypes.string),
};

class FormErrorSummary extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        if (!this.props.errors.length) {
            return null;
        }
        return (
            <div className="error-summary" role="alert" aria-labelledby="error-summary-heading">
                <h2 id="error-summary-heading">Errors</h2>
                <p>Before saving please correct the following</p>
                <ul className="error-summary__list">
                    {this.props.errors.map((error, index) => {
                        return (
                            <li key={index} className="error-summary__list-item">
                                {error}
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    }
}

FormErrorSummary.propTypes = propTypes;
export default FormErrorSummary;
