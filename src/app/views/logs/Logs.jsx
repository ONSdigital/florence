import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { push } from 'react-router-redux';
import {connect } from 'react-redux';
import { Link } from 'react-router';

import log, {eventTypes} from '../../utilities/log';
import DefaultLog from './log-components/DefaultLog';
import RequestLog from './log-components/RequestLog';
import RouteLog from './log-components/RouteLog';
import RuntimeErrorLog from './log-components/RuntimeErrorLog'
import NotificationLog from './log-components/NotificationLog'

const propTypes = {
    user: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired,
        query: PropTypes.object.isRequired
    }).isRequired,
    page: PropTypes.string
};

export class Logs extends Component {
    constructor(props) {
        super(props);

        this.state = {
            logs: [],
            isFetchingLogs: false,
            pageSize: 10,
            paginationCount: 1,
            logsTimestamp: parseInt(props.location.query.timestamp) || new Date().getTime()
        };

        this.handleDeleteAll = this.handleDeleteAll.bind(this);
    }

    componentWillMount() {
        // Add a timestamp to the URL so we know what time/date we're getting logs from
        // which prevents logs being added as when go through pages
        if (!this.props.location.query.timestamp) {
            const location = {
                ...this.props.location,
                query: {
                    ...this.props.location.query,
                    timestamp: this.state.logsTimestamp
                }
            }
            this.props.dispatch(push(location));
        }

        this.setState({isFetchingLogs: true});

        const pageNumber = this.props.page || 1;
        log.getAll(pageNumber, this.state.pageSize, this.state.logsTimestamp).then(response => {
            this.setState({
                logs: response.results,
                isFetchingLogs: false,
                paginationCount: response.pagination.pageCount
            })
        }).catch(error => {
            this.setState({isFetchingLogs: false});
            console.error("Error getting logs from storage", error);
        });
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.page !== nextProps.page) {
            this.setState({isFetchingLogs: true});
            log.getAll(nextProps.page, this.state.pageSize, this.state.logsTimestamp).then(response => {
                this.setState({
                    isFetchingLogs: false,
                    logs: response.results
                });
            }).catch(error => {
                this.setState({isFetchingLogs: false});
                console.error("Error getting logs from storage", error);
            });
        }
    }

    handleDeleteAll() {
        this.setState({isFetchingLogs: true});
        log.removeAll().then(() => {
            this.setState({isFetchingLogs: false, logs: [], paginationCount: 0});
        }).catch(error => {
            this.setState({isFetchingLogs: false});
            console.error("Error removing all logs from storage", error);
        });
    }

    mapLogToComponent(log, id) {
        const failureEventTypes = [
            eventTypes.pingFailed,
            eventTypes.requestFailed,
            eventTypes.socketError,
            eventTypes.passwordChangeError,
            eventTypes.unexpectedRuntimeError,
            eventTypes.socketBufferFull
        ]
        const mapUniqueLogTypesToComponents = {};
        mapUniqueLogTypesToComponents[eventTypes.changedRoute] = RouteLog;
        mapUniqueLogTypesToComponents[eventTypes.shownNotification] = NotificationLog;
        mapUniqueLogTypesToComponents[eventTypes.shownWarning] = NotificationLog;
        mapUniqueLogTypesToComponents[eventTypes.pingFailed] = RequestLog
        mapUniqueLogTypesToComponents[eventTypes.requestSent] = RequestLog
        mapUniqueLogTypesToComponents[eventTypes.requestReceived] = RequestLog
        mapUniqueLogTypesToComponents[eventTypes.requestFailed] = RequestLog
        mapUniqueLogTypesToComponents[eventTypes.unexpectedRuntimeError] = RuntimeErrorLog
        
        if (mapUniqueLogTypesToComponents[log.type]) {
            const UniqueLogComponent = mapUniqueLogTypesToComponents[log.type];
            return (
                <UniqueLogComponent key={id} {...log} isFailure={failureEventTypes.includes(log.type)} />
            )
        }
        
        return <DefaultLog key={id} {...log} isFailure={failureEventTypes.includes(log.type)} />
    }

    renderPagination() {
        if (this.state.paginationCount === 1) {
            return;
        }

        const pagination = [...Array(this.state.paginationCount)];
        const pageNumbers = pagination.map((_, index) => {
            return (
                <li className="pagination__item" key={index}>
                    {this.renderPageLink(index+1)}
                </li>
            )
        });

        return (
            <nav className="margin-top--2">
                <p>Page {this.props.page || 1} of {this.state.paginationCount}</p>
                <ul className="pagination">
                    {this.props.page && this.props.page !== "1" &&
                        <li className="pagination__item">
                            <Link to={`${this.props.location.pathname}?page=${parseInt(this.props.page) - 1}&timestamp=${this.state.logsTimestamp}`} className="pagination__link">Previous</Link>
                        </li>
                    }
                    {pageNumbers}
                    {this.props.page !== this.state.paginationCount &&
                        <li className="pagination__item">
                            <Link to={`${this.props.location.pathname}?page=${parseInt(this.props.page) + 1}&timestamp=${this.state.logsTimestamp}`} className="pagination__link">Next</Link>
                        </li>
                    }
                </ul>
            </nav>
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
                to={`${this.props.location.pathname}?page=${pageNumber}&timestamp=${this.state.logsTimestamp}`}
            >
                {pageNumber}
            </Link>
        )
    }

    render () {
        return (
            <div className="grid grid--justify-center margin-bottom--3">
                <div className="grid__col-8">
                    <div className="grid grid--justify-space-between grid--align-center">
                        <h1>Logs</h1>
                        <div>
                            <button className="btn btn--warning" onClick={this.handleDeleteAll} type="button">Delete all</button>
                        </div>
                    </div>
                    {this.state.isFetchingLogs ?
                        <div className="grid grid--justify-center margin-top--5">
                            <div className="loader loader--dark loader--large"></div>
                        </div>
                    :
                        <div className="logs">
                            {this.state.logs.length > 0 ? 
                                this.state.logs.map(log => {
                                    return this.mapLogToComponent(log, log.storageID)
                                })
                            :
                                <p>No logs to display</p>
                            }
                            {this.renderPagination()}
                        </div>

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