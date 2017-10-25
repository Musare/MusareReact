import React, { Component } from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";

@connect(state => ({
	timeElapsed: state.songPlayer.get("timeElapsed") * 1000,
	timeTotal: state.songPlayer.get("duration") * 1000,
	paused: state.station.get("paused"),
}))
export default class Seekerbar extends Component {
	static propTypes = {
		onRef: PropTypes.func,
	};

	static defaultProps = {
		onRef: () => {},
	};

	constructor(props) {
		super(props);

		this.state = {
			timeElapsedGuess: 0,
			percentage: 0,
		};

		setInterval(() => {
			if (!this.props.paused) {
				let timeElapsedGuess = this.state.timeElapsedGuess;
				timeElapsedGuess += 15;

				if (timeElapsedGuess <= this.props.timeElapsed) {
					timeElapsedGuess = this.props.timeElapsed;
				}

				this.setState({
					percentage: (timeElapsedGuess / this.props.timeTotal) * 100,
					timeElapsedGuess,
				});
			} else {
				this.setState({
					percentage: (this.props.timeElapsed / this.props.timeTotal) * 100,
				});
			}
		}, 50);
	}

	render() {
		return (
			<div className="seekerbar-container">
				<span style={{"width": this.state.percentage + "%"}}/>
			</div>
		);
	}
}
