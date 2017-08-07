import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";

@connect(state => ({
	loggedIn: state.user.get("loggedIn"),
}))

export default class Menu extends Component {
	static propTypes = {
		loggedIn: PropTypes.bool,
	};

	static defaultProps = {
		loggedIn: false,
	};

	getLink(to, text, canShow = true) {
		return (canShow) ? <NavLink to={ to } >{ text }</NavLink> : "";
	}

	render() {
		return (
			<div className="Menu">
				{this.getLink("/", "Home")}
				{this.getLink("/login", "Login", !this.props.loggedIn)}
				{this.getLink("/register", "Register", !this.props.loggedIn)}
				{this.getLink("/settings", "Settings", this.props.loggedIn)}
				{this.getLink("/logout", "Logout", this.props.loggedIn)}
			</div>
		);
	}
}
