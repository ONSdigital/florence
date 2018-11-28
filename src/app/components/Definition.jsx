import React, {Component} from 'react';
import PropTypes from 'prop-types';

const defaultProps = {
    marginBottom: "margin-bottom--1"
};

const propTypes = {
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    marginBottom: PropTypes.string
};

class Definition extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
          <details className={this.props.marginBottom}>
             <summary><span className="summary">{this.props.title}</span></summary>
             <div className="panel">
                <p>{this.props.content}</p>
             </div>
          </details>
        )
    }
}

Definition.propTypes = propTypes;
Definition.defaultProps = defaultProps;
export default Definition;
