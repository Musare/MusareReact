import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";
import { Router, browserHistory } from "react-router";
import thunk from "redux-thunk";
import "babel-polyfill";
import logger from "dev/logger";

import rootReducer from "reducers";
import Routes from "routes";
import DevTools from "dev/redux-dev-tools";

import io from "io";

import config from "../../config/default";

import "../styles/main.scss";

const isProduction = process.env.NODE_ENV === "production";
let store = null;

if (isProduction) {
	const middleware = applyMiddleware(thunk);
	store = createStore(
		rootReducer,
		middleware
	);
} else {
	const middleware = applyMiddleware(thunk, logger);
	const enhancer = compose(
		middleware,
		DevTools.instrument()
	);
	store = createStore(
		rootReducer,
		enhancer
	);
}

io.init(config.serverDomain);
io.getSocket(socket => {
	socket.on("ready", (status, role, username, userId) => {
		// auth.data(status, role, username, userId);
	});
	socket.on("keep.event:banned", ban => {
		// auth.setBanned(ban);
	});
});

ReactDOM.render(
	<Provider store={ store }>
		{ isProduction ?
			<Router history={ browserHistory } routes={ Routes } /> :
			<div>
				<Router history={ browserHistory } routes={ Routes } />
				<DevTools />
			</div> }
	</Provider>,
	document.getElementById("root")
);
