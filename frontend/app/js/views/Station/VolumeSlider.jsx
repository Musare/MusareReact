import React, { Component } from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";

import { changeVolume, changeVolumeMuted } from "actions/volume";

@connect(state => ({
	volume: state.volume.get("volume"),
	muted: state.volume.get("muted"),
}))
export default class VolumeSlider extends Component {
	constructor(props) {
		super(props);
	}

	changeVolumeHandler = (e) => {
		let volume = e.target.value / 100;
		this.props.dispatch(changeVolume(volume));
	};

	muteVolume = () => {
		this.props.dispatch(changeVolumeMuted(true));
	};

	unmuteVolume = () => {
		this.props.dispatch(changeVolumeMuted(false));
	};

	render() {
		return (
			<div className="volume-container">
				<h2>{ this.props.volume }. Muted: { (this.props.muted) ? "true" : "false" }</h2>
				{
					(this.props.muted) ? ([
						<span key="unmuteButton" onClick={ this.unmuteVolume }>UNMUTE</span>,
						<input key="disabledVolumeInput" type="range" min="0" max="10000" value="0" disabled/>,
					]) : ([
						<span key="muteButton" onClick={ this.muteVolume }>MUTE</span>,
						<input key="volumeInput" type="range" min="0" max="10000" onChange={ this.changeVolumeHandler }/>, //Add default value
					])
				}
			</div>
		);
	}
}
