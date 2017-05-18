import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SelectableBoxItem from './SelectableBoxItem';

const propTypes = {
    heading: PropTypes.string.isRequired,
    items: PropTypes.array,
    activeItem: PropTypes.object,
    handleItemClick: PropTypes.func,
    isUpdating: PropTypes.bool
}

export default class SelectableBoxController extends Component {
    constructor(props) {
        super(props);

        this.bindItemClick = this.bindItemClick.bind(this);
    }

    componentDidMount() {
            debugger;
    }

    bindItemClick(itemProps) {
        this.props.handleItemClick(itemProps);
    }

    renderList() {
        return (
            <ul className="selectable-box__list">
                {
                    this.props.items.map((item, index) => {
                        return (
                            <SelectableBoxItem 
                                key={index} 
                                {...item}
                                isSelected={this.props.activeItem && item.id === this.props.activeItem.id}
                                handleClick={this.bindItemClick}
                            />
                        )
                    })
                }
            </ul>
        )
    }

    render() {
        return (
           <div className="selectable-box">
                <h2 className="selectable-box__heading">
                    Name
                    { this.props.isUpdating && <span className="selectable-box__status loader"/> }
                </h2>
                { this.renderList() }
            </div> 
        )
    }
}

SelectableBoxController.propTypes = propTypes;