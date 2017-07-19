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
	}

	static defaultProps = {
		loggedIn: false,
	}

	render() {
		return (
			<div className="Menu">
				<NavLink to="/">Home</NavLink>
				{ this.props.loggedIn ?
					<NavLink to="logout">Logout</NavLink> :
					<div>
						<NavLink to="login">Login</NavLink>
						<NavLink to="register">Register</NavLink>
					</div>
				}
				<NavLink to="template">Template</NavLink>
			</div>
		);
	}
}
