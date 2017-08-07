import React, { Component } from "react";
import { connect } from "react-redux";

@connect(state => ({
	counter: state.app.get("counter"),
}))

export default class Home extends Component {
	render() {
		return (
			<div>
				<h2>Welcome to Musare!</h2>
			</div>
		);
	}
}
