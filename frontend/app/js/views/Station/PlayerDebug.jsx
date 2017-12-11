import React, { Component } from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";

@connect(state => ({
	volume: state.volume.get("loudness"),
	muted: state.volume.get("muted"),
	songId: state.station.currentSong.get("songId"),
	duration: state.station.currentSong.getIn(["timings", "duration"]),
	skipDuration: state.station.currentSong.getIn(["timings", "skipDuration"]),
	timeElapsed: state.station.currentSong.getIn(["timings", "timeElapsed"]),
	timePaused: state.station.currentSong.getIn(["timings", "timePaused"]),
	pausedAt: state.station.currentSong.getIn(["timings", "pausedAt"]),
	startedAt: state.station.currentSong.getIn(["timings", "startedAt"]),
	exists: state.station.currentSong.get("songId") !== "",
	paused: state.station.info.get("paused"),
	mode: state.station.info.get("mode"),
}))
export default class PlayerDebug extends Component {
	static propTypes = {
	};

	static defaultProps = {
	};

	constructor(props) {
		super(props);
	}

	/*getTimeElapsed = () => {
		if (this.props.exists) {
			// TODO Replace with Date.currently
			let timePausedNow = 0;
			if (this.props.paused) timePausedNow = Date.now() - this.props.pausedAt;
			return Date.now() - this.props.startedAt - this.props.timePaused - timePausedNow;
		} else return 0;
	};*/

	render() {
		return (
			<div style={{border: "1px solid black"}}>
				<h3>Volume</h3>
				<b>Loudness: </b> { this.props.volume } <br/>
				<b>Muted: </b> { this.props.muted.toString() } <br/>
				<hr/>
				<h3>Station info</h3>
				<b>Paused: </b> { this.props.paused.toString() } <br/>
				<b>Mode: </b> { this.props.mode } <br/>
				<hr/>
				<h3>Current song</h3>
				<b>Song id: </b> { this.props.songId } <br/>
				<b>Duration: </b> { this.props.duration } <br/>
				<b>Skip duration: </b> { this.props.skipDuration } <br/>
				<b>Time elapsed: </b> { this.props.timeElapsed } <br/>
				<b>Time paused: </b> { this.props.timePaused } <br/>
				<b>Paused at: </b> { this.props.pausedAt } <br/>
				<b>Started at: </b> { this.props.startedAt } <br/>
				<b>Exists: </b> { this.props.exists.toString() } <br/>
				<hr/>
			</div>
		);
	}
}
