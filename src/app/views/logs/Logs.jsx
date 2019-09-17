import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import { Link } from "react-router";
import PropTypes from "prop-types";

import DefaultLog from "./log-components/DefaultLog";
import RouteLog from "./log-components/RouteLog";
import RequestLog from "./log-components/RequestLog";
import Notification from "./log-components/NotificationLog";
import RuntimeErrorLog from "./log-components/RuntimeErrorLog";
import log, { eventTypes } from "../../utilities/log";

const propTypes = {
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired,
        query: PropTypes.object.isRequired
    }).isRequired,
    page: PropTypes.string,
    dispatch: PropTypes.func.isRequired
};

class Logs extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isFetchingLogs: false,
            logs: null,
            logCount: null,
            pageSize: 10,
            logsTimestamp: parseInt(this.props.location.query.timestamp) || new Date().getTime()
        };
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
            };
            this.props.dispatch(push(location));
        }

        this.setState({ isFetchingLogs: true });
        log.length().then(count => {
            this.setState({ logCount: count });
            // TODO fix blank page when you go directly to a page number when there aren't enough pages for that to have any data
            // we should be redirecting them to just '/logs' instead
            if (this.props.page && this.props.page !== "1") {
                log.getAll((this.props.page - 1) * 10, this.state.pageSize, this.state.logsTimestamp).then(logRange => {
                    this.setState({
                        isFetchingLogs: false,
                        logs: logRange
                    });
                });
                return;
            }

            if (count > 10) {
                log.getAll(0, 10, this.state.logsTimestamp).then(logRange => {
                    this.setState({
                        isFetchingLogs: false,
                        logs: logRange
                    });
                });
                return;
            }

            log.getAll(null, null, this.state.logsTimestamp).then(logs => {
                this.setState({
                    isFetchingLogs: false,
                    logs
                });
            });
        });
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.page !== nextProps.page && nextProps.page === "1") {
            this.setState({ isFetchingLogs: true });
            log.getAll(0, 10, this.state.logsTimestamp).then(logRange => {
                this.setState({
                    isFetchingLogs: false,
                    logs: logRange
                });
            });
            return;
        }

        if (this.props.page !== nextProps.page) {
            this.setState({ isFetchingLogs: true });
            log.getAll((nextProps.page - 1) * 10, this.state.pageSize, this.state.logsTimestamp).then(logRange => {
                this.setState({
                    isFetchingLogs: false,
                    logs: logRange
                });
            });
        }
    }

    // Not currently needed (was used for development), but we might want to include a 'clear logs' CTA somewhere
    /*
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
    */

    mapLogToComponent(log, index) {
        const failureEventTypes = [
            eventTypes.pingFailed,
            eventTypes.requestFailed,
            eventTypes.socketError,
            eventTypes.passwordChangeError,
            eventTypes.unexpectedRuntimeError,
            eventTypes.socketBufferFull
        ];
        const mapUniqueLogTypesToComponents = {};
        mapUniqueLogTypesToComponents[eventTypes.changedRoute] = RouteLog;
        mapUniqueLogTypesToComponents[eventTypes.shownNotification] = Notification;
        mapUniqueLogTypesToComponents[eventTypes.shownWarning] = Notification;
        mapUniqueLogTypesToComponents[eventTypes.pingFailed] = RequestLog;
        mapUniqueLogTypesToComponents[eventTypes.requestSent] = RequestLog;
        mapUniqueLogTypesToComponents[eventTypes.requestReceived] = RequestLog;
        mapUniqueLogTypesToComponents[eventTypes.requestFailed] = RequestLog;
        mapUniqueLogTypesToComponents[eventTypes.unexpectedRuntimeError] = RuntimeErrorLog;

        if (mapUniqueLogTypesToComponents[log.type]) {
            const UniqueLogComponent = mapUniqueLogTypesToComponents[log.type];
            return <UniqueLogComponent key={index} {...log} isFailure={failureEventTypes.includes(log.type)} />;
        }

        return <DefaultLog key={index} {...log} isFailure={failureEventTypes.includes(log.type)} />;
    }

    renderPagination() {
        const pageCount = Math.ceil(this.state.logCount / 10);
        const pagination = [...Array(pageCount)];
        const pageNumbers = pagination.map((_, index) => {
            return (
                <li className="pagination__item" key={index}>
                    {this.renderPageLink(index + 1)}
                </li>
            );
        });

        return <ul className="pagination">{pageNumbers}</ul>;
    }

    renderPageLink(pageNumber) {
        if ((pageNumber === 1 && !this.props.page) || pageNumber === parseInt(this.props.page)) {
            return <span className="pagination__link pagination__link--active">{pageNumber}</span>;
        }

        return (
            <Link className="pagination__link" to={`${this.props.location.pathname}?page=${pageNumber}&timestamp=${this.state.logsTimestamp}`}>
                {pageNumber}
            </Link>
        );
    }

    render() {
        return (
            <div className="grid grid--justify-center">
                <div className="grid__col-4">
                    {!this.state.isFetchingLogs ? (
                        <div className="logs">
                            {this.state.logs.map((log, index) => {
                                return this.mapLogToComponent(log, index);
                            })}
                            {this.state.logCount > 10 && this.renderPagination()}
                            {this.state.logCount === 0 && <p>No logs to display</p>}
                        </div>
                    ) : (
                        <div className="margin-top--2">
                            <div className="loader loader--dark"></div>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

Logs.propTypes = propTypes;

function mapStateToProps(state) {
    return {
        page: state.routing.locationBeforeTransitions.query.page
    };
}

export default connect(mapStateToProps)(Logs);
