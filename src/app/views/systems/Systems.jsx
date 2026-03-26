import React from "react";
import SimpleSelectableList from "../../components/simple-selectable-list/SimpleSelectableList";

const Systems = () => {
    const systems = [
        {
            title: "Florence",
            id: "florence",
            details: ["The legacy content management system"],
            url: `/florence/collections`,
            externalLink: false,
            enabled: true,
        },
        {
            title: "Wagtail",
            id: "wagtail",
            details: ["The new content management system for content"],
            url: `/wagtail-admin`,
            externalLink: true,
            enabled: true,
        },
        {
            title: "Dataset Catalogue Manager",
            id: "dataset-catalogue-manager",
            details: ["The new content management system for datasets"],
            url: `/data-admin`,
            externalLink: true,
            enabled: true,
        },
    ];

    return (
        <div className="grid grid--justify-space-around">
            <div className="grid__col-9">
                <h1>Dissemination services</h1>
                <div className="margin-bottom--1">
                    <p className="font-size--18 ">Here you can find a list of the services that make up Dissemination.</p>
                </div>
                <SimpleSelectableList rows={systems} />
            </div>
        </div>
    );
};

Systems.propTypes = {};

export default Systems;
