import React, {Component} from 'react';
import PropTypes from 'prop-types';

const propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    type: PropTypes.string,
    onChange: PropTypes.func,
    error: PropTypes.string
};

const defaultProps = {
    type: "text"
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
            <div className={"form__input" + (this.props.error ? " form__input--error" : "")}>
                <label className="form__label" htmlFor={this.props.id}>{this.props.label}: </label>
                {
                    this.props.error ?
                        <div className="error-msg">{this.props.error}</div>
                        :
                        ""
                }
                <input id={this.props.id} type={this.state.type} className="input input__text" name={this.props.id} onChange={this.props.onChange} />
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