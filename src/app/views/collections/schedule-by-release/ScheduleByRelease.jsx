import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SelectableBox from '../../../components/selectable-box-new/SelectableBox';
import releases from '../../../utilities/api-clients/releases';
import log, { eventTypes } from '../../../utilities/log';
import Input from '../../../components/Input';
import date from '../../../utilities/date'

const propTypes = {
    onClose: PropTypes.func.isRequired,
    onReleaseSelect: PropTypes.func.isRequired
};

const columns = [
    {
        width: "8",
        heading: "Name"
    },
    {
        width: "2",
        heading: "Publish date"
    },
    {
        width: "2",
        heading: "Status"
    }
]

export class ScheduleByRelease extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isFetchingReleases: false,
            isFetchingExtraReleases: false,
            tableData: [],
            currentPage: 0,
            numberOfPages: 0,
            numberOfReleases: 0,
            releasesPerPage: 10
        };

        this.loadMoreReleases = this.loadMoreReleases.bind(this);
    }

    componentWillMount() {
        this.setState({isFetchingReleases: true});
        releases.getUpcoming(null, null, this.state.releasesPerPage).then(upcomingReleases => {
            const tableData = this.mapReleasesToTableRows(upcomingReleases.result.results);
            this.setState({
                isFetchingReleases: false,
                numberOfReleases: upcomingReleases.result.numberOfResults,
                numberOfPages: upcomingReleases.result.paginator ? upcomingReleases.result.paginator.numberOfPages : 1,
                currentPage: 1,
                tableData
            });
        }).catch(error => {
            this.setState({isFetchingReleases: false});
            log.add(eventTypes.unexpectedRuntimeError, {message: "Error fetching upcoming releases for 'scheduled by release' functionality: " + JSON.stringify(error)});
            console.error("Error fetching upcoming releases for 'scheduled by release' functionality", error);
        });
    }

    mapReleasesToTableRows(releases) {
        const rows = releases.filter(release => {
            if (release.description.published) {
                return false;
            }
            if (release.description.cancelled) {
                return false;
            }
            return true;
        }).map(release => {
            let status = "";
            if (!release.description.finalised) {
                status = "Not finalised"
            }

            //TODO check whether the release is already associated to a collection

            return {
                id: release.uri,
                columnValues: [release.description.title, date.format(release.description.releaseDate, "ddd, dd/mm/yyyy h:MMTT"), status],
                returnValue: {
                    uri: release.uri,
                    releaseDate: release.description.releaseDate,
                    title: release.description.title
                }
            }
        });

        return rows;
    }

    handleSearch(event) {
        console.log(event.target.value);
    }

    loadMoreReleases() {
        this.setState({isFetchingExtraReleases: true});
        releases.getUpcoming(this.state.currentPage+1, null, this.state.releasesPerPage).then(upcomingReleases => {
            this.setState(state => ({
                isFetchingExtraReleases: false,
                currentPage: state.currentPage + 1,
                tableData: [...state.tableData , ...this.mapReleasesToTableRows(upcomingReleases.result.results)]
            }));
        }).catch(error => {
            this.setState({isFetchingExtraReleases: false});
            log.add(eventTypes.unexpectedRuntimeError, {message: "Error fetching extra upcoming releases for 'scheduled by release' functionality: " + JSON.stringify(error)});
            console.error("Error fetching extra upcoming releases for 'scheduled by release' functionality", error);
        });
    }

    render() {
        return (
            <div className="grid">
                <div className="modal__header grid">
                    <div className="grid__col-8">
                        <h1 className="modal__title margin-top--2">Select a calendar entry</h1>
                    </div>
                    <div className="grid__col-4">
                        <Input id="search-releases" disabled={true} onChange={this.handleSearch} label="Search by release name"/>
                    </div>
                </div>
                <div className="modal__body grid__col-12">
                    <SelectableBox
                        columns={columns}
                        isUpdating={this.state.isFetchingReleases}
                        handleItemClick={this.props.onReleaseSelect}
                        rows={this.state.tableData}
                    />
                    {!this.state.isFetchingReleases &&
                        <div className="grid grid--justify-space-between margin-top--1">
                            <div>
                                <button className="btn btn--primary" type="button" onClick={this.loadMoreReleases} disabled={this.state.isFetchingExtraReleases}>Show more releases</button>
                                {this.state.isFetchingExtraReleases && 
                                    <div className="margin-left--1 inline-block">
                                        <div className="loader loader--dark"></div>
                                    </div>
                                }
                            </div>
                            <div>
                                <p>Showing page {this.state.currentPage} of {this.state.numberOfPages}</p>
                                <p>Number of releases: {this.state.numberOfReleases}</p>
                            </div>
                        </div>
                    }
                </div>
                <div className="modal__footer grid__col-12">
                    <div>
                        <button className="btn" type="button" onClick={this.props.onClose}>Close</button>
                    </div>
                </div>
            </div>
        )
    }
}

ScheduleByRelease.propTypes = propTypes;

export default ScheduleByRelease;