import React, { Component } from "react";
import PropTypes from "prop-types";

import Input from "../../components/Input";

const propTypes = {
    formData: PropTypes.shape({
        inputs: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.string,
                label: PropTypes.string,
                type: PropTypes.string,
                onChange: PropTypes.func,
                error: PropTypes.string
            })
        ),
        onSubmit: PropTypes.func,
        isSubmitting: PropTypes.bool,
        enableNewSignIn: PropTypes.bool
    })
};

export default class LoginForm extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const inputs = this.props.formData.inputs;
        const isSubmitting = this.props.formData.isSubmitting;

        return (
            <div className="grid grid--justify-center">
                <div className="grid__col-3">
                    <h1>Log in to your Florence account</h1>

                    <form className="form" onSubmit={this.props.formData.onSubmit}>
                        {inputs.map((input, index) => {
                            return <Input key={index} {...input} disabled={isSubmitting} allowAutoComplete={true} />;
                        })}
                        {/*<input type="checkbox" name="toggle-password" id="toggle-password" value="false" className={"checkbox"} />*/}
                        {/*<label htmlFor="toggle-password" className={"checkbox__label"}>*/}
                        {/*    Show password*/}
                        {/*</label>*/}

                        <button type="submit" className="btn btn--primary margin-top--1" disabled={isSubmitting}>
                            Log in
                        </button>

                        {isSubmitting ? <div className="form__loader loader loader--dark margin-left--1" /> : ""}
                    </form>
                </div>
            </div>
        );
    }
}

LoginForm.propTypes = propTypes;
