import React, { Component } from "react";
import PropTypes from "prop-types";

import CustomInput from "components/CustomInput.jsx";
import CustomErrors from "components/CustomMessages.jsx";

import { connect } from "react-redux";

import { closeOverlay2, openOverlay3 } from "actions/stationOverlay";

import io from "io";

@connect(state => ({
	stationId: state.station.get("id"),
}))
export default class EditPlaylist extends Component {
	constructor(props) {
		super(props);

		CustomInput.initialize(this);

		this.state = {

		};

		io.getSocket((socket) => {

		});
	}

	addSongToQueueCallback = (songId) => {
		io.getSocket((socket) => {
			// Add song to queue
			console.log("Add song to queue", songId);
		});
	};

	addSongToQueue = () => {
		this.props.dispatch(openOverlay3("searchYouTube", this.addSongToQueueCallback));
	};

	close = () => {
		this.props.dispatch(closeOverlay2());
	};

	render() {
		return (
			<div className="overlay">
				<button onClick={ this.close }>Back</button>
				<h1>Edit Playlist</h1>
				Song list


				<button onClick={ this.addSongToQueue }>Add song to queue</button>
				<CustomErrors onRef={ ref => (this.messages = ref) } />
			</div>
		);
	}
}
