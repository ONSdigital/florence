import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";

const propTypes = {
    title: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    externalLink: PropTypes.bool.isRequired,
    details: PropTypes.arrayOf(PropTypes.string),
    extraDetails: PropTypes.arrayOf(
        PropTypes.arrayOf(PropTypes.shape({ content: PropTypes.oneOfType[(PropTypes.string, PropTypes.object)], classes: PropTypes.string }))
    ),
    colCount: PropTypes.number.isRequired,
    disabled: PropTypes.bool,
};

const defaultProps = {
    externalLink: false,
};

export default class SimpleSelectableListItem extends Component {
    constructor(props) {
        super(props);
    }

    renderTitle = () => {
        if (this.props.disabled) {
            return <p className="simple-select-list__title simple-select-list__title--disabled">{this.props.title}</p>;
        }

        if (this.props.externalLink) {
            return (
                <a href={this.props.url}>
                    <p className="simple-select-list__title">{this.props.title}</p>
                </a>
            );
        }

        return (
            <Link to={this.props.url}>
                <p className="simple-select-list__title">{this.props.title}</p>
            </Link>
        );
    };

    render() {
        const details = this.props.details || [];
        const extraDetails = this.props.extraDetails || [];
        const colCount = this.props.colCount;
        return (
            <li className="simple-select-list__item">
                <div className={`simple-select-list__col simple-select-list__cols-${colCount}`}>
                    {this.renderTitle()}
                    {details.map((detail, i) => {
                        return <p key={`detail-${i}`}>{detail}</p>;
                    })}
                </div>
                {extraDetails.map((column, i) => {
                    return (
                        <div key={`detail-${i}`} className={`simple-select-list__col simple-select-list__cols-${colCount}`}>
                            {column.map((detail, j) => {
                                return (
                                    <span key={`detail-${j}`} className={detail.classes}>
                                        {detail.content}
                                    </span>
                                );
                            })}
                        </div>
                    );
                })}
            </li>
        );
    }
}

SimpleSelectableListItem.propTypes = propTypes;
SimpleSelectableListItem.defaultProps = defaultProps;
