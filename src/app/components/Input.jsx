import React, {Component} from 'react';
import PropTypes from 'prop-types';

const propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string,
    type: PropTypes.string,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    error: PropTypes.string,
    disabled: PropTypes.bool,
    isFocused: PropTypes.bool,
    inline: PropTypes.bool,
    accept: PropTypes.string,
    value: PropTypes.string,
    min: PropTypes.string,
    max: PropTypes.string
};

const defaultProps = {
    type: "text",
    disabled: false,
    isFocused: false
};

export default class Input extends Component {
    constructor(props) {
        super(props);

        this.state = {
            type: this.props.type,
            displayShowHide: this.props.type === "password"
        };

        this.showHide = this.showHide.bind(this);
    }

    showHide(e) {
        e.preventDefault();
        e.stopPropagation();
        this.setState({
            type: this.state.type === 'text' ? 'password' : 'text'
        })
    }

    render() {
        return (
            <div className={"form__input" + (this.props.error ? " form__input--error" : "") + (this.props.inline ? " form__input--flush" : "")}>
                { !this.props.inline &&
                    <label className="form__label" htmlFor={this.props.id}>{this.props.label}</label>
                }
                {
                    this.props.error ?
                        <div className="error-msg">{this.props.error}</div>
                        :
                        ""
                }
                {this.props.type !== "textarea" ?
                    <input 
                        id={this.props.id}
                        type={this.state.type}
                        className={"input" + (this.state.displayShowHide ? " input--show-hide" : "")}
                        name={this.props.id}
                        disabled={this.props.disabled}
                        onChange={this.props.onChange}
                        onBlur={this.props.onBlur}
                        autoFocus={this.props.isFocused}
                        placeholder={this.props.inline ? this.props.label : ""}
                        accept={this.props.accept}
                        value={this.props.value}
                        min={this.props.min}
                        max={this.props.max}
                    />
                :
                    <textarea
                        id={this.props.id}
                        className="input input__textarea"
                        name={this.props.id}
                        disabled={this.props.disabled}
                        onChange={this.props.onChange}
                        onBlur={this.props.onBlur}
                        autoFocus={this.props.isFocused}
                        placeholder={this.props.inline ? this.props.label : ""}
                    >
                    </textarea>
                }
                {
                    this.state.displayShowHide ?
                        <span className="btn btn--password" onClick={this.showHide} onKeyPress={this.showHide} tabIndex="0" role="button">{this.state.type === 'text' ? 'Hide' : 'Show'}</span>
                        :
                        ""
                }
            </div>
        )
    }
}

Input.propTypes = propTypes;
Input.defaultProps = defaultProps;