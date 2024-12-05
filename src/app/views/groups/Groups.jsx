import React, { useEffect, useState, useCallback } from "react";
import filter from "lodash/filter";
import PropTypes from "prop-types";
import { Link } from "react-router";
import { useInput } from "../../hooks/useInput";
import url from "../../utilities/url";
import date from "../../utilities/date";
import Input from "../../components/Input";
import SimpleSelectableList from "../../components/simple-selectable-list/SimpleSelectableList";
import BackButton from "../../components/back-button";

const Groups = props => {
    const { groups, isLoading, loadTeams } = props;
    const [search, setSearch] = useInput("");
    const isAdmin = props.loggedInUser.isAdmin || false;

    useEffect(() => {
        loadTeams();
    }, []);

    const getFilteredGroups = useCallback(() => {
        return filter(groups, group => group.name?.toLowerCase().includes(search.value.toLowerCase()));
    }, [search.value]);

    return (
        <div className="grid grid--justify-space-around">
            <div className="grid__col-9 grid__col-md-9">
                <div className="grid margin-bottom--1">
                    <div className="grid__col-10">
                        <span className="margin-top--1">
                            <h1 className="inline-block margin-top--0 margin-bottom--0 padding-right--1">Preview teams</h1>
                            {isAdmin && (
                                <Link className="margin-left--1 font-size--18" to={url.resolve("./groups/create")}>
                                    Create a new team
                                </Link>
                            )}
                        </span>
                        <div className="grid__col-7">
                            <Input id="search-content-types" placeholder="Search teams by name" {...search} />
                        </div>
                    </div>
                    <div className="grid__col-2 grid--align-end">
                        {isAdmin && (
                            <>
                                <span
                                    className="margin-top--2"
                                    style={{ height: "28px", fontSize: "21px", fontWeight: "400", fontFamily: "Roboto Slab" }}
                                >
                                    Teams report
                                </span>
                                <a
                                    class="btn btn--positive"
                                    download={`${date.format(Date.now(), "yyyymmdd-HHMM")}-groups-report`}
                                    href="/groups-report"
                                >
                                    Export teams report
                                </a>{" "}
                            </>
                        )}
                    </div>
                </div>
                <SimpleSelectableList rows={search.value ? getFilteredGroups() : groups} showLoadingState={isLoading} />
            </div>
        </div>
    );
};

Groups.propTypes = {
    groups: PropTypes.array.isRequired,
    loadTeams: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
};
export default Groups;
