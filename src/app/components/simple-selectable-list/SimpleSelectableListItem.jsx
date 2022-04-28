import React from "react";
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

const SimpleSelectableListItem = ({ title, id, url, externalLink, details = [], extraDetails = [], colCount, disabled }) => {
    const renderTitle = () => {
        if (disabled) {
            return <p className="simple-select-list__title simple-select-list__title--disabled">{title}</p>;
        }

        if (externalLink) {
            return (
                <a href={url} role="link">
                    <p className="simple-select-list__title">{title}</p>
                </a>
            );
        }

        return (
            <Link to={url} role="link" className="simple-select-list__title">
                {title}
            </Link>
        );
    };
    return (
        <li className="simple-select-list__item">
            <div className={`simple-select-list__col simple-select-list__cols-${colCount}`}>
                {renderTitle()}
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

export default SimpleSelectableListItem;

SimpleSelectableListItem.propTypes = propTypes;
SimpleSelectableListItem.defaultProps = defaultProps;
