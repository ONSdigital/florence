import React from 'react';
import ReactDOM from 'react-dom';
import GridContainer from 'dp-table-builder-ui';
import 'dp-table-builder-ui/dist/assets/GridContainer.css';

 window.startTableBuilder = function(id, data, onSave, onCancel) {
    ReactDOM.render(<GridContainer data={data} onSave={onSave} onCancel={onCancel} rendererUri={'/table'}/>, document.getElementById(id));
}
