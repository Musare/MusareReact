import React, { Component } from "react";
import { IndexLink, Link } from "react-router";

export default class Menu extends Component {

	render() {
		return (
			<div className="Menu">
				<IndexLink to="home">
					Home
				</IndexLink>
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
