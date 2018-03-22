import React from 'react';
import ReactDOM, { render } from 'react-dom';
import MapBuilder from 'dp-map-builder-ui';
import 'dp-map-builder-ui/dist/assets/scss/main.scss';

window.startMapBuilder = (domID, data, onSave, onCancel, onError, path) => {
    console.log("startMapBuilder")
    console.log(data)
    const node = document.getElementById(domID);

    if (!node) {
        onError(`Element with ID ${domID} doesn't exist`)
        return;
    }

    ReactDOM.render(
        <MapBuilder data={data} onSave={onSave} onCancel={onCancel} onError={onError} rendererUri={path} />,
        node
    )
}

window.closeMapBuilder = (domID, onError) => {
    const node = document.getElementById(domID);

    if (!node) {
        onError(`Element with ID ${domID} doesn't exist`)
        return;
    }

    ReactDOM.unmountComponentAtNode(node);
}
