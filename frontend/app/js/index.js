import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import { BrowserRouter, Route } from "react-router-dom";
import thunk from "redux-thunk";
import "babel-polyfill";

import rootReducer from "reducers";

import App from "./app";

import "../styles/main.scss";

// const isProduction = process.env.NODE_ENV === "production";
let store = null;

const middleware = applyMiddleware(thunk);
store = createStore(
	rootReducer,
	middleware
);

ReactDOM.render(
	<Provider store={ store }>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</Provider>,
	document.getElementById("root")
);
