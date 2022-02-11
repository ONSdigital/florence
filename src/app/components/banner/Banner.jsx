import React, { useState } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import isEmptyObject from "is-empty-object";
import Form from "./Form";

const Banner = ({ data, handleBannerSave }) => {
    const [show, setShow] = useState(false);
    const toggleForm = () => setShow(prevState => setShow(!prevState));
    const handleSubmit = data => {
        handleBannerSave(data);
        setShow(false);
    };

    if (data && !isEmptyObject(data) && !show) {
        return (
            <>
                <div data-testid="banner" className={clsx("banner", "margin-top--1", data.type)}>
                    <h3 className="banner-title">{data.title}</h3>
                    <p data-testid="description" className="banner-description">
                        {data.description}
                    </p>
                    <p data-testid="link" className="banner-link">
                        <a href={data.uri} title={data.uri} target="_blank">
                            {data.linkText}
                        </a>
                    </p>
                </div>
                <div className="text-right">
                    <button type="button" className="btn btn--link" onClick={toggleForm}>
                        Edit
                    </button>
                    |
                    <button type="button" className="btn btn--link" onClick={() => handleSubmit({})}>
                        Delete
                    </button>
                </div>
            </>
        );
    }

    if (data && !isEmptyObject(data) && show) {
        return <Form data={data} handleCancel={() => setShow(false)} handleFormSave={handleSubmit} />;
    }

    return (
        <>
            {!show && (
                <button type="button" className="btn btn--link margin-top--1 margin-right--auto" onClick={toggleForm}>
                    Add an Emergency Banner
                </button>
            )}
            {show && <Form data={data} handleCancel={() => setShow(false)} handleFormSave={handleSubmit} />}
        </>
    );
};

Banner.propTypes = {
    data: PropTypes.shape({
        type: PropTypes.oneOf(["notable_death", "national_emergency", "local_emergency"]),
        title: PropTypes.string,
        description: PropTypes.string,
        linkText: PropTypes.string,
        uri: PropTypes.string,
    }),
    handleBannerSave: PropTypes.func.isRequired,
};

export default Banner;
