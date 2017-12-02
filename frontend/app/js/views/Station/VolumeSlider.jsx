import React, { Component } from "react";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";

import { connect } from "react-redux";

import { actionCreators as volumeActionCreators } from "ducks/volume";

@connect(state => ({
	volume: state.volume.get("loudness"),
	muted: state.volume.get("muted"),
}),
(dispatch) => ({
	onVolumeLoudnessChange: bindActionCreators(volumeActionCreators.changeVolumeLoudness, dispatch),
	onVolumeMute: bindActionCreators(volumeActionCreators.muteVolume, dispatch),
	onVolumeUnmute: bindActionCreators(volumeActionCreators.unmuteVolume, dispatch),
}))
export default class VolumeSlider extends Component {
	constructor(props) {
		super(props);
	}

	changeVolumeHandler = (loudness) => {
		loudness = loudness / 100;
		localStorage.setItem("volume", loudness);
		this.props.onVolumeLoudnessChange(loudness);
	};

	muteVolume = () => {
		this.props.onVolumeMute();
	};

	unmuteVolume = () => {
		this.props.onVolumeUnmute();
	};

	render() {
		return (
			<div className="volume-container">
				{
					(this.props.muted) ? ([
						<i className="material-icons" key="unmuteButton" onClick={ this.unmuteVolume }>volume_off</i>,
						<input key="disabledVolumeInput" type="range" min="0" max="10000" value="0" disabled/>,
					]) : ([
						<i className="material-icons" key="muteButton" onClick={ this.muteVolume }>volume_up</i>,
						<input key="volumeInput" type="range" min="0" max="10000" value={ this.props.volume * 100 } onChange={ (e) => { this.changeVolumeHandler(e.target.value) } }/>, //Add default value
					])
				}
			</div>
		);
	}
}
