import React, { useState } from "react";
import clsx from "clsx";
import { useInput } from "../../hooks/useInput";
import Input from "../Input";
import Select from "../Select";

const Form = ({ data, handleFormSave, handleCancel }) => {
    const [type, setType] = useState(data ? data.type : "");
    const [title, setTitle] = useInput(data ? data.title : "");
    const [description, setDescription] = useInput(data ? data.description : "");
    const [uri, setUri] = useInput(data ? data.uri : "");
    const [linkText, setLinkText] = useInput(data ? data.linkText : "");

    const options = [
        { id: "national_emergency", name: "National emergency" },
        { id: "local_emergency", name: "Local emergency" },
        { id: "notable_death", name: "Notable death" },
    ];

    const handleSave = () => {
        handleFormSave({ title: title.value, type, description: description.value, uri: uri.value, linkText: linkText.value });
    };

    return (
        <div className="margin-top--1">
            <Input id="title" label="Title" type="text" {...title} />
            <Select id="type" label="Type" contents={options} selectedOption={type} onChange={e => setType(e.target.value)} />
            <Input id="description" label="Description" type="textarea" {...description} />
            <div className="grid">
                <div className="margin-right--2">
                    <Input id="uri" className="margin-right" label="Link url" type="text" {...uri} />
                </div>
                <Input id="linkText" label="Link text" type="text" {...linkText} />
            </div>
            <button type="submit" className="btn btn--primary btn--margin-right" onClick={handleSave}>
                Save
            </button>
            <button type="reset" className="btn" onClick={handleCancel}>
                Cancel
            </button>
        </div>
    );
};

export default Form;
