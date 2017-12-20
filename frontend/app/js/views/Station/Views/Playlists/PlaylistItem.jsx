import React, { Component } from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";

import { openOverlay2 } from "actions/stationOverlay";

import io from "io";

@connect(state => ({
	station: {
		stationId: state.station.info.get("stationId"),
		mode: state.station.info.get("mode"),
	},
}))
export default class PlaylistItem extends Component {
	constructor(props) {
		super(props);
	}

	isOwner = () => {
		if (this.props.loggedIn) {
			if (this.props.user.userId === this.props.stationOwner) return true;
		}

		return false;
	};

	playPlaylist = (playlistId) => {
		this.messages.clearErrorSuccess();
		io.getSocket((socket) => {
			socket.emit("stations.selectPrivatePlaylist", this.props.station.stationId, playlistId, (res) => {
				if (res.status === "success") {
					this.message.addSuccess("Successfully selected private playlist.");
				} else {
					this.messages.addError(res.message);
				}
			});
		});
	};

	getPlaylistAction = (playlistId) => {
		if (this.props.station.mode === "normal") {
			if (this.isOwner()) {
				const play = <span onClick={ () => { this.playPlaylist(playlistId) } }>PLAY!</span>;
				//const stop = <span onClick={ () => { this.stopPlaylist(playlistId) } }>STOP!</span>;
				const stop = null; // There's currently no backend functionality to stop a playlist from playing

				if (this.props.privatePlaylist === playlistId) return stop;
				else return play;
			}
		}

		return null;
	};

	render() {
		const { playlist } = this.props;

		return (
			<li>
				{ playlist.get("displayName") } - <span onClick={ () => { this.props.dispatch(openOverlay2("editPlaylist", { playlistId: playlist.get("playlistId") })) } }>Edit</span>
				{ this.getPlaylistAction(playlist.get("playlistId")) }
			</li>
		);
	}
}
