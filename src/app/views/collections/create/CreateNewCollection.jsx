import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import collectionValidation from "../validation/collectionValidation";
import Input from "../../../components/Input";
import Select from "../../../components/Select";
import SelectedItemList from "../../../components/selected-items/SelectedItemList";
import RadioGroup from "../../../components/radio-buttons/RadioGroup";
import Modal from "../../../components/Modal";
import ScheduleByRelease from "../schedule-by-release/ScheduleByRelease";
import date from "../../../utilities/date";

export const EMPTY_COLLECTION = {
    name: {
        value: "",
        errorMsg: "",
    },
    type: "scheduled",
    publishDate: {
        value: "",
        errorMsg: "",
    },
    publishTime: {
        value: "09:30",
        errorMsg: "",
    },
    pendingDeletes: [],
    teams: [],
    release: {
        date: "",
        title: "",
        uri: "",
        isProvisional: null,
        errorMsg: "",
    },
    scheduleType: "custom-schedule",
};

const CreateNewCollection = props => {
    const [newCollection, setNewCollection] = useState(EMPTY_COLLECTION);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showScheduleByRelease, setShowScheduleByRelease] = useState(false);
    const [releaseDateISO, setReleaseDateISO] = useState("");

    useEffect(() => {
        props.loadTeams(props.isNewSignIn);
    }, []);

    const handleCollectionNameChange = e => {
        if (!e) return;
        setNewCollection(prevState => ({
            ...prevState,
            name: { ...prevState.name, value: e.target.value },
        }));
    };

    const handleTeamSelect = e => {
        if (!e) return;
        setNewCollection(prevState => ({
            ...prevState,
            teams: prevState.teams.concat(props.teams.find(team => team.id === e.target.value)),
        }));
    };

    const handleTeamRemove = id => {
        if (!id) return;
        setNewCollection(prevState => ({
            ...prevState,
            teams: prevState.teams.filter(team => team.id !== id),
        }));
    };

    const handleCollectionTypeChange = e => {
        if (!e) return;
        setNewCollection(prevState => ({
            ...prevState,
            type: e.value,
            release: {
                uri: "",
                date: "",
                title: "",
                errorMsg: "",
            },
        }));
    };

    const handleScheduleTypeChange = e => {
        if (!e) return;
        setNewCollection(prevState => ({
            ...prevState,
            scheduleType: e.value,
        }));
    };

    const handlePublishDateChange = e => {
        if (!e) return;
        setNewCollection(prevState => ({
            ...prevState,
            publishDate: { errorMsg: "", value: e.target.value },
        }));
    };

    const handlePublishTimeChange = e => {
        if (!e) return;
        setNewCollection(prevState => ({
            ...prevState,
            publishTime: { errorMsg: "", value: e.target.value },
        }));
    };

    const handleSelectRelease = release => {
        setNewCollection(prevState => ({
            ...prevState,
            release: {
                uri: release.uri,
                title: release.title,
                date: release.releaseDate,
                isProvisional: release.isProvisional,
                errorMsg: "",
            },
        }));
        setShowScheduleByRelease(false);
    };

    const handleCloseRelease = () => {
        setShowScheduleByRelease(false);
    };

    const handleAddRelease = e => {
        e.preventDefault();
        setShowScheduleByRelease(true);
    };

    const makePublishDate = () => {
        if (newCollection.type !== "scheduled") {
            return;
        }
        if (newCollection.scheduleType === "calender-entry-schedule") {
            return releaseDateISO;
        }
        return new Date(`${newCollection.publishDate.value} ${newCollection.publishTime.value}`).toISOString();
    };

    const mapStateToPostBody = () => {
        try {
            return {
                name: newCollection.name.value,
                type: newCollection.type,
                publishDate: makePublishDate(),
                teams: newCollection.teams.map(team => {
                    return team.name;
                }),
                collectionOwner: props.user.userType,
                releaseUri: newCollection.scheduleType === "calender-entry-schedule" ? newCollection.release.uri : null,
            };
        } catch (error) {
            console.error("Error mapping new collection state to POST body" + error);
        }
    };

    const handleSubmit = e => {
        e.preventDefault();

        setIsSubmitting(true);
        let hasError = false;
        const validatedName = collectionValidation.name(newCollection.name.value, props.collections);

        if (!validatedName.isValid) {
            setNewCollection(prevState => ({
                ...prevState,
                name: { ...prevState.name, errorMsg: validatedName.errorMsg },
            }));
            hasError = true;
        }

        if (newCollection.type === "scheduled" && newCollection.scheduleType === "custom-schedule") {
            const validatedDate = collectionValidation.date(newCollection.publishDate.value);

            if (!validatedDate.isValid) {
                setNewCollection(prevState => ({
                    ...prevState,
                    publishDate: { ...prevState.publishDate, errorMsg: validatedDate.errorMsg },
                }));
                hasError = true;
            }
        }

        if (newCollection.type === "scheduled" && newCollection.scheduleType === "custom-schedule") {
            const validatedTime = collectionValidation.time(newCollection.publishTime.value);

            if (!validatedTime.isValid) {
                setNewCollection(prevState => ({
                    ...prevState,
                    publishTime: { ...prevState.publishTime, errorMsg: validatedTime.errorMsg },
                }));
                hasError = true;
            }
        }

        if (newCollection.type === "scheduled" && newCollection.scheduleType === "calender-entry-schedule") {
            const release = newCollection.release;
            const validatedRelease = collectionValidation.release(release);
            if (!validatedRelease.isValid) {
                const collectionRelease = {
                    ...release,
                    errorMsg: validatedRelease.errorMsg,
                };

                newCollection = {
                    ...newCollection,
                    release: collectionRelease,
                };
                this.setState({
                    newCollection,
                    isSubmitting: false,
                });
                hasError = true;
            }
        }

        if (hasError) {
            setIsSubmitting(false);
            return;
        }

        props.createCollectionRequest(mapStateToPostBody());
        setNewCollection(EMPTY_COLLECTION);
        setIsSubmitting(false);
    };

    const getTeamsToSelect = () => (props.teams ? props.teams.map(team => ({ ...team, disabled: newCollection.teams.includes(team) })) : []);

    const releaseTypeRadioData = [
        {
            id: "scheduled-radio",
            value: "scheduled",
            label: "Scheduled publish",
        },
        { id: "manual-radio", value: "manual", label: "Manual publish" },
    ];

    const renderScheduleOptions = () => {
        const scheduleOptionsRadioData = [
            {
                id: "custom-radio",
                value: "custom-schedule",
                label: "Custom schedule",
            },
            {
                id: "calendar-radio",
                value: "calender-entry-schedule",
                label: "Calendar entry schedule",
            },
        ];

        return (
            <div>
                <RadioGroup
                    groupName="schedule-type"
                    radioData={scheduleOptionsRadioData}
                    selectedValue={newCollection.scheduleType}
                    onChange={handleScheduleTypeChange}
                    legend="Schedule type"
                    inline
                />
                {newCollection.scheduleType === "custom-schedule" ? (
                    <div>
                        <Input
                            id="publish-date"
                            label="Publish date"
                            type="date"
                            onChange={handlePublishDateChange}
                            error={newCollection.publishDate.errorMsg}
                            value={newCollection.publishDate.value}
                            min={date.format(date.getNow(), "yyyy-mm-dd")}
                            max={date.format(date.addYear(10), "yyyy-mm-dd")}
                        />
                        <Input
                            id="publish-time"
                            label="Publish time"
                            type="time"
                            value={newCollection.publishTime.value}
                            onChange={handlePublishTimeChange}
                            error={newCollection.publishTime.errorMsg}
                        />
                    </div>
                ) : (
                    <div>
                        <div className="margin-bottom--1">
                            {newCollection.release ? (
                                <div>
                                    <p>Selected release: </p>
                                    <p className="font-weight--600 colour--night-shadz">{newCollection.release.errorMsg}</p>
                                    <p className="font-weight--600">
                                        {newCollection.release.isProvisional && "[Not finalised] "}
                                        {newCollection.release.title}
                                    </p>
                                </div>
                            ) : (
                                <p>No release selected</p>
                            )}
                        </div>
                        <button type="button" onClick={handleAddRelease} className="btn btn--primary margin-bottom--2 ">
                            Select {newCollection.release.uri && "different "}a calendar entry
                        </button>
                    </div>
                )}
            </div>
        );
    };

    return (
        <form onSubmit={handleSubmit}>
            <Input
                id="collection-name"
                label="Collection name"
                type="text"
                error={newCollection.name.errorMsg}
                value={newCollection.name.value}
                onChange={handleCollectionNameChange}
            />
            <Select
                id="collection-teams"
                label="Select a team(s) that can view this collection"
                contents={getTeamsToSelect()}
                defaultOption={!props.fetchingTeams ? "Select an option" : "Loading teams..."}
                selectedOption={"default-option"}
                onChange={handleTeamSelect}
            />
            {newCollection.teams && <SelectedItemList items={newCollection.teams} handleRemoveItem={handleTeamRemove} />}
            <RadioGroup
                groupName="release-type"
                radioData={releaseTypeRadioData}
                selectedValue={newCollection.type}
                onChange={handleCollectionTypeChange}
                legend="Publish type"
                inline
            />
            {newCollection.type === "scheduled" && renderScheduleOptions()}
            <button type="submit" className="btn btn--positive margin-top--1" disabled={isSubmitting}>
                Create collection
            </button>
            {isSubmitting && <div className="form__loader loader loader--dark margin-left--1" />}
            {showScheduleByRelease && (
                <Modal sizeClass="grid__col-8">
                    <ScheduleByRelease onClose={handleCloseRelease} onSubmit={handleSelectRelease} />
                </Modal>
            )}
        </form>
    );
};

CreateNewCollection.propTypes = {
    collections: PropTypes.array.isRequired,
    createCollectionRequest: PropTypes.func.isRequired,
    fetchingTeams: PropTypes.bool.isRequired,
    loadTeams: PropTypes.func.isRequired,
    teams: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string.isRequired, name: PropTypes.string.isRequired })),
    user: PropTypes.shape({ userType: PropTypes.string.isRequired }).isRequired,
};

export default CreateNewCollection;
