import React, { Component } from "react";
import PropTypes from "prop-types";
import { translate } from "react-i18next";

@translate(["home"], { wait: true })
export default class Home extends Component {
	static propTypes = {
		t: PropTypes.func,
	};

	static defaultProps = {
		t: () => {},
	};

	render() {
		const { t } = this.props;

		return (
			<div>
				<h2>{ t("home:title") }</h2>
				<h2>{ t("home:officialStations") }</h2>
				<h2>{ t("home:communityStations") }</h2>
				<h2>{ t("home:users", { context: "male", count: 5 }) }</h2>
				<h2>{ t("home:users", { context: "female", count: 1 }) }</h2>
			</div>
		);
	}
}
