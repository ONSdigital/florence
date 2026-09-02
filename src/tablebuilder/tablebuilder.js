import React from "react";
import { createRoot } from "react-dom/client";
import TableBuilder from "dp-table-builder-ui";
import "dp-table-builder-ui/dist/assets/scss/main.scss";

// holding the root as a global variable here is not ideal but the least invasive
// change to the existing codebase.
let tableBuilderRoot;

window.startTableBuilder = (domID, data, onSave, onCancel, onError, path) => {
    const node = document.getElementById(domID);

    if (!node) {
        onError(`Element with ID ${domID} doesn't exist`);
        return;
    }

    tableBuilderRoot = createRoot(node);
    tableBuilderRoot.render(
        <TableBuilder
            data={data}
            onSave={onSave}
            onCancel={onCancel}
            onError={onError}
            rendererUri={path}
        />
    );
};

window.closeTableBuilder = (domID, onError) => {
    const node = document.getElementById(domID);

    if (!node) {
        onError(`Element with ID ${domID} doesn't exist`);
        return;
    }

    if (tableBuilderRoot) {
        tableBuilderRoot.unmount();
        tableBuilderRoot = null;
    }
};
