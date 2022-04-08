import React from "react";

import PropTypes from "prop-types";

const propTypes = {
    buttonText: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    isSubmitting: PropTypes.bool,
    class: PropTypes.string,
    disabled: PropTypes.bool
};

const ButtonWithShadow = props => (
    <button
        type={props.type}
        className={`ons-btn ${props.class ? 'ons-btn--'+props.class : ''}`}
        onClick={props.onClick}
        disabled={props.disabled}
    >
        <span className="ons-btn__inner">{props.buttonText}
            {
                props.isSubmitting && (
                    <svg className="ons-svg-icon ons-u-ml-xs" xmlns="http://www.w3.org/2000/svg" focusable="false"
                         viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" fill="currentcolor">
                        <rect x="0" y="0" width="100" height="100" fill="none"/>
                        <rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' transform='rotate(0 50 50) translate(0 -30)'>
                            <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0s' repeatCount='indefinite'/>
                        </rect>
                        <rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' transform='rotate(30 50 50) translate(0 -30)'>
                            <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.08333333333333333s'
                                     repeatCount='indefinite'/>
                        </rect>
                        <rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' transform='rotate(60 50 50) translate(0 -30)'>
                            <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.16666666666666666s'
                                     repeatCount='indefinite'/>
                        </rect>
                        <rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' transform='rotate(90 50 50) translate(0 -30)'>
                            <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.25s' repeatCount='indefinite'/>
                        </rect>
                        <rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' transform='rotate(120 50 50) translate(0 -30)'>
                            <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.3333333333333333s'
                                     repeatCount='indefinite'/>
                        </rect>
                        <rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' transform='rotate(150 50 50) translate(0 -30)'>
                            <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.4166666666666667s'
                                     repeatCount='indefinite'/>
                        </rect>
                        <rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' transform='rotate(180 50 50) translate(0 -30)'>
                            <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.5s' repeatCount='indefinite'/>
                        </rect>
                        <rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' transform='rotate(210 50 50) translate(0 -30)'>
                            <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.5833333333333334s'
                                     repeatCount='indefinite'/>
                        </rect>
                        <rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' transform='rotate(240 50 50) translate(0 -30)'>
                            <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.6666666666666666s'
                                     repeatCount='indefinite'/>
                        </rect>
                        <rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' transform='rotate(270 50 50) translate(0 -30)'>
                            <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.75s' repeatCount='indefinite'/>
                        </rect>
                        <rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' transform='rotate(300 50 50) translate(0 -30)'>
                            <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.8333333333333334s'
                                     repeatCount='indefinite'/>
                        </rect>
                        <rect x='46.5' y='40' width='7' height='20' rx='5' ry='5' transform='rotate(330 50 50) translate(0 -30)'>
                            <animate attributeName='opacity' from='1' to='0' dur='1s' begin='0.9166666666666666s'
                                     repeatCount='indefinite'/>
                        </rect>
                    </svg>
                )
            }
        </span>
    </button>
);

ButtonWithShadow.propTypes = propTypes;
export default ButtonWithShadow;
