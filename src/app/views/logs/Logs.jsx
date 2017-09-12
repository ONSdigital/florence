import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import PropTypes from 'prop-types';

import log from '../../utilities/log';

const propTypes = {
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired,
    }).isRequired,
    page: PropTypes.string
}

class Logs extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isFetchingLogs: false,
            logs: null,
            logCount: null
        }

        this.clearLogs = this.clearLogs.bind(this)
    }

    componentWillMount() {
        this.setState({isFetchingLogs: true});
        log.length().then(count => {
            console.log(count);
            this.setState({logCount: count});
            // TODO fix blank page when you go directly to a page number when there aren't enough page for that to have any data
            // we should be redirecting them to just '/logs' instead
            if (this.props.page && this.props.page !== "1") {
                log.getAll(((this.props.page-1)*10), ((this.props.page-1)*10)+10).then(logRange => {
                    this.setState({
                        isFetchingLogs: false,
                        logs: logRange
                    });
                });
                return;
            }

            if (count > 10) {
                log.getAll(0, 10).then(logRange => {
                    this.setState({
                        isFetchingLogs: false,
                        logs: logRange
                    });
                });
                return;
            }

            log.getAll().then(logs => {
                this.setState({
                    isFetchingLogs: false,
                    logs
                });
            });
        });
    }

    componentWillReceiveProps(nextProps) {

        if (this.props.page !== nextProps.page && nextProps.page === "1") {
            this.setState({isFetchingLogs: true});
            log.getAll(0, 10).then(logRange => {
                this.setState({
                    isFetchingLogs: false,
                    logs: logRange
                });
            });
            return;
        }

        if (this.props.page !== nextProps.page) {
            this.setState({isFetchingLogs: true});
            log.getAll(((nextProps.page-1)*10), ((nextProps.page-1)*10)+10).then(logRange => {
                this.setState({
                    isFetchingLogs: false,
                    logs: logRange
                });
            });
        }
    }

    clearLogs() {
        this.setState({isFetchingLogs: true});
        log.removeAll().then(() => {
            this.setState({
                isFetchingLogs: false,
                logs: [],
                logCount: 0
            });
        });
    }

    renderPagination() {
        const pageCount = Math.ceil(this.state.logCount/10);
        const pagination = [...Array(pageCount)];
        const pageNumbers = pagination.map((_, index) => {
            return (
                <li className="pagination__item" key={index}>
                    {this.renderPageLink(index+1)}
                </li>
            )
        });

        return (
            <ul className="pagination">
                {pageNumbers}
            </ul>
        )
    }

    renderPageLink(pageNumber) {
        if ((pageNumber === 1 && !this.props.page) || pageNumber === parseInt(this.props.page)) {
            return (
                <span className="pagination__link pagination__link--active">
                    {pageNumber}
                </span>
            )
        }

        return (
            <Link 
                className="pagination__link" 
                to={`${this.props.location.pathname}?page=${pageNumber}`}
            >
                {pageNumber}
            </Link>
        )
    }

    render() {
        return (
            <div className="grid grid--justify-center">
                <div className="grid__col-4">
                    {!this.state.isFetchingLogs ?
                        <div>
                            <button onClick={this.clearLogs}>Clear logs</button>
                            {this.state.logs.map((log, index) => {
                                return (
                                    <div key={index}>
                                        {log.index}:
                                        <br/>
                                        {new Date(log.clientTimestamp).toLocaleString('en-GB')}
                                        <br/>
                                        {log.type}
                                        <br/>
                                        <br/>
                                    </div>
                                );
                            })}
                            {this.state.logCount > 10 &&
                                this.renderPagination()
                            }
                            {this.state.logCount === 0 &&
                                <p>No logs to display</p>
                            }
                        </div>
                    :
                        <div className="loader loader--dark"></div>
                    }
                </div>
            </div>
        )
    }
}

Logs.propTypes = propTypes;

function mapStateToProps(state) {
    return {
        page: state.routing.locationBeforeTransitions.query.page
    }
}

export default connect(mapStateToProps)(Logs);