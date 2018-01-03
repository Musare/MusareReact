import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { Map, List } from "immutable";
import async from "async";

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
import { actionCreators as stationPlaylistsActionCreators } from "ducks/stationPlaylists";
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
	playlists: state.station.playlists,
	station: {
		stationId: state.station.info.get("stationId"),
		name: state.station.info.get("name"),
		displayName: state.station.info.get("displayName"),
		type: state.station.info.get("type"),
		songList: state.station.info.get("songList"),
		paused: state.station.info.get("paused"),
		ownerId: state.station.info.get("ownerId"),
		mode: state.station.info.get("mode"),
		privatePlaylistQueue: state.station.info.get("privatePlaylistQueue"),
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
	onModeUpdate: bindActionCreators(stationInfoActionCreators.modeUpdate, dispatch),
	onTimeElapsedUpdate: bindActionCreators(stationCurrentSongActionCreators.timeElapsedUpdate, dispatch),
	onPlaylistsUpdate: bindActionCreators(stationPlaylistsActionCreators.update, dispatch),
	onPlaylistsAddSong: bindActionCreators(stationPlaylistsActionCreators.addSong, dispatch),
	onPlaylistsUpdateDisplayName: bindActionCreators(stationPlaylistsActionCreators.updateDisplayName, dispatch),
	onPlaylistsMoveSongToBottom: bindActionCreators(stationPlaylistsActionCreators.moveSongToBottom, dispatch),
	onPlaylistsMoveSongToTop: bindActionCreators(stationPlaylistsActionCreators.moveSongToTop, dispatch),
	onPlaylistsRemoveSong: bindActionCreators(stationPlaylistsActionCreators.removeSong, dispatch),
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
			automaticallyAddedSongId: null,
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
						this.addTopToQueue(false);
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
					socket.on("event:playlist.addSong", data => {
						this.props.onPlaylistsAddSong(data.playlistId, data.song);
					});
					socket.on("event:playlist.updateDisplayName", data => {
						this.props.onPlaylistsUpdateDisplayName(data.playlistId, data.displayName);
					});
					socket.on("event:playlist.moveSongToBottom", data => {
						this.props.onPlaylistsMoveSongToBottom(data.playlistId, data.songId);
					});
					socket.on("event:playlist.moveSongToTop", data => {
						this.props.onPlaylistsMoveSongToTop(data.playlistId, data.songId);
					});
					socket.on("event:playlist.removeSong", data => {
						this.props.onPlaylistsRemoveSong(data.playlistId, data.songId);
					});
					socket.on("event:partyMode.updated", partyEnabled => {
						this.setState({
							...this.state,
							partyEnabled,
						});
						this.props.onModeUpdate(partyEnabled, this.state.queueLocked);
					});
					socket.on("event:queueLockToggled", queueLocked => {
						this.setState({
							...this.state,
							queueLocked,
						});
						this.props.onModeUpdate(this.state.partyEnabled, queueLocked);
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
	}

	componentWillUnmount() {
		clearInterval(this.state.timeElapsedInterval);
	}

	componentDidUpdate(prevProps) {
		if (this.props.station.privatePlaylistQueue !== prevProps.station.privatePlaylistQueue && !!this.props.station.privatePlaylistQueue) this.addTopToQueue(false);
	}

	addTopToQueue = (fromTimeout) => {
		console.log("ADDTOPTOQUEUE", fromTimeout);
		if (this.state.addSongTimeout && !fromTimeout) return console.log("RETURN!");
		const randomIdentifier = Math.floor(Math.random() * 10000000000);
		const automaticallyAddedSongId = this.state.automaticallyAddedSongId;
		const privatePlaylistQueue = this.props.station.privatePlaylistQueue;
		io.getSocket((socket) => {
			async.waterfall([
				(next) => {
					if (this.state.mode === "normal") return next("Mode invalid."); //
					if (!privatePlaylistQueue) return next("No playlist selected."); // There hasn't been any playlist that has been selected
					if (!automaticallyAddedSongId) return next(); // There hasn't been any song that automatically got added to the queue
					//if (this.props.song.exists && automaticallyAddedSongId === this.props.song.songId) return next("Previously automatically added song is still playing."); // The song that was previously automatically added is already currently playing
					let alreadyAdded = false;
					this.props.station.songList.forEach((song) => {
						if (automaticallyAddedSongId === song.get("songId")) alreadyAdded = true;
					});
					if (alreadyAdded) return next("Previously automatically added song is still in the queue."); // The song that was automatically added previously is already currently in the queue
					return next();
				},
				(next) => {
					const playlist = this.props.playlists.find((playlist) => {
						return privatePlaylistQueue === playlist.get("playlistId");
					});
					if (!playlist) return next("Selected playlist isn't found.");
					const song = playlist.get("songs").get(0);
					if (!song) return next("Top song couldn't be found.");
					if (song.get("duration") > 15 * 60) return next("BOTTOM", { songId: song.get("songId") });
					const songId = song.get("songId");
					this.setState({
						...this.state,
						automaticallyAddedSongId: songId,
					});
					socket.emit("stations.addToQueue", this.props.station.stationId, songId, data => {
						return next(null, data, songId);
					});
				},
				(data, songId, next) => {
					if (data.status !== "success") return next("Song couldn't be added to the queue.");
					this.moveToBottom(privatePlaylistQueue, songId, (data) => {
						return next(null, data);
					});
				},
				(data, next) => {
					if (data.status !== "success") return next("Song couldn't be moved to the bottom of the playlist.");
					return next();
				},
			], (err, res) => {
				if (err) console.log("ADDTOPTOQUEUE ERROR", randomIdentifier, err, res);
				else console.log("ADDTOPTOQUEUE SUCCESS", randomIdentifier);
 				if (err === "BOTTOM") {
					this.moveToBottom(privatePlaylistQueue, res.songId, (data) => {
						if (data.status === "success" && res.status !== "success") {
							this.setState({
								addSongTimeout: setTimeout(() => {
									this.setState({
										addSongTimeout: null,
									}, () => {
										this.addTopToQueue(true);
									});
								}, 2000),
							});
						}
					});
				}
			});
		});
	};

	moveToBottom = (playlistId, songId, cb) => {
		io.getSocket((socket) => {
			socket.emit("playlists.moveSongToBottom", playlistId, songId, data => {
				cb(data);
			});
		});
	}

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
					{
						(this.props.station.type === "community" && this.props.station.mode !== "normal")
						? <button onClick={ () => { this.props.openOverlay1("queueList") } }><i className="material-icons">queue_music</i></button>
						: null
					}
					{
						(this.props.station.type === "community")
						? <button onClick={ () => { this.props.openOverlay1("playlists") } }><i className="material-icons">library_music</i></button>
						: null
					}

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
