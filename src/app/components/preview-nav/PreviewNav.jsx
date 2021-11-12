import React, { useEffect, useState } from "react";
import { push } from "react-router-redux";
import PropTypes from "prop-types";
import Select from "../Select";

const PreviewNav = ({ workingOn, preview, rootPath, updateSelected }) => {
    if (!workingOn) return null;
    const [uri, setUri] = useState("/");

    useEffect(() => {
        updateSelected(uri);
        push(`${rootPath}/collections/${workingOn.id}/preview?url=${uri}`);
    }, [uri]);

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
                                return {
                                    id: `${page.contentPath}/${file}`,
                                    name: file,
                                };
                            }),
                        };
                    }
                    return {
                        id: page.uri,
                        name: createPageTitle(page),
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

    return (
        <div className="global-nav__preview-select">
            <Select
                id="preview-select"
                contents={mapPagesToSelect(preview.pages) || []}
                onChange={e => setUri(e.target.value)}
                defaultOption={preview.pages ? "" : "Loading pages..."}
                selectedOption={uri}
            />
        </div>
    );
};

PreviewNav.propTypes = {
    preview: PropTypes.object.isRequired,
    rootPath: PropTypes.string.isRequired,
    workingOn: PropTypes.object.isRequired,
};

export default PreviewNav;
