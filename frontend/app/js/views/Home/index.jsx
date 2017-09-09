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
			<main id="homepage">
				<h2>{ t("home:title") }</h2>
			</main>
		);
	}
}
