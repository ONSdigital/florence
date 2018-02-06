import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import GridContainer from './components/gridContainer';

// ReactDOM.render(<App />, document.getElementById('root'));
// registerServiceWorker();

 window.startReact = function(id, data, onSave) {
    ReactDOM.render(<GridContainer data={data} onSave={onSave} rendererUri={'/table'}/>, document.getElementById(id));
}
