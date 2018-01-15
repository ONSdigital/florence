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
import uuid from 'uuid/v4';

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
                paginationCount: response.pagination.pageCount || 1
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
            this.setState({isFetchingLogs: false, logs: [], paginationCount: 1});
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

    renderCurrentPageNumber() {
        return <p>Page {this.props.page || 1} of {this.state.paginationCount}</p>;
    }

    // renderPaginationNumbers(currentPageNumber) {
    //     const pagination = this.state.paginationCount < 10 ? [...Array(this.state.paginationCount)] : [...Array(10)];

    //     // Just render 10 normal links
    //     if (this.state.paginationCount <= 10) {
    //         return pagination.map((_, index) => {
    //             return (
    //                 <li className={"pagination__item" + (index+1 === currentPageNumber ? " pagination__item--active" : "")} key={index}>
    //                     {this.renderPageLink(index+1)}
    //                 </li>
    //             )
    //         });
    //     }

    //     console.log(this.state.paginationCount);
    //     console.log(currentPageNumber + 4);

    //     // Show dots on both sides
    //     if (this.state.paginationCount > 10 && currentPageNumber+4 <= this.state.paginationCount) {
    //         pagination.splice(0,2);
    //         const numbers = pagination.map((_, index) => {
    //             const modifiedNumber = (index+currentPageNumber-4);
    //             return (
    //                 <li className={"pagination__item" + (modifiedNumber === currentPageNumber ? " pagination__item--active" : "")} key={modifiedNumber}>
    //                     {this.renderPageLink(modifiedNumber)}
    //                 </li>
    //             )
    //         });
    //         console.log(currentPageNumber-4);

    //         return (
    //             <span>
    //                 <li className="pagination__item">
    //                     {this.renderPageLink(1)}
    //                 </li>
    //                 {currentPageNumber-4 > 2 && 
    //                     <li className="pagination__item">&#8230;</li>
    //                 }
    //                 {numbers}
    //                 <li className="pagination__item">&#8230;</li>
    //                 <li className="pagination__item" key="last">
    //                     {this.renderPageLink(this.state.paginationCount)}
    //                 </li>
    //             </span>
    //         )
    //     }

    //     // Don't show dots at end
    //     if (this.state.paginationCount > 10 && currentPageNumber+4 >= this.state.paginationCount) {
    //         const numbers = pagination.map((_, index) => {
    //             const modifiedNumber = (index+currentPageNumber-4);
    //             if (modifiedNumber > this.state.paginationCount) {
    //                 return;
    //             }
    //             return (
    //                 <li className={"pagination__item" + (modifiedNumber === currentPageNumber ? " pagination__item--active" : "")} key={modifiedNumber}>
    //                     {this.renderPageLink(modifiedNumber)}
    //                 </li>
    //             )
    //         });
    //         return (
    //             <span>
    //                 <li className="pagination__item">
    //                     {this.renderPageLink(1)}
    //                 </li>
    //                 <li className="pagination__item">&#8230;</li>
    //                 {numbers}
    //             </span>
    //         )
    //     }
    // }

    renderPaginationItem (pageNumber, currentPageNumber) {
        return (
            <li className={"pagination__item" + (pageNumber === currentPageNumber ? " pagination__item--active" : "")} key={uuid()}>
                {this.renderPageLink(pageNumber)}
            </li>
        )
    }

    renderPaginationNumbers(currentPageNumber) {
        const tempArray = this.state.paginationCount < 10 ? [...Array(this.state.paginationCount)] : [...Array(10)];

        if (this.state.paginationCount < 10) {
            return tempArray.map((_, index) => {
                return this.renderPaginationItem(index+1, currentPageNumber);
            })
        }

        const pagination = tempArray;
        pagination[0] = this.renderPaginationItem(1, currentPageNumber);
        pagination[pagination.length-1] = this.renderPaginationItem(this.state.paginationCount, currentPageNumber);

        if (currentPageNumber >= 7) {
            pagination[1] = <li className="pagination__item" key="before-ellipsis">&#8230;</li>;
        }

        const lastPageInRange = (currentPageNumber + 4) - this.state.paginationCount;
        const offset = lastPageInRange >= 0 ? lastPageInRange : 0;
        
        if (lastPageInRange < 0) {
            pagination[pagination.length-2] = <li className="pagination__item" key="after-ellipsis">&#8230;</li>;
        }

        pagination.forEach((page, index) => {
            if (page !== undefined) {
                return;
            }

            const pageNumber = currentPageNumber <= 5 ? index+1 : (currentPageNumber-5-offset)+index;
            pagination[index] = this.renderPaginationItem(pageNumber, currentPageNumber);
        });

        return pagination;
    }

    oldRenderPaginationNumbers(currentPageNumber) {
        const pagination = this.state.paginationCount < 10 ? [...Array(this.state.paginationCount)] : [...Array(10)];
        const numbers = pagination.map((_, index) => {
            return (
                <li className={"pagination__item" + (index+1 === currentPageNumber ? " pagination__item--active" : "")} key={index}>
                    {this.renderPageLink(index+1)}
                </li>
            )
        });

        return numbers;
    }

    renderPagination() {
        if (this.state.paginationCount === 1) {
            return;
        }
        const currentPageNumber = this.props.page ? parseInt(this.props.page) : 1;

        return (
            <nav className="margin-top--2">
                {this.renderCurrentPageNumber()}
                <ul className="pagination">
                    {this.props.page && this.props.page !== "1" &&
                        <li className="pagination__item">
                            <Link to={`${this.props.location.pathname}?page=${currentPageNumber - 1}&timestamp=${this.state.logsTimestamp}`} className="pagination__link pagination__link--flush-left">Previous</Link>
                        </li>
                    }
                    {this.renderPaginationNumbers(currentPageNumber)}
                    {this.state.logs.length > 0 && parseInt(this.props.page) !== this.state.paginationCount &&
                        <li className="pagination__item">
                            <Link to={`${this.props.location.pathname}?page=${currentPageNumber + 1}&timestamp=${this.state.logsTimestamp}`} className="pagination__link pagination__link--flush-right">Next</Link>
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