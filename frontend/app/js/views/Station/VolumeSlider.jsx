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

	changeVolumeHandler = (volume) => {
		volume = volume / 100;
		localStorage.setItem("volume", volume);
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
