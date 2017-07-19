import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";
import { BrowserRouter, Route } from "react-router-dom";
import thunk from "redux-thunk";
import "babel-polyfill";
import logger from "dev/logger";

import rootReducer from "reducers";
import DevTools from "dev/redux-dev-tools";

import App from "views/App";

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

ReactDOM.render(
	<Provider store={ store }>
		<div>
			<BrowserRouter>
				<Route path="/" component={ App } />
			</BrowserRouter>
			{ !isProduction ? <DevTools /> : "" }
		</div>
	</Provider>,
	document.getElementById("root")
);
