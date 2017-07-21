import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Redirect, Route } from "react-router-dom";

@connect(state => ({
	loggedIn: state.app.get("loggedIn"),
}))

export default class AuthRoute extends Component {
	static propTypes = {
		loggedIn: PropTypes.bool,
		authRequired: PropTypes.bool,
		component: PropTypes.oneOfType([
			PropTypes.element,
			PropTypes.func,
		]),
	}

	static defaultProps = {
		loggedIn: false,
		authRequired: true,
		component: () => {},
	}

	render() {
		const { authRequired } = this.props;
		if (this.props.loggedIn) {
			if (authRequired) return <Route props={ this.props } component={ this.props.component } />;
			return <Redirect to={ "/" } />;
		}
		if (authRequired) return <Redirect to={ "/login" } />;
		return <Route props={ this.props } component={ this.props.component } />;
	}
}
