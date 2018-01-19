import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import dateFormat from 'dateformat';

import url from '../../../utilities/url';

const propTypes = {
    values: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.string.isRequired,
        date: PropTypes.string,
        id: PropTypes.string.isRequired,
        instances: PropTypes.arrayOf(PropTypes.shape({
            date: PropTypes.string,
            edition: PropTypes.string.isRequired,
            version: PropTypes.oneOfType([
                PropTypes.string.isRequired,
                PropTypes.number.isRequired
            ])
        }))
    }))
}

export default class SelectableTableController extends Component {
    constructor(props) {
        super(props);
    }

    renderDatasetInstances(instances) {
        return instances.map((instance, i) => {
            if (instance !== undefined) {
                return (
                    <div key={i} className="grid simple-table__row">
                        <div className="grid__col-4">
                            {dateFormat(instance.date, "HH:MM:ss dd/mm/yy")}
                        </div>
                        <div className="grid__col-2">
                            {instance.edition}
                        </div>
                        <div className="grid__col-4">
                            {instance.version}
                        </div>
                        <div className="grid__col-2">
                            {/* Wrap in span to stop grid col from forcing link to be full width 
                            (which made focus outline much wider than the link itself) */}
                            <span><Link to={instance.url}>View</Link></span>
                        </div>
                    </div>
                )
            }
        })
    }

    render() {
        return (
            <div className="selectable-table">
                    <div className="selectable-table__heading">
                        Title
                    </div>
                    {this.props.values.map((item, index) => {
                        return (
                            <details key={index} className="selectable-table__details">
                                <summary className="selectable-table__summary">
                                    <div className="grid">
                                        <div className="grid__col-6">
                                            <strong>{item.title}</strong>
                                        </div>
                                        <div className="grid__col-6">
                                            {item.date}
                                        </div>
                                    </div>
                                </summary>
                                <div>
                                    <Link className="inline-block margin-bottom--1" to={url.resolve(`datasets/${item.id}/metadata`)}> Edit dataset details</Link>
                                    {item.instances.length > 0 &&
                                        <div>
                                            <p className="font-weight--400 grid__col-12">
                                                New versions:
                                            </p>
                                            <div className="grid simple-table__heading">
                                                <div className="grid__col-4">
                                                    Date
                                                </div>
                                                <div className="grid__col-2">
                                                    Edition
                                                </div>
                                                <div className="grid__col-2">
                                                    Version
                                                </div>
                                            </div>
                                            { this.renderDatasetInstances(item.instances) }
                                        </div>
                                    }
                                </div>
                            </details>
                        )
                    })}
            </div>
        )
    }
}

SelectableTableController.propTypes = propTypes;
