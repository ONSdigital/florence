import { createStore } from 'redux';

const initialState = {
    hello: "hello"
};

function reducer(state = initialState, action) {

}

let store = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

export default store;