import React from 'react';
import ReactDOM from 'react-dom';
import { combineReducers, createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import allReducers from './reducers';
import ReduxThunk from 'redux-thunk';

import Page from './components/Page.js';

const store = createStore(
  allReducers,
  applyMiddleware(ReduxThunk)
);

const app = document.getElementById("app");


const unsubscribe = store.subscribe(() => {
	console.log(store.getState());
    return;
})


ReactDOM.render(
	<Provider {... { store }}>
		<Page/>
	</Provider>, app
);
