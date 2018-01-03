import React, { Component } from "react";
import PropTypes from "prop-types";

import CustomInput from "components/CustomInput.jsx";
import CustomErrors from "components/CustomMessages.jsx";

import { actionCreators as stationInfoActionCreators } from "ducks/stationInfo";
import { bindActionCreators } from "redux";

import SongList from "./SongList.jsx";
import PlaylistList from "./PlaylistList.jsx";

import { connect } from "react-redux";

import { closeOverlay1, openOverlay2, closeOverlay2 } from "actions/stationOverlay";

import io from "io";

@connect(state => ({
	user: {
		loggedIn: state.session.get("loggedIn"),
		userId: state.session.get("userId"),
		role: state.session.get("role"),
	},
	station: {
		stationId: state.station.info.get("stationId"),
		owner: state.station.info.get("ownerId"),
		privatePlaylistQueue: state.station.info.get("privatePlaylistQueue"),
		songList: state.station.info.get("songList"),
	},
	song: {
		exists: state.station.currentSong.get("songId") !== "",
		title: state.station.currentSong.get("title"),
		artists: state.station.currentSong.get("artists"),
		duration: state.station.currentSong.getIn(["timings", "duration"]),
		thumbnail: state.station.currentSong.get("thumbnail"),
	},
}),
(dispatch) => ({
	onDeselectPlaylistQueue: bindActionCreators(stationInfoActionCreators.deselectPlaylistQueue, dispatch),
	closeOverlay1: bindActionCreators(closeOverlay1, dispatch),
	closeOverlay2: bindActionCreators(closeOverlay2, dispatch),
	openOverlay2: bindActionCreators(openOverlay2, dispatch),
}))
export default class QueueList extends Component {
	constructor(props) {
		super(props);
	}

	addSongToQueueCallback = (songId) => {
		io.getSocket((socket) => {
			// Add song to queue
			console.log(this.props.station.stationId);
			socket.emit("stations.addToQueue", this.props.station.stationId, songId, res => {
				if (res.status === "success") {
					this.messages.clearAddSuccess("Successfully added song.");
				} else {
					this.messages.addError(res.message);
				}
				this.props.closeOverlay2();
			});
		});
	};

	addSongToQueue = () => {
		this.props.openOverlay2("searchYouTube", null, this.addSongToQueueCallback);
	};

	deselectAll = () => {
		this.props.onDeselectPlaylistQueue();
	}

	close = () => {
		this.props.closeOverlay1();
	};

	render() {
		return (
			<div className="overlay">
				<button onClick={ this.close } className="back"><i className="material-icons">arrow_back</i></button>
				<div className="content">
					<h1>Queue</h1>
					<CustomErrors onRef={ ref => (this.messages = ref) } />

					<SongList/>
					<button onClick={ this.addSongToQueue }>Add song to queue</button>
					<hr/>
					<PlaylistList/>
					{
						(this.props.station.privatePlaylistQueue)
							? <button onClick={ this.deselectAll }>Deselect all playlists</button>
							: null
					}
				</div>
			</div>
		);
	}
}
