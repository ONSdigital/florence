import React, { Component } from "react";
import PropTypes from "prop-types";

import SelectableBox from "../../../components/selectable-box-new/SelectableBox";
import collections from "../../../utilities/api-clients/collections";
import releases from "../../../utilities/api-clients/releases";
import log from "../../../utilities/logging/log";
import Input from "../../../components/Input";
import date from "../../../utilities/date";
import notifications from "../../../utilities/notifications";

const propTypes = {
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
};

const columns = [
    {
        width: "9",
        heading: "Name",
    },
    {
        width: "3",
        heading: "Publish date",
    },
];

export class ScheduleByRelease extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isFetchingReleases: false,
            isFetchingExtraReleases: false,
            isFetchingSearchedReleases: false,
            tableData: [],
            currentPage: 0,
            numberOfPages: 0,
            numberOfReleases: 0,
            releasesPerPage: 10,
            searchSubmitDelay: 300,
            searchQuery: "",
            selectedRelease: "",
        };

        this.searchTimeout = null;
    }

    UNSAFE_componentWillMount() {
        this.setState({ isFetchingReleases: true });
        releases
            .getUpcoming(null, null, this.state.releasesPerPage)
            .then(upcomingReleases => {
                const tableData = this.mapReleasesToTableRows(upcomingReleases.releases);
                this.setState({
                    isFetchingReleases: false,
                    numberOfReleases: upcomingReleases.breakdown.total,
                    numberOfPages: Math.ceil(upcomingReleases.breakdown.total / this.state.releasesPerPage),
                    currentPage: 1,
                    tableData,
                });
            })
            .catch(error => {
                if (error.status === "FETCH_ERR") {
                    const notification = {
                        type: "warning",
                        message: "There was a network error whilst getting upcoming releases, please check your connection and try again",
                        isDismissable: true,
                    };
                    notifications.add(notification);
                } else {
                    const notification = {
                        type: "warning",
                        message: "An unexpected error occured whilst trying to get upcoming releases",
                        isDismissable: true,
                    };
                    notifications.add(notification);
                }

                this.setState({ isFetchingReleases: false });
                log.event("Error fetching upcoming releases for 'scheduled by release' functionality", log.error(error));
                console.error("Error fetching upcoming releases for 'scheduled by release' functionality", error);
            });
    }

    mapReleasesToTableRows(releases) {
        if (!releases) {
            return [];
        }
        const rows = releases
            .filter(release => {
                if (release.description.published) {
                    return false;
                }
                if (release.description.cancelled) {
                    return false;
                }
                return true;
            })
            .map(release => {
                //TODO check whether the release is already associated to a collection

                const title = release.description.title.replace(/<\/?[^>]+(>|$)/g, ""); // remove any <strong> tags added on by Babbage's response
                const releaseDate = release.description.release_date;
                const formattedDate = releaseDate ? date.format(releaseDate, "dddd, dd/mm/yyyy h:MMTT") : "";

                return {
                    id: release.uri,
                    columnValues: [title, formattedDate],
                    returnValue: {
                        uri: release.uri,
                        releaseDate: releaseDate,
                        title,
                        isProvisional: !release.description.finalised,
                    },
                };
            });

        return rows;
    }

    handleSearch = event => {
        const searchQuery = event.target.value;

        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            this.searchReleases(searchQuery);
        }, this.state.searchSubmitDelay);
    };

    searchReleases(query) {
        this.setState({
            isFetchingSearchedReleases: true,
            searchQuery: query,
        });

        releases
            .getUpcoming(null, query, this.state.releasesPerPage)
            .then(searchedReleases => {
                const tableData = this.mapReleasesToTableRows(searchedReleases.releases);
                this.setState({
                    isFetchingSearchedReleases: false,
                    numberOfReleases: searchedReleases.breakdown.total || 0,
                    numberOfPages: Math.ceil(searchedReleases.breakdown.total / this.state.releasesPerPage),
                    currentPage: 1,
                    searchQuery: query, // just incase a request takes ages this means the state is true about what query is actually being shown
                    tableData,
                });
            })
            .catch(error => {
                if (error.status === "FETCH_ERR") {
                    const notification = {
                        type: "warning",
                        message: "There was a network error whilst getting upcoming releases, please check your connection and try again",
                        isDismissable: true,
                    };
                    notifications.add(notification);
                } else {
                    const notification = {
                        type: "warning",
                        message: "An unexpected error occured whilst trying to get upcoming releases",
                        isDismissable: true,
                    };
                    notifications.add(notification);
                }

                this.setState({ isFetchingSearchedReleases: false });
                log.event("Error fetching queried releases for 'schedule by release' functionality", log.error(error));
                console.error("Error fetching queried releases for 'schedule by release' functionality", error);
            });
    }

    loadMoreReleases = () => {
        this.setState({ isFetchingExtraReleases: true });
        releases
            .getUpcoming(this.state.currentPage + 1, this.state.searchQuery, this.state.releasesPerPage)
            .then(upcomingReleases => {
                this.setState(state => ({
                    isFetchingExtraReleases: false,
                    currentPage: state.currentPage + 1,
                    tableData: [...state.tableData, ...this.mapReleasesToTableRows(upcomingReleases.releases)],
                }));
            })
            .catch(error => {
                if (error.status === "FETCH_ERR") {
                    const notification = {
                        type: "warning",
                        message: "There was a network error whilst getting more upcoming releases, please check your connection and try again",
                        isDismissable: true,
                    };
                    notifications.add(notification);
                } else {
                    const notification = {
                        type: "warning",
                        message: "An unexpected error occured whilst trying to get more upcoming releases",
                        isDismissable: true,
                    };
                    notifications.add(notification);
                }

                this.setState({ isFetchingExtraReleases: false });
                log.event("Error fetching extra upcoming releases for 'scheduled by release' functionality", log.error(error));
                console.error("Error fetching extra upcoming releases for 'scheduled by release' functionality", error);
            });
    };

    renderQueryText() {
        if (this.state.isFetchingSearchedReleases) {
            return (
                <p className="margin-bottom--1">
                    Getting releases matching the term '<span className="font-weight--600">{this.state.searchQuery}</span>'
                </p>
            );
        }

        if (this.state.numberOfReleases === 0) {
            return (
                <p className="margin-bottom--1">
                    No releases matching the term '<span className="font-weight--600">{this.state.searchQuery}</span>'
                </p>
            );
        }

        return (
            <p className="margin-bottom--1">
                Showing <span className="font-weight--600">{this.state.numberOfReleases}</span> release{this.state.numberOfReleases > 1 && "s"}{" "}
                matching the term '<span className="font-weight--600">{this.state.searchQuery}</span>'
            </p>
        );
    }

    handleReleaseSelect = async release => {
        this.setState({ selectedRelease: release });

        if (this.state.selectedRelease.uri === release.uri) {
            return;
        }

        const collectionName = await this.checkReleaseIsInCollection(release);

        if (collectionName) {
            const newTableData = this.state.tableData.map(tableData => {
                if (tableData.id !== release.uri) {
                    return tableData;
                }
                tableData.status = {};
                tableData.status.neutral = true;
                tableData.status.message = `This release is already used in collection: "${collectionName}"`;
                return tableData;
            });
            this.setState({ tableData: newTableData });
        }
    };

    checkReleaseIsInCollection(release) {
        const collectionName = collections.checkContentIsInCollection(release.uri).then(response => {
            if (response.status === 204) {
                return null;
            }
            if (typeof response == "string") {
                return response;
            }
        });
        return collectionName;
    }

    shouldSubmitBeDisabled = () => {
        const releaseIsInCollection = this.state.tableData.find(release => {
            return this.state.selectedRelease.uri === release.id && release.status;
        });

        if (!releaseIsInCollection && this.state.selectedRelease) {
            return false;
        }

        return true;
    };

    handleSubmit = () => {
        this.props.onSubmit(this.state.selectedRelease);
    };

    render() {
        return (
            <div className="grid">
                <div className="modal__header grid">
                    <div className="grid__col-8">
                        <h1 className="modal__title margin-top--2">Select a calendar entry</h1>
                    </div>
                    <div className="grid__col-4">
                        <Input
                            id="search-releases"
                            disabled={this.state.isFetchingReleases}
                            onChange={this.handleSearch}
                            label="Search by release name"
                        />
                    </div>
                </div>
                <div className="modal__body grid__col-12">
                    {this.state.isFetchingSearchedReleases && !this.state.searchQuery && <p className="margin-bottom--1">Getting all releases...</p>}
                    {this.state.searchQuery && this.renderQueryText()}
                    <SelectableBox
                        activeRowID={this.state.selectedRelease.uri}
                        columns={columns}
                        isUpdating={this.state.isFetchingReleases || this.state.isFetchingSearchedReleases}
                        handleItemClick={this.handleReleaseSelect}
                        rows={this.state.tableData}
                    />
                    {!this.state.isFetchingReleases && (
                        <div className="grid grid--justify-space-between margin-top--1">
                            <div>
                                {this.state.numberOfPages !== this.state.currentPage && (
                                    <button
                                        className="btn btn--primary"
                                        type="button"
                                        onClick={this.loadMoreReleases}
                                        disabled={this.state.isFetchingExtraReleases}
                                    >
                                        Show more releases
                                    </button>
                                )}
                                {this.state.isFetchingExtraReleases && (
                                    <div className="margin-left--1 inline-block">
                                        <div className="loader loader--dark"></div>
                                    </div>
                                )}
                            </div>
                            <div>
                                {this.state.tableData.length > 0 ? (
                                    <p>
                                        Showing releases 1 to {this.state.tableData.length} of {this.state.numberOfReleases}
                                    </p>
                                ) : (
                                    <p>No upcoming releases to show</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                <div className="modal__footer grid__col-12">
                    <div>
                        <button
                            className="btn btn--positive margin-right--1"
                            type="button"
                            disabled={this.shouldSubmitBeDisabled()}
                            onClick={this.handleSubmit}
                        >
                            Submit
                        </button>
                        <button className="btn" type="button" onClick={this.props.onClose}>
                            Close
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

ScheduleByRelease.propTypes = propTypes;

export default ScheduleByRelease;
