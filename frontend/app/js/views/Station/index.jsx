import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { Map, List } from "immutable";

import PropTypes from "prop-types";
import { translate, Trans } from "react-i18next";

import Player from "./Player";
import PlayerDebug from "./PlayerDebug";
import Seekerbar from "./Seekerbar";
import VolumeSlider from "./VolumeSlider";
import Ratings from "./Ratings";
import Time from "./Time";
import Overlays from "./Views/Overlays";

import { actionCreators as stationCurrentSongActionCreators } from "ducks/stationCurrentSong";
import { actionCreators as stationInfoActionCreators } from "ducks/stationInfo";
import { bindActionCreators } from "redux";

//import { changeVolume } from "actions/volume";
//import { changeSong, setTimeElapsed, timePaused, receivedRatings, receivedOwnRatings } from "actions/songPlayer";
//import { pauseStation, resumeStation } from "actions/station";
import { openOverlay1 } from "actions/stationOverlay";
//import { addSong } from "actions/playlistQueue";
//import { updateTimePaused } from "../../actions/songPlayer";

import { connect } from "react-redux";

import io from "io";
import config from "config";

@connect(state => ({
	user: {
		userId: state.session.get("userId"),
		role: state.session.get("role"),
		loggedIn: state.session.get("loggedIn"),
	},
	/*
	//queueLocked: state.station.get("locked"),
	//partyEnabled: state.station.get("partyMode"),*/
	song: {
		exists: state.station.currentSong.get("songId") !== "",
		songId: state.station.currentSong.get("songId"),
		title: state.station.currentSong.get("title"),
		artists: state.station.currentSong.get("artists"),
	},
	station: {
		stationId: state.station.info.get("stationId"),
		name: state.station.info.get("name"),
		displayName: state.station.info.get("displayName"),
		type: state.station.info.get("type"),
		paused: state.station.info.get("paused"),
		ownerId: state.station.info.get("ownerId"),
	},/*
	selectedPlaylistObject: {
		addedSongId: state.playlistQueue.get("addedSongId"),
		selectedPlaylistId: state.playlistQueue.get("playlistSelected"),
	},*/
}),
(dispatch) => ({
	onNextSong: bindActionCreators(stationCurrentSongActionCreators.nextSong, dispatch),
	onLikeUpdate: bindActionCreators(stationCurrentSongActionCreators.likeUpdate, dispatch),
	onDislikeUpdate: bindActionCreators(stationCurrentSongActionCreators.dislikeUpdate, dispatch),
	onLikedUpdate: bindActionCreators(stationCurrentSongActionCreators.likedUpdate, dispatch),
	onDislikedUpdate: bindActionCreators(stationCurrentSongActionCreators.dislikedUpdate, dispatch),
	onPauseTime: bindActionCreators(stationCurrentSongActionCreators.pauseTime, dispatch),
	onResumeTime: bindActionCreators(stationCurrentSongActionCreators.resumeTime, dispatch),
	onPause: bindActionCreators(stationInfoActionCreators.pause, dispatch),
	onResume: bindActionCreators(stationInfoActionCreators.resume, dispatch),
	onQueueIndex: bindActionCreators(stationInfoActionCreators.queueIndex, dispatch),
	onQueueUpdate: bindActionCreators(stationInfoActionCreators.queueUpdate, dispatch),
	onTimeElapsedUpdate: bindActionCreators(stationCurrentSongActionCreators.timeElapsedUpdate, dispatch),
	onPlaylistsUpdate: bindActionCreators(stationInfoActionCreators.playlistsUpdate, dispatch),
	openOverlay1: bindActionCreators(openOverlay1, dispatch),
}))

@translate(["station"], { wait: true })
export default class Station extends Component {
	static propTypes = {
		t: PropTypes.func,
	};

	static defaultProps = {
		t: () => {},
	};

	constructor(props) {
		super();

		this.state = {
			timeElapsedInterval: setInterval(() => {
				props.onTimeElapsedUpdate();
			}, 500),
		};
		/*this.state = {
			mode: this.getModeTemp(props.partyEnabled, props.queueLocked),
		};*/

		io.getSocket(socket => {
			socket.emit("stations.join", props.station.name, res => {
				if (res.status === "success") {
					if (res.data.currentSong) {
						let song = {
							songId: res.data.currentSong.songId,
							timings: {
								duration: res.data.currentSong.duration,
								skipDuration: res.data.currentSong.skipDuration,
								// timeElapsed?
								timePaused: res.data.timePaused,
								startedAt: res.data.startedAt,
							},
							title: res.data.currentSong.title,
							artists: res.data.currentSong.artists,
							thumbnail: res.data.currentSong.thumbnail,
							ratings: {
								enabled: !(res.data.currentSong.likes === -1 && res.data.currentSong.dislikes === -1),
								likes: res.data.currentSong.likes,
								dislikes: res.data.currentSong.dislikes,
							},
						};
						this.props.onNextSong(song);
						this.fetchOwnRatings();
					} else {
						// TODO This will probably need to be handled
						this.props.onNextSong(null);
					}

					socket.emit("playlists.indexForUser", res => {
						if (res.status === "success") this.props.onPlaylistsUpdate(res.data);
					});

					socket.on("event:songs.next", data => {
						//this.addTopToQueue();
						if (data.currentSong) {
							let song = {
								songId: data.currentSong.songId,
								timings: {
									duration: data.currentSong.duration,
									skipDuration: data.currentSong.skipDuration,
									// timeElapsed?
									timePaused: data.timePaused,
									// pausedAt?
									startedAt: data.startedAt,
								},
								title: data.currentSong.title,
								artists: data.currentSong.artists,
								thumbnail: data.currentSong.thumbnail,
								ratings: {
									enabled: !(data.currentSong.likes === -1 && data.currentSong.dislikes === -1),
									likes: data.currentSong.likes,
									dislikes: data.currentSong.dislikes,
								},
							};
							this.props.onNextSong(song);
							this.fetchOwnRatings();
						} else {
							this.props.onNextSong(null);
						}
					});
					socket.on("event:stations.pause", pausedAt => {
						// TODO Dispatch to station info
						this.props.onPause();
						this.props.onPauseTime(pausedAt);
					});
					socket.on("event:stations.resume", data => {
						// TODO Dispatch to station info
						this.props.onResume();
						this.props.onResumeTime(data.timePaused);
					});
					socket.on("event:song.like", data => {
						if (data.songId === this.props.song.songId) {
							this.props.onLikeUpdate(data.likes);
							this.props.onDislikeUpdate(data.dislikes);
						}
					});
					socket.on("event:song.dislike", data => {
						if (data.songId === this.props.song.songId) {
							this.props.onLikeUpdate(data.likes);
							this.props.onDislikeUpdate(data.dislikes);
						}
					});
					socket.on("event:song.unlike", data => {
						if (data.songId === this.props.song.songId) {
							this.props.onLikeUpdate(data.likes);
							this.props.onDislikeUpdate(data.dislikes);
						}
					});
					socket.on("event:song.undislike", data => {
						if (data.songId === this.props.song.songId) {
							this.props.onLikeUpdate(data.likes);
							this.props.onDislikeUpdate(data.dislikes);
						}
					});
					socket.on("event:song.newRatings", data => {
						if (data.songId === this.props.song.songId) {
							this.props.onLikedUpdate(data.liked);
							this.props.onDislikedUpdate(data.disliked);
						}
					});
					socket.on("event:playlist.create", () => {
						socket.emit("playlists.indexForUser", res => {
							if (res.status === "success") this.props.onPlaylistsUpdate(res.data);
						});
					});
					socket.on("event:playlist.delete", () => {
						socket.emit("playlists.indexForUser", res => {
							if (res.status === "success") this.props.onPlaylistsUpdate(res.data);
						});
					});

					if (this.props.station.type === "community") {
						socket.emit("stations.getQueue", this.props.station.stationId, data => {
							if (data.status === "success") {
								this.props.onQueueIndex(data.queue);
							}
							//TODO Handle error
						});

						socket.on("event:queue.update", queue => {
							this.props.onQueueUpdate(queue);
						});
					}
				}
			});
		});

		/*setInterval(() => {
			if (this.props.song.exists) {
				this.props.dispatch(setTimeElapsed(this.props.station.paused, this.props.station.pausedAt)); // TODO Fix
			}
		}, 1000);*/
	}

	componentWillUnmount() {
		clearInterval(this.state.timeElapsedInterval);
	}

	/*isInQueue = (songId, cb) => {
		io.getSocket((socket) => {
			socket.emit('stations.getQueue', this.props.stationId, data => {
				if (data.status === 'success') {
					data.queue.forEach((song) => {
						if (song._id === songId) {
							return cb(true);
						}
					});
				}

				return cb(false);
			});
		});
	};*/

	/*checkIfCanAdd = (cb) => {
		if (this.state.mode === "normal") return cb(false);
		let playlistId = this.props.selectedPlaylistObject.selectedPlaylistId;
		let songId = this.props.selectedPlaylistObject.addedSongId;
		console.log(playlistId, songId, this.props.song.songId);
		if (playlistId) {
			if (songId === this.props.song.songId) return cb(true);
			else if (songId === null) return cb(true);
			else {
				this.isInQueue(songId, (res) => {
					return cb(res);
				});
			}
		}
	}*/

	/*addTopToQueue = () => {
		console.log("ADD TOP TO QUEUE!!!");
		this.checkIfCanAdd((can) => {
			if (!can) return;
			let playlistId = this.props.selectedPlaylistObject.selectedPlaylistId;
			console.log(can);
			io.getSocket((socket) => {
				socket.emit('playlists.getFirstSong', this.props.selectedPlaylistObject.selectedPlaylistId, data => {
					if (data.status === 'success') {
						let songId = data.song.songId;
						if (data.song.duration < 15 * 60) {
							this.props.dispatch(addSong(songId));

							socket.emit('stations.addToQueue', this.props.station.stationId, songId, data2 => {
								if (data2.status === 'success') {
									this.moveToBottom(playlistId, songId, (data3) => {
										if (data3.status === 'success') {
										}
									});
								} else {
									this.messages.clearAddError("Could not automatically add top song of playlist to queue.", data2.message);
								}
							});
						} else {
							this.messages.clearAddError("Top song in playlist was too long to be added. Moving to the next song.");
							this.moveToBottom(playlistId, songId, (data3) => {
								if (data3.status === 'success') {
									setTimeout(() => {
										this.addTopToQueue();
									}, 2000);
								}
							});
						}
					}
				});
			});
		});
	};*/

	/*moveToBottom = (playlistId, songId, cb) => {
		io.getSocket((socket) => {
			socket.emit('playlists.moveSongToBottom', playlistId, songId, data => {
				cb(data);
			});
		});
	}*/

	/*getModeTemp = (partyEnabled, queueLocked) => {
		// If party enabled
		// If queue locked
		// Mode is DJ
		// If queue not locked
		// Mode party
		// If party not enabled
		// Mode is normal

		if (partyEnabled) {
			if (queueLocked) return "dj";
			else return "party";
		} else return "normal";
	}*/

	fetchOwnRatings = () => {
		io.getSocket((socket) => {
			if (!this.props.song.exists) return;
			socket.emit("songs.getOwnSongRatings", this.props.song.songId, (data) => {
				if (this.props.song.songId === data.songId) {
					this.props.onLikedUpdate(data.liked);
					this.props.onDislikedUpdate(data.disliked);
				}
			});
		});
	};

	isOwner = () => {
		if (this.props.user.loggedIn) {
			if (this.props.user.role === "admin") return true;
			if (this.props.user.userId === this.props.station.ownerId) return true;
		}

		return false;
	};

	addSongTemp = () => {
		io.getSocket(socket => {
			socket.emit('stations.addToQueue', this.props.station.stationId, '60ItHLz5WEA', data => {
				console.log("ATQ Res", data);
			});
		});
	};

	resumeStation = () => {
		io.getSocket(socket => {
			socket.emit("stations.resume", this.props.station.stationId, data => {
				// TODO Handle error/success
			});
		});
	};

	pauseStation = () => {
		io.getSocket(socket => {
			socket.emit("stations.pause", this.props.station.stationId, data => {
				// TODO Handle error/success
			});
		});
	};

	skipStation = () => {
		io.getSocket(socket => {
			socket.emit("stations.forceSkip", this.props.station.stationId, data => {});
		});
	}

	render() {
		const { t } = this.props;

		//TODO Make this not re-render a lot

		return (
			<main id="station">
				<Overlays t={ this.props.t } />

				<div id="sidebar">
					<button onClick={ () => { this.props.openOverlay1("users") } }><i className="material-icons">people</i></button>
					<button onClick={ () => { this.props.openOverlay1("queueList") } }><i className="material-icons">queue_music</i></button>
					<button onClick={ () => { this.props.openOverlay1("playlists") } }><i className="material-icons">library_music</i></button>
					<hr/>
					{
						(this.isOwner())
						? (this.props.station.paused)
							? <button onClick={ this.resumeStation }><i className="material-icons">play_arrow</i></button>
							: <button onClick={ this.pauseStation }><i className="material-icons">pause</i></button>
						: null
					}
					{
						(this.isOwner())
						? <button onClick={ this.skipStation }><i className="material-icons">skip_next</i></button>
						: null
					}
					{
						(this.isOwner())
						? <button onClick={ () => { this.props.openOverlay1("settings") } }><i className="material-icons">settings</i></button>
						: null
					}
				</div>

				<h1 onClick={ this.addSongTemp }>{ this.props.station.displayName }</h1>

				<PlayerDebug />

				<div className={(!this.props.song.exists) ? "player-container hidden" : "player-container"}>
					<div className="iframe-container">
						<Player onRef={ ref => (this.player = ref) }/>
						{ (this.props.station.paused) ? <div className="paused-overlay"><span>Paused</span><i className="material-icons">pause</i></div> : null }
					</div>
					<Seekerbar/>
				</div>

				{ (this.props.song.exists) ? (
				[
					<div key="content" className="content">
						<span className="title">{ this.props.song.title }</span>
						<span className="artists">{ this.props.song.artists.join(", ") }</span>
						<Time/>
						<VolumeSlider/>
						<Ratings/>
					</div>,
				]) : (
					<h1>No song playing</h1>
				) }
			</main>
		);
	}
}
