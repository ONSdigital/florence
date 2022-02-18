import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import url from "../../../utilities/url";
import Input from "../../../components/Input";
import SimpleSelectableList from "../../../components/simple-selectable-list/SimpleSelectableList";

const propTypes = {
    dispatch: PropTypes.func,
    teams: PropTypes.object.isRequired,
    loadTeams: PropTypes.func.isRequired,
};

const TeamsList = props => {
    const { teams, loadTeams } = props;

    const [isFetchingTeams, setIsFetchingTeams] = useState(true);
    const [filterTerm, setFilterTerm] = useState("");
    const [previewTeams, setPreviewTeams] = useState([]);

    useEffect(() => {
        loadTeams();
    }, []);

    useEffect(() => {
        const listOfPreviewTeams = [];
        teams?.groups?.forEach(team => {
            if (team.group_name.startsWith("role-")){
                return; // role-admin, role-publisher are not preview teams but are stored in groups
            }
            const previewTeamData = {
                row: {
                    title: team.description != null ? team.description : team.group_name,
                    id: team.group_name,
                    url: `./groups/${team.group_name}`,
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
        setIsFetchingTeams(false);
    }, [teams]);

    const formatDateString = date => {
        const utcDate = new Date(date);
        const datePart = utcDate.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
        const timePart = utcDate.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
        const completeFormattedDate = `${datePart} at ${timePart}`;
        return (
            <>
                Created <span className="font-weight--600">{completeFormattedDate}</span>
            </>
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
            <div className="grid__col-9">
                <div className="margin-top--2">
                    &#9664; <Link to={url.resolve("../")}>Back</Link>
                </div>
                <span className="margin-top--1">
                    <h1 className="inline-block margin-top--0 margin-bottom--0 padding-right--1">Preview teams</h1> <Link to={url.resolve("./groups/create")}> Create a new team </Link>
                </span>
                <div className="grid__col-6">
                    <Input
                        id="search-content-types"
                        placeholder="Search teams by name or ID"
                        onChange={e => {
                            e.preventDefault();
                            setFilterTerm(e.target.value);
                        }}
                    />
                </div>
                <SimpleSelectableList rows={rowsToDisplay} showLoadingState={isFetchingTeams} />
            </div>
        </div>
    );
};

TeamsList.propTypes = propTypes;
export default TeamsList;
