import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { IndexLink, Link } from "react-router";

@connect(state => ({
	loggedIn: state.user.get("loggedIn"),
}))

export default class Menu extends Component {
	static propTypes = {
		loggedIn: PropTypes.bool,
	}

	render() {
		return (
			<div className="Menu">
				<IndexLink to="/">
					Home
				</IndexLink>
				{ this.props.loggedIn ?
					<Link to="logout">
						Logout
					</Link> :
					<div>
						<Link to="login">
							Login
						</Link>
						<Link to="register">
							Register
						</Link>
					</div>
				}
				<Link to="template">
					Template
				</Link>
				<Link to="404">
					404
				</Link>
			</div>
		);
	}
}
