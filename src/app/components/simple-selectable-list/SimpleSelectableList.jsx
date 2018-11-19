import React, { Component } from 'react';
import PropTypes from 'prop-types';


import SimpleSelectableListItem from './SimpleSelectableListItem';

const propTypes = {
    rows: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
        details: PropTypes.arrayOf(PropTypes.string)
    })).isRequired,
    
}

export default class SimpleSelectableList extends Component {
    constructor(props) {
        super(props);

        //this.bindItemClick = this.bindItemClick.bind(this);
    }

    render() {
        return (
            <ul className="list list--neutral simple-select-list">
            {this.props.rows.length ?
                
                    this.props.rows.map(row => {
                        return (
                            <SimpleSelectableListItem key={row.id} {...row} />
                        )
                    })
                
                : <p>Nothing to show</p>
            }
            </ul>
        )
    }
}

SimpleSelectableList.propTypes = propTypes;