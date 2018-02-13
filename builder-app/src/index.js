import React from 'react';
import ReactDOM from 'react-dom';
import GridContainer from 'dp-table-builder-ui';
import 'dp-table-builder-ui/dist/assets/GridContainer.css';

// tell es-lint not to bug us about sweetAlert not being defined:
/* global sweetAlert */

 window.startTableBuilder = function(id, data, onSave, onCancel) {
     var onError = function (message) {
         if (sweetAlert) {
             sweetAlert(message);
         } else {
             console.log(message);
         }
     }
    ReactDOM.render(<GridContainer data={data} onSave={onSave} onCancel={onCancel} onError={onError} rendererUri={'/table'}/>, document.getElementById(id));
}
