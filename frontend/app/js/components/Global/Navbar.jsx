import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import { translate } from "react-i18next";

@connect(state => ({
	loggedIn: state.user.get("loggedIn"),
}))
@translate(["navbar"], { wait: true })
export default class Menu extends Component {
	static propTypes = {
		loggedIn: PropTypes.bool,
		t: PropTypes.func,
	};

	static defaultProps = {
		loggedIn: false,
		t: () => {},
	};

	getLink(to, text, canShow = true) {
		return (canShow) ? <NavLink to={ to } >{ text }</NavLink> : "";
	}

	render() {
		const { t } = this.props;

		return (
			<header className="Menu">
				{this.getLink("/", t("navbar:home"))}
				{this.getLink("/login", t("navbar:login"), !this.props.loggedIn)}
				{this.getLink("/register", t("navbar:register"), !this.props.loggedIn)}
				{this.getLink("/settings", t("navbar:settings"), this.props.loggedIn)}
				{this.getLink("/logout", t("navbar:logout"), this.props.loggedIn)}
			</header>
		);
	}
}
