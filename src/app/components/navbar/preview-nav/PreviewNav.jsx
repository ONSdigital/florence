import React from "react";
import { push } from "react-router-redux";
import PropTypes from "prop-types";
import { updateSelectedPreviewPage } from "../../../config/actions";
import Select from "../../Select";

const PreviewNav = ({ workingOn, preview, rootPath }) => {
    if (!workingOn) return null;

    const mapPagesToSelect = pages => {
        if (pages) {
            try {
                return pages.map(page => {
                    if (page.type === "visualisation" && page.files) {
                        return {
                            id: page.uri,
                            name: createPageTitle(page),
                            isGroup: true,
                            groupOptions: page.files.map(file => {
                                return { id: `${page.contentPath}/${file}`, name: file };
                            })
                        };
                    }
                    return {
                        id: page.uri,
                        name: createPageTitle(page)
                    };
                });
            } catch (err) {
                console.error("Error mapping pages to select", err);
            }
        }
        return;
    };

    const createPageTitle = page => {
        if (page.description.title && page.description.edition) {
            return `${page.description.title}: ${page.description.edition}`;
        }
        if (!page.description.title && page.description.edition) {
            return `[no title available]: ${page.description.edition}`;
        }
        if (page.description.title && !page.description.edition) {
            return page.description.title;
        }
        return "";
    };

    const handleSelectChange = event => {
        const selection = event.target.value;
        console.log("selection", selection);
        if (selection === "default-option") {
            return;
        }
        const uri = selection;
        props.updateSelectedPreviewPage(uri);
        push(`${rootPath}/collections/${workingOn.id}/preview?url=${uri}`);
    };

    return (
        <div className="global-nav__preview-select">
            <Select
                id="preview-select"
                contents={mapPagesToSelect(preview.pages) || []}
                onChange={handleSelectChange}
                defaultOption={preview.pages ? "Select an option" : "Loading pages..."}
                selectedOption={preview.selectedPage || ""}
            />
        </div>
    );
};

PreviewNav.propTypes = {
    preview: PropTypes.object.isRequired,
    rootPath: PropTypes.string.isRequired,
    workingOn: PropTypes.object.isRequired
};

export default PreviewNav;
