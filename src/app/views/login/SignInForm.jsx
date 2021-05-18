import React from "react";

import Input from "../../components/Input";

const LoginForm = props => {
    return (
        <div className="grid grid--justify-center">
            <div className="grid__col-3">
                <h1>Log in to your Florence account</h1>

                <form className="form" onSubmit={props.onSubmit}>
                    {props.inputs.map((input, index) => {
                        return <Input key={index} {...input} disabled={props.isSubmitting} allowAutoComplete={true} />;
                    })}

                    <button type="submit" className="btn btn--primary margin-top--1" disabled={props.isSubmitting}>
                        Log in
                    </button>

                    {props.isSubmitting ? <div className="form__loader loader loader--dark margin-left--1" /> : ""}
                </form>
            </div>
        </div>
    );
};
export default LoginForm;
