import React from "react";

const Panel = props => {
    // <dl className={"panel panel--warning"}>
    //     <dt className={"panel__heading"}>Fix the following:</dt>
    //     <dd className={"panel__description"}>Email address or password are incorrect</dd>
    // </dl>
    return (
        <div>
            <div aria-labelledby="error-summary-title" role="alert" tabIndex="-1" autofocus="autofocus" className="panel panel--error">
                <div className="panel__header">
                    <h2 id="error-summary-title" data-qa="error-header" className="panel__title">
                        There are 2 problems
                    </h2>
                </div>
                <div className="panel__body">
                    <ol className="list">
                        <li className="list__item ">
                            <a href="#container-test-number" className="list__link js-inpagelink">
                                Enter a number
                            </a>
                        </li>
                        <li className="list__item ">
                            <a href="#container-test-percent" className="list__link js-inpagelink">
                                Enter a number less than or equal to 100
                            </a>
                        </li>
                    </ol>
                </div>
            </div>
            <div className="panel panel--info panel--no-title">
                <div className="panel__body">
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                </div>
            </div>
            <div className="panel panel--error panel--no-title">
                <div className="panel__body">
                    <p className="panel__error">
                        <strong>Fix the following:</strong>
                    </p>
                    <p>Email address or password are incorrect</p>
                </div>
            </div>
            <div className="panel panel--success panel--no-title" id="success-id">
                <span className="panel__icon">
                    <svg className="svg-icon" viewBox="0 0 13 10" xmlns="http://www.w3.org/2000/svg" focusable="false">
                        <path
                            d="M14.35,3.9l-.71-.71a.5.5,0,0,0-.71,0h0L5.79,10.34,3.07,7.61a.51.51,0,0,0-.71,0l-.71.71a.51.51,0,0,0,0,.71l3.78,3.78a.5.5,0,0,0,.71,0h0L14.35,4.6A.5.5,0,0,0,14.35,3.9Z"
                            transform="translate(-1.51 -3.04)"
                        />
                    </svg>
                </span>
                <div className="panel__body">Information has been successfully submitted.</div>
            </div>
            <div className="panel panel--error panel--no-title">
                <div className="panel__body">
                    <p className="panel__error">
                        <strong>Enter a number</strong>
                    </p>
                    <div className="field">
                        <label className="label  " htmlFor="number">
                            Number of employees paid monthly
                        </label>
                        <input
                            type="text"
                            id="number"
                            className="input input--text input-type__input  input--error   input--w-5"
                            pattern="[0-9]*"
                            inputMode="numeric"
                            min
                            required="true"
                        />
                    </div>
                </div>
            </div>
            <div className="announcement">
                <div className="padding-right--1 padding-left--1">
                    <div className="panel panel--announcement panel--no-title">
                        <span className="panel__icon" aria-hidden="true">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24px"
                                height="24px"
                                viewBox="0 0 24 24"
                                focusable="false"
                                aria-hidden="true"
                            >
                                <path
                                    d="M4.2,12c0-0.6,0.4-1,1-1h11.2l-4.9-4.9c-0.4-0.4-0.4-1,0-1.4c0.4-0.4,1-0.4,1.4,0l6.6,6.6c0.4,0.4,0.4,1,0,1.4l-6.6,6.6c-0.4,0.4-1,0.4-1.4,0c-0.4-0.4-0.4-1,0-1.4l4.9-4.9H5.2C4.7,13,4.2,12.6,4.2,12z"
                                    fill="currentColor"
                                />
                            </svg>
                        </span>
                        <div className="panel__body">
                            <p className="">National lockdown: stay at home</p>
                            <div>
                                <p>
                                    Coronavirus (COVID-19) remains a serious threat across the country. <a href="#0">Find out more</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="panel panel--warn panel--no-title">
                <span className="panel__icon" aria-hidden="true">
                    !
                </span>
                <div className="panel__body">All of the information about this person will be deleted</div>
            </div>
        </div>
    );
};
export default Panel;
