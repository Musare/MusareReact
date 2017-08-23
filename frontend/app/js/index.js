import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import { BrowserRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import thunk from "redux-thunk";
import "babel-polyfill";

import rootReducer from "reducers";

import i18n from "./i18n";
import App from "./app";

import "main.scss";

// const isProduction = process.env.NODE_ENV === "production";
let store = null;

const middleware = applyMiddleware(thunk);
store = createStore(
	rootReducer,
	middleware
);

ReactDOM.render(
	<I18nextProvider i18n={ i18n }>
		<Provider store={ store }>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</Provider>
	</I18nextProvider>,
	document.getElementById("root")
);
