import React, { Component } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
    values: PropTypes.arrayOf(PropTypes.object)
}

export default class SelectableTableController extends Component {
    constructor(props) {
        super(props);

        this.state = {
            table: []
        }

        this.handleDetailsClick = this.handleDetailsClick.bind(this);
    }

    handleDetailsClick(event, key) {
        if (event.target.tagName.toLowerCase() === "a") {
            return;
        }

        event.preventDefault();
        var isSelected = true;
        var array = this.state.table;

        this.state.table.map((item, index) => {
            if (item === key) {
                array.splice(index, 1);
                this.setState({table: array});
                isSelected = false;
                return;
            }
        })

        if (isSelected) {
            array.push(key)
            this.setState({table: array});
        }
    }

    render() {
        return (
            <div className="selectable-table">
                    <div className="selectable-table__heading">
                        <ul className="selectable-table__list">
                            <li className="selectable-table__list-item grid__col-6">Title</li>
                            <li className="selectable-table__list-item grid__col-6">Submission Date</li>
                        </ul>
                    </div>
                    {this.props.values.map((item, index) => {
                        return (
                                <div key={index}>
                                    <details onClick={(event) => {this.handleDetailsClick(event, index)}} className={this.state.table.includes(index) ? "selectable-table__selected" : ""} open={this.state.table.includes(index) ? true : false}>
                                        <summary>
                                            <ul className="selectable-table__list">
                                                <li className="selectable-table__list-item grid__col-6">
                                                    <strong>{item.title}</strong>
                                                </li>
                                                <li className="selectable-table__list-item grid__col-4">
                                                    {item.date}
                                                </li>
                                                <li className="selectable-table__list-item grid__col-2">
                                                    <div className={this.state.table.includes(index) ? "selectable-table__accordion-open" : "selectable-table__accordion-closed"}></div>
                                                </li>
                                            </ul>
                                        </summary>
                                        <div className="selectable-table__list">
                                            <a href={item.datasetURL}> Edit dataset details </a>
                                            <ul>
                                                <li className="selectable-table__list-item grid__col-4">
                                                    Date
                                                </li>
                                                <li className="selectable-table__list-item grid__col-2">
                                                    Edition
                                                </li>
                                                <li className="selectable-table__list-item grid__col-2">
                                                    Version
                                                </li>
                                                <hr />
                                            </ul>
                                            {item.instances.map((instance, i) => {
                                                return (
                                                    <div key={i}>
                                                        <ul>
                                                            <li className="selectable-table__list-item grid__col-4">
                                                                {instance.date}
                                                            </li>
                                                            <li className="selectable-table__list-item grid__col-2">
                                                                {instance.edition}
                                                            </li>
                                                            <li className="selectable-table__list-item grid__col-4">
                                                                {instance.version}
                                                            </li>
                                                            <li className="selectable-table__list-item grid__col-2">
                                                                <a href={instance.url}>View</a>
                                                            </li>
                                                            <hr />
                                                        </ul>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </details>
                                    {index != this.props.values.length - 1 ?
                                        <hr className="selectable-table__table-divider" />
                                    :
                                        ""
                                    }
                                </div>
                        )
                    })}
            </div>
        )
    }
}

SelectableTableController.propTypes = propTypes;