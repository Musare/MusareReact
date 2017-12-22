import React, { Component } from "react";
import PropTypes from "prop-types";

import { formatTime } from "utils";

import { connect } from "react-redux";

@connect(state => ({
	duration: state.station.currentSong.getIn(["timings", "duration"]),
	timeElapsed: state.station.currentSong.getIn(["timings", "timeElapsed"]),
}))
export default class Time extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<span className="time">
				{ formatTime(this.props.timeElapsed) } / { formatTime(this.props.duration) }
			</span>
		);
	}
}
