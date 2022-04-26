import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { filterInteractives, getInteractives, resetSuccessMessage, sortInteractives } from "../../actions/interactives";
import { Link } from "react-router";
import AlertSuccess from "../../components/alert/AlertSuccess";
import FooterAndHeaderLayout from "../../components/layout/FooterAndHeaderLayout";
import Input from "../../components/Input";
import Select from "../../components/Select";
import ButtonWithShadow from "../../components/button/ButtonWithShadow";
import Checkbox from "../../components/Checkbox";
import Chip from "../../components/chip/Chip";
import moment from "moment";
import { isInArray } from "../../utilities/utils";

export default function InteractivesIndex(props) {
    const dispatch = useDispatch();
    const { filteredInteractives, successMessage } = useSelector(state => state.interactives);
    const { rootPath } = useSelector(state => state.state);

    const [internalId, setInternalId] = useState("");
    const [title, setTitle] = useState("");
    const [sort, setSort] = useState("");

    const [showSelects, setShowSelects] = useState(false);
    const [successCreate, setSuccessCreate] = useState(false);
    const [successUpdate, setSuccessUpdate] = useState(false);
    const [successDelete, setSuccessDelete] = useState(false);

    useEffect(() => {
        dispatch(getInteractives());
    }, []);

    useEffect(() => {
        if (successMessage.success) {
            if (successMessage.type === "create") {
                setSuccessCreate(true);
            }
            if (successMessage.type === "update") {
                setSuccessUpdate(true);
            }
            if (successMessage.type === "delete") {
                setSuccessDelete(true);
            }
            dispatch(resetSuccessMessage());
        }
    }, [successMessage]);

    const topics = [
        { id: 1, name: "General" },
        { id: 2, name: "People who live here" },
        { id: 3, name: "Visitors" },
        { id: 4, name: "Household and accommodation" },
        { id: 5, name: "Personal details" },
        { id: 6, name: "Health" },
        { id: 7, name: "Qualifications" },
        { id: 8, name: "Employment" },
    ];

    const sortOptions = [
        { id: "date", name: "Latest published" },
        { id: "title", name: "Title" },
    ];

    const clearCheckboxes = () => {
        const checkboxes = document.querySelectorAll("input[type=checkbox]");
        checkboxes.forEach(function (checkbox) {
            checkbox.checked = false;
        });
    };

    const handleFilter = () => {
        let filters = {};
        if (title !== "") {
            filters = Object.assign({}, filters, {
                label: title,
            });
        }
        if (internalId !== "") {
            filters = Object.assign({}, filters, {
                internalId,
            });
        }
        dispatch(filterInteractives(filters));
    };

    const handleSort = e => {
        const sort = e.target.value;
        setSort(sort);
        if (isInArray(["date", "title"], sort)) {
            dispatch(sortInteractives(sort));
        }
    };

    const dataSources = topics;

    return (
        <FooterAndHeaderLayout title="Manage my interactives">
            <div className="grid grid--justify-space-around padding-bottom--2">
                <div className={"grid__col-sm-12 grid__col-md-10 grid__col-xlg-8"}>
                    {successCreate && <AlertSuccess text="Interactive has been successfully submitted" />}
                    {successUpdate && <AlertSuccess text="Interactive has been successfully updated" />}
                    {successDelete && <AlertSuccess text="Interactive has been successfully deleted" />}
                    <div className="grid grid--justify-space-around margin-top--1">
                        <div className={"grid__col-sm-12 grid__col-md-3"}>
                            <h3 className="text-left">Filter by</h3>
                            <Input
                                type="text"
                                id="internal_id"
                                placeholder=""
                                name="internal_id"
                                onChange={e => setInternalId(e.target.value)}
                                label="Internal ID"
                                value={internalId}
                            />
                            <Input
                                type="text"
                                id="title"
                                placeholder=""
                                name="title"
                                onChange={e => setTitle(e.target.value)}
                                data-testid="title-input"
                                label="Title"
                                value={title}
                            />
                            <fieldset className="ons-fieldset">
                                <legend className="ons-fieldset__legend">Interactive type</legend>
                                <div className="ons-checkboxes__items">
                                    <span className="ons-checkboxes__item ons-checkboxes__item--no-border">
                                        <Checkbox value="embeddable" label="Embeddable (25)" id="embeddable" />
                                    </span>
                                    <span className="ons-checkboxes__item ons-checkboxes__item--no-border">
                                        <Checkbox
                                            value="full-feature"
                                            label="Full-feature (0)"
                                            id="full-feature"
                                            onChange={() => setShowSelects(!showSelects)}
                                        />
                                        {showSelects && (
                                            <span className="ons-checkbox__other" id="publications-other-wrap">
                                                <Select contents={topics} label="Primary topic" id="topics" />
                                                <Select contents={dataSources} label="Data source" id="data-source" />
                                            </span>
                                        )}
                                    </span>
                                </div>
                            </fieldset>
                            <div className="inline-block margin-top--2 margin-bottom--5">
                                <ButtonWithShadow type="button" buttonText="Apply" onClick={handleFilter} isSubmitting={false} />
                                <ButtonWithShadow
                                    type="button"
                                    buttonText="Reset all"
                                    class="secondary"
                                    onClick={clearCheckboxes}
                                    isSubmitting={false}
                                />
                            </div>
                        </div>
                        <div className={"grid__col-sm-12 grid__col-md-6"}>
                            <div className="grid--justify-space-between" style={{ display: "flex" }}>
                                <div className="grid--align-center" style={{ display: "flex" }}>
                                    <label className="ons-label padding-right--1" htmlFor="sort-options">
                                        Sort by
                                    </label>
                                    <Select contents={sortOptions} id="sort-options" onChange={handleSort} />
                                </div>
                                <div>
                                    <ButtonWithShadow
                                        type="button"
                                        buttonText="Upload interactive"
                                        class="secondary"
                                        onClick={() => props.router.push(`${rootPath}/interactives/create`)}
                                        isSubmitting={false}
                                    />
                                </div>
                            </div>
                            <ul className="list--neutral list--neutral__chips" role="list">
                                {filteredInteractives.map((interactive, key) => {
                                    const { id, metadata, last_updated, published } = interactive;
                                    return (
                                        <li key={key} className="list__item" role="listitem">
                                            <Link to={`${rootPath}/interactives/edit/${id}`} className="font-weight--600 font-size--18">
                                                {metadata.title}
                                            </Link>
                                            &nbsp;- <b className="font-size--18">{moment(last_updated).format("DD MMMM YYYY")}</b>
                                            {published ? <Chip style="green" text="PUBLISHED" /> : <Chip style="blue" text="UPLOADED" />}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </FooterAndHeaderLayout>
    );
}
