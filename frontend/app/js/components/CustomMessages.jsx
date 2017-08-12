import React, { Component } from "react";
import PropTypes from "prop-types";

const i18next = require("i18next");

const t = i18next.t;

i18next.loadNamespaces("customMessages");

export default class CustomMessages extends Component {
	static propTypes = {
		onRef: PropTypes.func,
	};

	static defaultProps = {
		onRef: () => {},
	};

	constructor() {
		super();

		this.state = {
			error: [],
			info: [],
			success: [],
		};
	}

	componentDidMount() {
		this.props.onRef(this);
	}

	componentWillUnmount() {
		this.props.onRef(null);
	}

	clearError = (cb = () => {}) => {
		this.clear("error", cb);
	};

	addError = (error) => {
		this.add("error", error);
	};

	clearAddError = (error) => {
		this.clearAdd("error", error);
	};

	clearInfo = (cb = () => {}) => {
		this.clear("info", cb);
	};

	addInfo = (info) => {
		this.add("info", info);
	};

	clearAddInfo = (info) => {
		this.clearAdd("info", info);
	};

	clearSuccess = (cb = () => {}) => {
		this.clear("success", cb);
	};

	addSuccess = (success) => {
		this.add("success", success);
	};

	clearAddSuccess = (success) => {
		this.clearAdd("success", success);
	};

	clearErrorSuccess = (cb) => {
		this.setState({
			error: [],
			success: [],
		}, cb);
	};

	clearAll = (cb) => {
		this.setState({
			error: [],
			success: [],
			info: [],
		}, cb);
	};

	clear = (type, cb) => {
		this.setState({
			[type]: [],
		}, cb);
	};

	add = (type, message) => {
		// TODO add error parsing, e.g. for arrays/objects
		console.log("CM_ADD", type, message, this.state[type]);
		this.setState({
			[type]: this.state[type].concat([message]),
		});
	};

	clearAdd = (type, message) => {
		this.setState({
			[type]: [message],
		});
	};

	list = (type) => {
		let messages = this.state[type];
		let key = 0;
		if (messages.length > 0) {
			messages = messages.map((message) => {
				key++;
				return (<li key={ key }>{ message }</li>);
			});
			let text = "";
			if (type === "error") text = t("customMessages:somethingWentWrong");
			else if (type === "info") text = t("customMessages:info");
			else if (type === "success") text = t("customMessages:success");

			return (
				<div key={ type } className={ type }>
					<p>{ text }</p>
					<ul>
						{ messages }
					</ul>
				</div>
			);
		} return null;
	};

	render() {
		return (
			<div>
				{ this.list("error") }
				{ this.list("info") }
				{ this.list("success") }
			</div>
		);
	}
}
