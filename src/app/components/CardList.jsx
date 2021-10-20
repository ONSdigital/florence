import React, { Component } from "react";
import PropTypes from "prop-types";
import Card from "./Card";

const propTypes = {
    contents: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string,
            id: PropTypes.string,
        })
    ),
    type: PropTypes.string.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
};

class CardList extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                <ul className="list--neutral margin-bottom--0">
                    {this.props.contents.map(item => {
                        return (
                            <Card
                                title={item.title}
                                key={item.id}
                                id={item.id}
                                type={this.props.type}
                                onEdit={this.props.onEdit}
                                onDelete={this.props.onDelete}
                                disabled={this.props.disabled}
                            />
                        );
                    })}
                </ul>
            </div>
        );
    }
}

CardList.propTypes = propTypes;
export default CardList;
