import React, { Component } from "react";
import PropTypes from "prop-types";

import CustomInput from "components/CustomInput.jsx";
import CustomErrors from "components/CustomMessages.jsx";

import { connect } from "react-redux";

import { closeOverlay2, openOverlay3, closeOverlay3 } from "actions/stationOverlay";

import io from "io";

@connect(state => ({
	stationId: state.station.get("id"),
}))
export default class EditPlaylist extends Component {
	constructor(props) {
		super(props);

		CustomInput.initialize(this);

		this.state = {
			gotPlaylist: false,
			playlist: {},
		};

		io.getSocket((socket) => {
			socket.emit('playlists.getPlaylist', this.props.playlistId, res => {
				if (res.status === 'success') {
					this.input.displayName.setValue(res.data.displayName, true);
					this.setState({
						gotPlaylist: true,
						playlist: res.data,
					});
				}
			});

			socket.on('event:playlist.addSong', data => {
				if (this.props.playlistId === data.playlistId) {
					let songs = this.state.playlist.songs;
					songs.push(data.song);
					this.setState({
						playlist: {
							...this.state.playlist,
							songs,
						},
					});
				}
			});

			socket.on('event:playlist.updateDisplayName', data => {
				if (this.props.playlistId === data.playlistId) {
					this.setState({
						playlist: {
							...this.state.playlist,
							displayName: data.displayName,
						},
					});
				}
			});

			socket.on('event:playlist.moveSongToBottom', data => {
				if (this.props.playlistId === data.playlistId) {
					let songs = this.state.playlist.songs;
					let songIndex;
					songs.forEach((song, index) => {
						if (song.songId === data.songId) songIndex = index;
					});
					let song = songs.splice(songIndex, 1)[0];
					songs.push(song);

					this.setState({
						playlist: {
							...this.state.playlist,
							songs,
						},
					});
				}
			});

			socket.on('event:playlist.moveSongToTop', (data) => {
				if (this.props.playlistId === data.playlistId) {
					let songs = this.state.playlist.songs;
					let songIndex;
					songs.forEach((song, index) => {
						if (song.songId === data.songId) songIndex = index;
					});
					let song = songs.splice(songIndex, 1)[0];
					songs.unshift(song);

					this.setState({
						playlist: {
							...this.state.playlist,
							songs,
						},
					});
				}
			});

			socket.on('event:playlist.removeSong', data => {
				if (this.props.playlistId === data.playlistId) {
					//TODO Somehow make this sync, so when 2 songs get removed at the same ms it removes both not just one
					let songs = this.state.playlist.songs;
					songs.forEach((song, index) => {
						if (song.songId === data.songId) songs.splice(index, 1);
					});

					this.setState({
						playlist: {
							...this.state.playlist,
							songs,
						},
					});
				}
			});
		});

		console.log("edit Playlist", props);
	}

	addSongToQueueCallback = (songId) => {
		io.getSocket((socket) => {
			// Add song to queue
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

	addSongToQueue = () => {
		this.props.dispatch(openOverlay3("searchYouTube", this.addSongToQueueCallback));
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
		return (
			<div className="overlay">
				<button onClick={ this.close }>Back</button>
				<h1>Edit Playlist</h1>
				<CustomInput type="playlistDescription" name="displayName" label="Display name" placeholder="Display name" onRef={ ref => (this.input.displayName = ref) } />
				<button onClick={ this.changeDisplayName }>Change displayname</button>


				{
					(this.state.gotPlaylist)
					? (
						<ul>
							{
								this.state.playlist.songs.map((song) => {
									return (
										<li key={ song.songId }>
											<p>{ song.title }</p>
											<span onClick={ () => { this.deleteSong(song.songId) }}>DELETE</span><br/>
											<span onClick={ () => { this.promoteSong(song.songId) }}>UP</span><br/>
											<span onClick={ () => { this.demoteSong(song.songId) }}>DOWN</span>
										</li>
									);
								})
							}
						</ul>
					)
					: null
				}


				<button onClick={ this.addSongToQueue }>Add song to queue</button>
				<CustomErrors onRef={ ref => (this.messages = ref) } />
				<button onClick={ this.deletePlaylist }>Delete this playlist</button>
			</div>
		);
	}
}
