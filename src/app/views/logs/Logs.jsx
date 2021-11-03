import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import DefaultLog from "./log-components/DefaultLog";
import RouteLog from "./log-components/RouteLog";
import RequestLog from "./log-components/RequestLog";
import Notification from "./log-components/NotificationLog";
import RuntimeErrorLog from "./log-components/RuntimeErrorLog";
import log, { eventTypes } from "../../utilities/log";

const Logs = props => {
    const [isFetchingLogs, setIsFetchingLogs] = useState(false);
    const [logs, setLogs] = useState([]);
    const [logCount, setLogCount] = useState(null);

    const pageSize = 10;
    const logsTimestamp = useState(parseInt(props.location.query.timestamp) || new Date().getTime());

    useEffect(() => {
        // Add a timestamp to the URL so we know what time/date we're getting logs from
        // which prevents logs being added as when go through pages
        if (!props.location.query.timestamp) {
            const location = {
                ...props.location,
                query: {
                    ...props.location.query,
                    timestamp: logsTimestamp,
                },
            };
            props.dispatch(push(location));
        }

        setIsFetchingLogs(true);
        log.length().then(count => {
            setLogCount(count);
            // TODO fix blank page when you go directly to a page number when there aren't enough pages for that to have any data
            // we should be redirecting them to just '/logs' instead
            if (props.page && props.page !== "1") {
                log.getAll((props.page - 1) * 10, pageSize, logsTimestamp).then(logRange => {
                    setIsFetchingLogs(false);
                    setLogs(logRange);
                });
                return;
            }

            if (count > 10) {
                log.getAll(0, 10, logsTimestamp).then(logRange => {
                    setIsFetchingLogs(false);
                    setLogs(logRange);
                });
                return;
            }

            log.getAll(null, null, logsTimestamp).then(logs => {
                setIsFetchingLogs(false);
                setLogs(null);
            });
        });
    }, []);

    useEffect(() => {
        if (props.page === "1") {
            setIsFetchingLogs(true);
            log.getAll(0, 10, logsTimestamp).then(logRange => {
                setIsFetchingLogs(false);
                setLogs(logRange);
            });
            return;
        } else {
            setIsFetchingLogs(true);
            log.getAll((props.page - 1) * 10, pageSize, logsTimestamp).then(logRange => {
                setIsFetchingLogs(false);
                setLogs(logRange);
            });
        }
    }, [props.page]);

    const mapLogToComponent = (log, index) => {
        const failureEventTypes = [
            eventTypes.pingFailed,
            eventTypes.requestFailed,
            eventTypes.socketError,
            eventTypes.passwordChangeError,
            eventTypes.unexpectedRuntimeError,
            eventTypes.socketBufferFull,
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
    };

    const renderPagination = () => {
        const pageCount = Math.ceil(logCount / 10);
        const pagination = [...Array(pageCount)];
        const pageNumbers = pagination.map((_, index) => {
            return (
                <li className="pagination__item" key={index}>
                    {renderPageLink(index + 1)}
                </li>
            );
        });

        return <ul className="pagination">{pageNumbers}</ul>;
    };

    const renderPageLink = pageNumber => {
        if ((pageNumber === 1 && props.page) || pageNumber === parseInt(props.page)) {
            return <span className="pagination__link pagination__link--active">{pageNumber}</span>;
        }

        return (
            <Link className="pagination__link" to={`${props.location.pathname}?page=${pageNumber}&timestamp=${logsTimestamp}`}>
                {pageNumber}
            </Link>
        );
    };

    return (
        <div className="grid grid--justify-center">
            <div className="grid__col-4">
                {!isFetchingLogs ? (
                    <div className="logs">
                        {logs.map((log, index) => {
                            return mapLogToComponent(log, index);
                        })}
                        {logCount > 10 && renderPagination()}
                        {logCount === 0 && <p>No logs to display</p>}
                    </div>
                ) : (
                    <div className="margin-top--2">
                        <div className="loader loader--dark"></div>
                    </div>
                )}
            </div>
        </div>
    );
};

Logs.propTypes = {
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired,
        query: PropTypes.object.isRequired,
    }).isRequired,
    page: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
    return {
        page: state.routing.locationBeforeTransitions.query.page,
    };
};

export default connect(mapStateToProps)(Logs);
