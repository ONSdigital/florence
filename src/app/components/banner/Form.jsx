import React from "react";
import validate from "./ValidationRules";
import useForm from "../../hooks/useForm";
import Input from "../Input";
import Select from "../Select";

const OPTIONS = [
    { id: "national_emergency", name: "National emergency" },
    { id: "local_emergency", name: "Local emergency" },
    { id: "notable_death", name: "Notable death" },
];

const Form = ({ data, handleFormSave, handleCancel }) => {
    const { values, errors, handleChange, handleSubmit } = useForm(handleSave, validate, data);
    const hasErrors = Object.keys(errors).length > 0;

    function handleSave() {
        handleFormSave(values);
    }

    return (
        <div className="margin-top--1">
            <Input id="title" name="title" label="Title" type="text" error={errors?.title} onChange={handleChange} value={values.title || ""} />
            <Select
                contents={OPTIONS}
                error={errors?.type}
                id="type"
                label="Type"
                name="type"
                selectedOption={values.type || ""}
                defaultOption=""
                value={values.type || ""}
                onChange={handleChange}
            />
            <Input
                error={errors?.description}
                id="description"
                label="Description"
                name="description"
                type="textarea"
                value={values.description || ""}
                onChange={handleChange}
            />
            <Input
                className="margin-right"
                error={errors?.uri}
                id="uri"
                label="Link url"
                name="uri"
                type="text"
                value={values.uri || ""}
                onChange={handleChange}
            />
            <Input
                error={errors?.linkText}
                id="linkText"
                label="Link text"
                name="linkText"
                type="text"
                value={values.linkText || ""}
                onChange={handleChange}
            />
            <button type="submit" className="btn btn--primary btn--margin-right" onClick={handleSubmit} disabled={hasErrors}>
                Save
            </button>
            <button type="reset" className="btn" onClick={handleCancel}>
                Cancel
            </button>
            <hr className="margin-top--1" />
        </div>
    );
};

export default Form;
