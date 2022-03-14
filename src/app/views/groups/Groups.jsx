import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import url from "../../utilities/url";
import Input from "../../components/Input";
import SimpleSelectableList from "../../components/simple-selectable-list/SimpleSelectableList";
import BackButton from "../../components/back-button";

const Groups = props => {
    const { groups, isLoading, loadTeams, isNewSignIn, rootPath } = props;
    const [filterTerm, setFilterTerm] = useState("");
    const [previewTeams, setPreviewTeams] = useState([]);

    useEffect(() => {
        loadTeams(isNewSignIn);
    }, []);

    useEffect(() => {
        const listOfPreviewTeams = [];
        groups.forEach(team => {
            const previewTeamData = {
                row: {
                    title: team.description != null ? team.description : team.group_name,
                    id: team.group_name,
                    url: `${rootPath}/groups/${team.group_name}`,
                    extraDetails: [[{ content: formatDateString(team.creation_date) }]],
                },
                date: team.creation_date, //used for sorting
            };
            listOfPreviewTeams.push(previewTeamData);
            listOfPreviewTeams.sort((a, b) => {
                return new Date(b.date) - new Date(a.date);
            });
        });
        setPreviewTeams(listOfPreviewTeams);
    }, [groups]);

    const formatDateString = date => {
        const utcDate = new Date(date);
        const datePart = utcDate.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
        const timePart = utcDate.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
        return (
            <span>
                Created <strong>{`${datePart} at ${timePart}`}</strong>
            </span>
        );
    };

    let allRowData = [];
    let rowsToDisplay = [];
    if (previewTeams.length > 0) {
        previewTeams.map(pTeam => {
            allRowData.push(pTeam.row);
        });
        rowsToDisplay =
            filterTerm === ""
                ? allRowData
                : allRowData.filter(
                      team =>
                          team.id.toLowerCase().search(filterTerm.toLowerCase()) !== -1 ||
                          team.title.toLowerCase().search(filterTerm.toLowerCase()) !== -1
                  );
    }

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
                    <Input id="search-content-types" placeholder="Search teams by name or ID" onChange={e => setFilterTerm(e.target.value)} />
                </div>
                <SimpleSelectableList rows={rowsToDisplay} showLoadingState={isLoading} />
            </div>
        </div>
    );
};

Groups.propTypes = {
    groups: PropTypes.array.isRequired,
    loadTeams: PropTypes.func.isRequired,
    isNewSignIn: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    rootPath: PropTypes.string.isRequired,
};
export default Groups;
