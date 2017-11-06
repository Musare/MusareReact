import React, { Component } from "react";
import PropTypes from "prop-types";

import CustomInput from "components/CustomInput.jsx";
import CustomErrors from "components/CustomMessages.jsx";

import { connect } from "react-redux";

import { closeOverlay1, openOverlay2, closeOverlay2 } from "actions/stationOverlay";
import { selectPlaylist, deselectPlaylists } from "actions/playlistQueue";

import io from "io";

@connect(state => ({
	user: {
		userId: state.user.get("userId"),
		role: state.user.get("role"),
	},
	loggedIn: state.user.get("loggedIn"),
	stationId: state.station.get("id"),
	stationOwner: state.station.get("ownerId"),
	songTitle: state.songPlayer.get("title"),
	songArtists: state.songPlayer.get("artists"),
	songDuration: state.songPlayer.get("duration"),
	songThumbnail: state.songPlayer.get("thumbnail"),
	simpleSong: state.songPlayer.get("simple"),
	songExists: state.songPlayer.get("exists"),
	playlistSelectedId: state.playlistQueue.get("playlistSelected"),
}))
export default class Settings extends Component {
	constructor(props) {
		super(props);

		this.state = {
			queue: [],
			userIdMap: {},
			userIdMapLoading: [],
			playlists: [],
		};

		io.getSocket((socket) => {
			socket.emit('stations.getQueue', this.props.stationId, data => {
				if (data.status === 'success') {
					this.setState({
						queue: data.queue,
					});
					data.queue.forEach((song) => {
						this.checkUserId(song.requestedBy);
					});
				}
			});

			socket.on('event:queue.update', queue => {
				this.setState({
					queue,
				});
				queue.forEach((song) => {
					this.checkUserId(song.requestedBy);
				});
			});

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

	isOwner = () => {
		if (this.props.loggedIn) {
			if (this.props.user.role === "admin") return true;
			if (this.props.user.userId === this.props.stationOwner) return true;
		}

		return false;
	};

	deleteSong = (songId) => {
		io.getSocket((socket) => {
			socket.emit("stations.removeFromQueue", this.props.stationId, songId, (data) => {
				if (data.status === "success") this.messages.clearAddSuccess("Successfully removed song.");
				else this.messages.clearAddError("Failed to remove song.", data.message);
			});
		});
	};

	checkUserId = (userId) => {
		if (!this.state.userIdMap[`Z${ userId }`] && !this.state.userIdMapLoading[`Z${ userId }`]) {
			this.setState({
				userIdMapLoading: this.state.userIdMapLoading.concat([`Z${ userId }`]),
			});
			io.getSocket((socket) => {
				socket.emit("users.getUsernameFromId", userId, (data) => {
					if (data.status === "success") {
						this.setState({
							userIdMap: {
								[`Z${ userId }`]: data.data,
							},
						});
					}
				});
			});
		}
	};

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

	getPlaylistAction = (playlistId) => {
		if (playlistId === this.props.playlistSelectedId) {
			return <span>SELECTED</span>;
		} else return <span onClick={ () => { this.selectPlaylist(playlistId); } }>SELECT</span>;
	}

	selectPlaylist = (playlistId) => {
		this.props.dispatch(selectPlaylist(playlistId));
	}

	deselectAll = () => {
		this.props.dispatch(deselectPlaylists());
	}

	close = () => {
		this.props.dispatch(closeOverlay1());
	};

	render() {
		console.log(this.isOwner());

		return (
			<div className="overlay">
				<button onClick={ this.close } className="back"><i className="material-icons">arrow_back</i></button>
				<div className="content">
					<h1>Queue</h1>
					<CustomErrors onRef={ ref => (this.messages = ref) } />

					{
						(this.state.queue)
						? (
							<ul>
								{
									(this.props.songExists)
									? (
										<li>
											<div className="left">
												<img src={ this.props.songThumbnail } onError={function(e) {e.target.src="/assets/images/notes.png"}}/>
											</div>
											<div className="right">
												<span className="duration">{ this.props.songDuration }</span>
												<p className="title">{ this.props.songTitle }</p>
												<span className="title-artists-spacing"/>
												<p className="artists">{ this.props.songTitle }</p>
											</div>
										</li>
									) : null
								}
								{
									this.state.queue.map((song) => {
										return (
											<li key={ song.songId }>
												<div className="left">
													<img src={ song.thumbnail }/>
												</div>
												<div className="right">
													<span className="duration">{ song.duration }</span>
													<p className="title">{ song.title }</p>
													<span className="title-artists-spacing"/>
													<p className="artists">{ song.title }</p>
													<span>
														<span>Requested by: </span>
														<a href={ `/u/${ this.state.userIdMap[`Z${ song.requestedBy }`] }` }>{ this.state.userIdMap[`Z${ song.requestedBy }`] }</a>
													</span>
													<i onClick={ () => { this.deleteSong(song.songId) } }>Delete</i>
												</div>
											</li>
										);
									})
								}
							</ul>
						)
						: null
					}

					<button onClick={ this.addSongToQueue }>Add song to queue</button>

					<hr/>

					<ul>
						{
							this.state.playlists.map((playlist) => {
								return (
									<li key={ playlist._id }>
										{ playlist.displayName } - { this.getPlaylistAction(playlist._id) }
									</li>
								)
							})
						}
					</ul>

					{
						(this.props.playlistSelectedId)
							? <button onClick={ this.deselectAll }>Deselect all playlists</button>
						: null
					}
				</div>
			</div>
		);
	}
}
