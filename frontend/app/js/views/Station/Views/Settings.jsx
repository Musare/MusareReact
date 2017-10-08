import React, { Component } from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";

import { closeOverlay1 } from "actions/stationOverlay";

@connect(state => ({
	name: state.station.get("name"),
	displayName: state.station.get("displayName"),
	description: state.station.get("description"),
}))
export default class Settings extends Component {
	constructor(props) {
		super(props);

		this.state = {
			name: props.name,
			displayName: props.displayName,
			description: props.description,
		};
	}

	close = () => {
		this.props.dispatch(closeOverlay1());
	};

	render() {
		return (
			<div className="overlay">
				<button onClick={ this.close }>Back</button>
				<h1>Settings</h1>
			</div>
		);
	}
}
