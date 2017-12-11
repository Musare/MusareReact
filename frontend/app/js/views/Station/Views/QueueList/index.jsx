import React, { Component } from "react";
import PropTypes from "prop-types";

import CustomInput from "components/CustomInput.jsx";
import CustomErrors from "components/CustomMessages.jsx";

import SongList from "./SongList.jsx";
import PlaylistList from "./PlaylistList.jsx";

import { connect } from "react-redux";

import { closeOverlay1, openOverlay2, closeOverlay2 } from "actions/stationOverlay";
import { selectPlaylist, deselectPlaylists } from "actions/playlistQueue";

import io from "io";

@connect(state => ({
	user: {
		loggedIn: state.session.get("loggedIn"),
		userId: state.session.get("userId"),
		role: state.session.get("role"),
	},
	station: {
		stationId: state.station.info.get("id"),
		owner: state.station.info.get("ownerId"),
		playlistSelectedId: state.station.info.get("playlistSelected"),
		songList: state.station.info.get("songList"),
	},
	song: {
		exists: state.station.currentSong.get("songId") !== "",
		title: state.station.currentSong.get("title"),
		artists: state.station.currentSong.get("artists"),
		duration: state.station.currentSong.getIn(["timings", "duration"]),
		thumbnail: state.station.currentSong.get("thumbnail"),
	},
}))
export default class QueueList extends Component {
	constructor(props) {
		super(props);

		this.state = {
			playlists: [],
		};

		io.getSocket((socket) => {
			socket.emit('playlists.indexForUser', res => {
				if (res.status === 'success') this.setState({
					playlists: res.data,
				});
			});

			socket.on('event:playlist.create', () => {
				socket.emit('playlists.indexForUser', res => {
					if (res.status === 'success') this.setState({
						playlists: res.data,
					});
				});
			});
			socket.on('event:playlist.delete', () => {
				socket.emit('playlists.indexForUser', res => {
					if (res.status === 'success') this.setState({
						playlists: res.data,
					});
				});
			});
		});
	}

	addSongToQueueCallback = (songId) => {
		io.getSocket((socket) => {
			// Add song to queue
			socket.emit("stations.addToQueue", this.props.stationId, songId, res => {
				if (res.status === "success") {
					this.messages.clearAddSuccess("Successfully added song.");
				} else {
					this.messages.addError(res.message);
				}
				this.props.dispatch(closeOverlay2());
			});
		});
	};

	addSongToQueue = () => {
		this.props.dispatch(openOverlay2("searchYouTube", null, this.addSongToQueueCallback));
	};

	deselectAll = () => {
		this.props.dispatch(deselectPlaylists());
	}

	close = () => {
		this.props.dispatch(closeOverlay1());
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
						(this.props.station.playlistSelectedId)
							? <button onClick={ this.deselectAll }>Deselect all playlists</button>
							: null
					}
				</div>
			</div>
		);
	}
}
