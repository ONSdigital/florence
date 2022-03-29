import React, { useEffect, useState, useCallback } from "react";
import filter from "lodash/filter";
import PropTypes from "prop-types";
import { Link } from "react-router";
import { useInput } from "../../hooks/useInput";
import url from "../../utilities/url";
import Input from "../../components/Input";
import SimpleSelectableList from "../../components/simple-selectable-list/SimpleSelectableList";
import BackButton from "../../components/back-button";

const Groups = props => {
    const { groups, isLoading, loadTeams, isNewSignIn } = props;
    const [search, setSearch] = useInput("");

    useEffect(() => {
        loadTeams(isNewSignIn);
    }, []);

    const getFilteredGroups = useCallback(() => {
        return filter(groups, group => group.name?.toLowerCase().includes(search.value.toLowerCase()));
    }, [search.value]);

    return (
        <div className="grid grid--justify-space-around">
            <div className="grid__col-11 grid__col-md-9">
                <BackButton classNames="margin-top--2" />
                <span className="margin-top--1">
                    <h1 className="inline-block margin-top--0 margin-bottom--0 padding-right--1">Preview teams</h1>
                    <Link className="margin-left--1" to={url.resolve("./groups/create")}>
                        Create a new team
                    </Link>
                </span>
                <div className="grid__col-6">
                    <Input id="search-content-types" placeholder="Search teams by name" {...search} />
                </div>
                <SimpleSelectableList rows={search.value ? getFilteredGroups() : groups} showLoadingState={isLoading} />
            </div>
        </div>
    );
};

Groups.propTypes = {
    groups: PropTypes.array.isRequired,
    loadTeams: PropTypes.func.isRequired,
    isNewSignIn: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
};
export default Groups;
