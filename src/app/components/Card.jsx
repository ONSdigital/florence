import React, {Component} from 'react';
import PropTypes from 'prop-types';

const propTypes = {
    title: PropTypes.string,
    type: PropTypes.string,
    id: PropTypes.string,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    disabled: PropTypes.bool
}

class Card extends Component {
    constructor(props) {
        super(props);
        this.handleEditClick = this.handleEditClick.bind(this);
        this.handleDeleteClick = this.handleDeleteClick.bind(this);
    }

    handleEditClick() {
        this.props.onEdit(this.props.type, this.props.id);
    }
    
    handleDeleteClick() {
        this.props.onDelete(this.props.type, this.props.id);
    }

    render() {
        return (
          <li className="card margin-bottom--1" key={this.props.id}>
              <div className="card__body">
                  <div className="card__title">{this.props.title}</div>
              </div>
              <div className="card__actions">
                  <button disabled={this.props.disabled} type="button" className="btn btn--link" onClick={this.handleEditClick}>Edit</button>
                  <button disabled={this.props.disabled} type="button" className="margin-left--1 btn btn--link" onClick={this.handleDeleteClick}>Delete</button>
              </div>
          </li>
        )
    }
}

Card.propTypes = propTypes;
export default Card;
