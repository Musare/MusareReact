import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Redirect, Route } from "react-router-dom";

@connect(state => ({
	loggedIn: state.user.get("loggedIn"),
	authProcessed: state.user.get("authProcessed"),
}))

export default class AuthRoute extends Component {
	static propTypes = {
		loggedIn: PropTypes.bool,
		authRequired: PropTypes.bool,
		authProcessed: PropTypes.bool,
		component: PropTypes.oneOfType([
			PropTypes.element,
			PropTypes.func,
		]),
	}

	static defaultProps = {
		loggedIn: false,
		authRequired: true,
		authProcessed: false,
		component: () => {},
	}

	render() {
		const { authRequired, loggedIn, authProcessed } = this.props;
		if (!authRequired) return <Route props={ this.props } component={ this.props.component } />;
		else if (authProcessed) {
			if (loggedIn) {
				return <Route props={ this.props } component={ this.props.component } />;
			}
			return <Redirect to={ "/login" } />;
		}
		return <h1>Loading...</h1>;
	}
}
