import React from 'react';
import ReactDOM from 'react-dom';
import TableBuilder from 'dp-table-builder-ui';
import 'dp-table-builder-ui/dist/assets/scss/main.scss';

window.startTableBuilder = (domID, data, onSave, onCancel, onError, path) => {
    const node = document.getElementById(domID);

    if (!node) {
        onError(`Element with ID ${domID} doesn't exist`)
        return;
    }

    ReactDOM.render(
        <TableBuilder data={data} onSave={onSave} onCancel={onCancel} onError={onError} rendererUri={path} />,
        node
    )
}

window.closeTableBuilder = (domID, onError) => {
    const node = document.getElementById(domID);

    if (!node) {
        onError(`Element with ID ${domID} doesn't exist`)
        return;
    }

    ReactDOM.unmountComponentAtNode(node);
}
