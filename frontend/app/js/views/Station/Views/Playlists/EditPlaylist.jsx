import React, { Component } from "react";
import PropTypes from "prop-types";

import CustomInput from "components/CustomInput.jsx";
import CustomErrors from "components/CustomMessages.jsx";

import { connect } from "react-redux";

import { closeOverlay2, openOverlay3, closeOverlay3 } from "actions/stationOverlay";

import io from "io";

@connect(state => ({
	playlists: state.station.playlists,
}))
export default class EditPlaylist extends Component {
	constructor(props) {
		super(props);

		CustomInput.initialize(this);
	}

	addSongToPlaylistCallback = (songId) => {
		io.getSocket((socket) => {
			// Add song to the playlist
			socket.emit("playlists.addSongToPlaylist", songId, this.props.playlistId, res => {
				if (res.status === "success") {
					this.messages.clearAddSuccess("Successfully added song.");
				} else {
					this.messages.addError(res.message);
				}
				this.props.dispatch(closeOverlay3());
			});
		});
	};

	addSongToPlaylist = () => {
		this.props.dispatch(openOverlay3("searchYouTube", this.addSongToPlaylistCallback));
	};

	changeDisplayName = () => {
		this.messages.clearErrorSuccess();
		if (CustomInput.hasInvalidInput(this.input, ["displayName"])) {
			this.messages.clearAddError(this.props.t("general:someFieldsAreIncorrectError"));
		} else {
			io.getSocket(socket => {
				socket.emit("playlists.updateDisplayName", this.props.playlistId, this.input.displayName.getValue(), res => {
					if (res.status === "success") {
						this.messages.clearAddSuccess("Successfully changed name.");
					} else {
						this.messages.addError(res.message);
					}
				});
			});
		}
	};

	deletePlaylist = () => {
		this.messages.clearErrorSuccess();
		io.getSocket(socket => {
			socket.emit("playlists.remove", this.props.playlistId, res => {
				if (res.status === "success") {
					this.messages.clearAddSuccess("Successfully deleted playlist.");
					this.props.dispatch(closeOverlay2());
				} else {
					this.messages.addError(res.message);
				}
			});
		});
	};

	deleteSong = (songId) => {
		this.messages.clearErrorSuccess();
		io.getSocket(socket => {
			socket.emit('playlists.removeSongFromPlaylist', songId, this.props.playlistId, res => {
				if (res.status === "success") {
					this.messages.clearAddSuccess("Successfully removed song.");
				} else {
					this.messages.addError(res.message);
				}
			});
		});
	};

	promoteSong = (songId) => {
		this.messages.clearErrorSuccess();
		io.getSocket(socket => {
			socket.emit('playlists.moveSongToTop', this.props.playlistId, songId, res => {
				if (res.status === "success") {
					this.messages.clearAddSuccess("Successfully moved song up.");
				} else {
					this.messages.addError(res.message);
				}
			});
		});
	};

	demoteSong = (songId) => {
		this.messages.clearErrorSuccess();
		io.getSocket(socket => {
			socket.emit('playlists.moveSongToBottom', this.props.playlistId, songId, res => {
				if (res.status === "success") {
					this.messages.clearAddSuccess("Successfully moved song up.");
				} else {
					this.messages.addError(res.message);
				}
			});
		});
	};

	close = () => {
		this.props.dispatch(closeOverlay2());
	};

	render() {
		const { playlistId } = this.props;
		const playlist = this.props.playlists.find((playlist) => {
			return playlist.get("playlistId") === playlistId;
		});

		return (
			<div className="overlay">
				<button onClick={ this.close }>Back</button>
				<h1>Edit Playlist</h1>
				<CustomInput type="playlistDescription" name="displayName" label="Display name" placeholder="Display name" onRef={ ref => (this.input.displayName = ref) } original={ playlist.get("displayName") }/>
				<button onClick={ this.changeDisplayName }>Change displayname</button>


				{
					<ul>
						{
							playlist.get("songs").map((song) => {
								return (
									<li key={ song.get("songId") }>
										<p>{ song.get("title") }</p>
										<span onClick={ () => { this.deleteSong(song.get("songId")) }}>DELETE</span><br/>
										<span onClick={ () => { this.promoteSong(song.get("songId")) }}>UP</span><br/>
										<span onClick={ () => { this.demoteSong(song.get("songId")) }}>DOWN</span>
									</li>
								);
							})
						}
					</ul>
				}


				<button onClick={ this.addSongToPlaylist }>Add song to playlist</button>
				<CustomErrors onRef={ ref => (this.messages = ref) } />
				<button onClick={ this.deletePlaylist }>Delete this playlist</button>
			</div>
		);
	}
}
