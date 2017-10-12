import React, {Component} from 'react';
import PropTypes from 'prop-types';

const propTypes = {
    title: PropTypes.string,
    keyID: PropTypes.string,
    type: PropTypes.string,
    onEdit: PropTypes.func
}

class Card extends Component {
    constructor(props) {
        super(props);
        this.handleAction = this.handleAction.bind(this);
    }

   handleAction(event) {
      event.preventDefault();
      const action = event.currentTarget.dataset.action;
      this.props.onEdit(this.props.type, this.props.keyID, action);
    }

    render() {
        return (
          <li className="card margin-bottom--1" key={this.props.keyID}>
              <div className="card__body">
                  <div className="card__title">{this.props.title}</div>
              </div>
              <div className="card__actions">
                  <a href="#" data-action="edit" onClick={this.handleAction}>Edit</a>
                  <a className="margin-left--1" data-action="remove" href="#" onClick={this.handleAction}>Delete</a>
              </div>
          </li>
        )
    }
}

Card.propTypes = propTypes;
export default Card;
