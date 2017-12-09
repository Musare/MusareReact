import React, { Component } from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";

const formatTime = (duration) => {
	let d = moment.duration(duration, "seconds");
	if (duration < 0) return "0:00";
	return ((d.hours() > 0) ? (d.hours() < 10 ? ("0" + d.hours() + ":") : (d.hours() + ":")) : "") + (d.minutes() + ":") + (d.seconds() < 10 ? ("0" + d.seconds()) : d.seconds());
};

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
