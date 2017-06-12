import React, { Component } from "react";
import { IndexLink, Link } from "react-router";

export default class Menu extends Component {
	render() {
		return (
			<div className="Menu">
				<IndexLink to="/">
					Home
				</IndexLink>
				<Link to="login">
					Login
				</Link>
				<Link to="register">
					Register
				</Link>
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
