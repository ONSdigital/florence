import React from 'react';
import ReactDOM, { render } from 'react-dom';
import TableBuilder from 'dp-table-builder-ui';

window.startTableBuilder = (domID, data, onSave, onCancel, onError, path) => {
    console.log({domID, data, onSave, onCancel, onError, path});
    ReactDOM.render(
        <TableBuilder data={data} onSave={onSave} onCancel={onCancel} onError={onError} rendererUri={path} />,
        document.getElementById(domID)
    )
}
