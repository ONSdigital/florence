import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Card from './Card';

const propTypes = {
    contents: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.string,
        keyID: PropTypes.string,
    })),
    type: PropTypes.string.isRequired,
    listActions: PropTypes.func
}

class CardList extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
          <div>
            <ul className="list--neutral margin-bottom--1">
            {
                this.props.contents.map(item => {
                    return (
                        <Card
                          title={item.title}
                          keyID={item.key}
                          key={item.key}
                          type={this.props.type}
                          onEdit={this.props.listActions}
                        />
                    )
                })
            }
            </ul>
          </div>
        )
    }
}

CardList.propTypes = propTypes;
export default CardList;
