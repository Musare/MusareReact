import React, { Component } from "react";
import { NavLink } from "react-router-dom";

import PropTypes from "prop-types";
import { translate, Trans } from "react-i18next";

import Player from "./Player";
import Seekerbar from "./Seekerbar";
import VolumeSlider from "./VolumeSlider";
import Overlays from "./Views/Overlays";

import { changeVolume } from "actions/volume";
import { changeSong, setTimeElapsed, timePaused, receivedRatings, receivedOwnRatings } from "actions/songPlayer";
import { pauseStation, resumeStation } from "actions/station";
import { openOverlay1 } from "actions/stationOverlay";
import { addSong } from "actions/playlistQueue";

import { connect } from "react-redux";

import io from "io";
import config from "config";
import {updateTimePaused} from "../../actions/songPlayer";

const formatTime = (duration) => {
	let d = moment.duration(duration, "seconds");
	if (duration < 0) return "0:00";
	return ((d.hours() > 0) ? (d.hours() < 10 ? ("0" + d.hours() + ":") : (d.hours() + ":")) : "") + (d.minutes() + ":") + (d.seconds() < 10 ? ("0" + d.seconds()) : d.seconds());
};

@connect(state => ({
	user: {
		userId: state.user.get("userId"),
		role: state.user.get("role"),
	},
	loggedIn: state.user.get("loggedIn"),
	songId: state.songPlayer.get("songId"),
	songTitle: state.songPlayer.get("title"),
	songDuration: state.songPlayer.get("duration"),
	songTimeElapsed: state.songPlayer.get("timeElapsed"),
	songArtists: state.songPlayer.get("artists"),
	songLikes: state.songPlayer.get("likes"),
	songLiked: state.songPlayer.get("liked"),
	songDislikes: state.songPlayer.get("dislikes"),
	songDisliked: state.songPlayer.get("disliked"),
	simpleSong: state.songPlayer.get("simple"),
	songExists: state.songPlayer.get("exists"),
	queueLocked: state.station.get("locked"),
	partyEnabled: state.station.get("partyMode"),
	station: {
		stationId: state.station.get("id"),
		name: state.station.get("name"),
		displayName: state.station.get("displayName"),
		paused: state.station.get("paused"),
		pausedAt: state.station.get("pausedAt"),
		ownerId: state.station.get("ownerId"),
	},
	selectedPlaylistObject: {
		addedSongId: state.playlistQueue.get("addedSongId"),
		selectedPlaylistId: state.playlistQueue.get("playlistSelected"),
	},
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
			mode: this.getModeTemp(props.partyEnabled, props.queueLocked),
		};

		io.getSocket(socket => {
			socket.emit("stations.join", props.station.name, res => {
				if (res.status === 'success') {
					if (res.data.currentSong) {
						res.data.currentSong.startedAt = res.data.startedAt;
						res.data.currentSong.timePaused = res.data.timePaused;
					}

					this.props.dispatch(changeSong(res.data.currentSong));
					this.getOwnRatings();
				}

				socket.on('event:songs.next', data => {
					this.addTopToQueue();
					if (data.currentSong) {
						data.currentSong.startedAt = data.startedAt;
						data.currentSong.timePaused = data.timePaused;
					}
					this.props.dispatch(changeSong(data.currentSong));
					this.getOwnRatings();
				});

				socket.on('event:stations.pause', pausedAt => {
					this.props.dispatch(pauseStation(pausedAt));
				});

				socket.on('event:stations.resume', data => {
					this.props.dispatch(updateTimePaused(data.timePaused));
					this.props.dispatch(resumeStation());
				});

				socket.on('event:song.like', data => {
					console.log("LIKE");
					if (this.props.songExists) {
						if (data.songId === this.props.songId) {
							this.props.dispatch(receivedRatings(data.likes, data.dislikes));
						}
					}
				});
				socket.on('event:song.dislike', data => {
					console.log("DISLIKE");
					if (this.props.songExists) {
						if (data.songId === this.props.songId) {
							this.props.dispatch(receivedRatings(data.likes, data.dislikes));
						}
					}
				});
				socket.on('event:song.unlike', data => {
					console.log("UNLIKE");
					if (this.props.songExists) {
						if (data.songId === this.props.songId) {
							this.props.dispatch(receivedRatings(data.likes, data.dislikes));
						}
					}
				});
				socket.on('event:song.undislike', data => {
					console.log("UNDISLIKE");
					if (this.props.songExists) {
						if (data.songId === this.props.songId) {
							this.props.dispatch(receivedRatings(data.likes, data.dislikes));
						}
					}
				});
				socket.on('event:song.newRatings', data => {
					if (this.props.songExists) {
						if (data.songId === this.props.songId) {
							this.props.dispatch(receivedOwnRatings(data.liked, data.disliked));
						}
					}
				});
			});
		});

		setInterval(() => {
			if (this.props.songExists) {
				this.props.dispatch(setTimeElapsed(this.props.station.paused, this.props.station.pausedAt)); // TODO Fix
			}
		}, 1000);
	}

	isInQueue = (songId, cb) => {
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
	};

	checkIfCanAdd = (cb) => {
		if (this.state.mode === "normal") return cb(false);
		let playlistId = this.props.selectedPlaylistObject.selectedPlaylistId;
		let songId = this.props.selectedPlaylistObject.addedSongId;
		console.log(playlistId, songId, this.props.songId);
		if (playlistId) {
			if (songId === this.props.songId) return cb(true);
			else if (songId === null) return cb(true);
			else {
				this.isInQueue(songId, (res) => {
					return cb(res);
				});
			}
		}
	}

	addTopToQueue = () => {
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
	};

	moveToBottom = (playlistId, songId, cb) => {
		io.getSocket((socket) => {
			socket.emit('playlists.moveSongToBottom', playlistId, songId, data => {
				cb(data);
			});
		});
	}

	getModeTemp = (partyEnabled, queueLocked) => {
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
	}

	getOwnRatings = () => {
		io.getSocket((socket) => {
			if (!this.props.songExists) return;
			socket.emit('songs.getOwnSongRatings', this.props.songId, (data) => {
				if (this.props.songId === data.songId) this.props.dispatch(receivedOwnRatings(data.liked, data.disliked));
			});
		});
	};

	isOwner = () => {
		if (this.props.loggedIn) {
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
			socket.emit('stations.resume', this.props.station.stationId, data => {

			});
		});
	};

	pauseStation = () => {
		io.getSocket(socket => {
			socket.emit('stations.pause', this.props.station.stationId, data => {

			});
		});
	};

	getRatings = () => {
		const likes = <span>{ this.props.songLikes }</span>;
		const dislikes = <span>{ this.props.songDislikes }</span>;
		let likeButton = <i className="material-icons disabled">thumb_up</i>;
		let dislikeButton = <i className="material-icons disabled">thumb_down</i>;

		if (this.props.loggedIn) {
			if (this.props.songLiked) likeButton = <i className="material-icons liked" onClick={ this.unlike }>thumb_up</i>;
			else likeButton = <i className="material-icons" onClick={ this.like }>thumb_up</i>;

			if (this.props.songDisliked) dislikeButton = <i className="material-icons disliked" onClick={ this.undislike }>thumb_down</i>;
			else dislikeButton = <i className="material-icons" onClick={ this.dislike }>thumb_down</i>;
		}

		return <div className="ratings-container">
			<div>
				{ likeButton }
				{ likes }
			</div>
			<div>
				{ dislikeButton }
				{ dislikes }
			</div>
		</div>;
	};

	like = () => {
		io.getSocket(socket => {
			socket.emit('songs.like', this.props.songId, data => {});
		});
	};

	dislike = () => {
		io.getSocket(socket => {
			socket.emit('songs.dislike', this.props.songId, data => {});
		});
	};

	unlike = () => {
		io.getSocket(socket => {
			socket.emit('songs.unlike', this.props.songId, data => {});
		});
	};

	undislike = () => {
		io.getSocket(socket => {
			socket.emit('songs.undislike', this.props.songId, data => {});
		});
	};

	skipStation = () => {
		io.getSocket(socket => {
			socket.emit('stations.forceSkip', this.props.station.stationId, data => {});
		});
	}

	render() {
		const { t } = this.props;

		//TODO Make this not re-render a lot

		return (
			<main id="station">
				<Overlays t={ this.props.t } />

				<div id="sidebar">
					<button onClick={ () => { this.props.dispatch(openOverlay1("users")) } }><i className="material-icons">people</i></button>
					<button onClick={ () => { this.props.dispatch(openOverlay1("queueList")) } }><i className="material-icons">queue_music</i></button>
					<button onClick={ () => { this.props.dispatch(openOverlay1("playlists")) } }><i className="material-icons">library_music</i></button>
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
						? <button onClick={ () => { this.props.dispatch(openOverlay1("settings")) } }><i className="material-icons">settings</i></button>
						: null
					}
				</div>

				<h1>{ this.props.station.displayName }</h1>

				<div className={(!this.props.songExists) ? "player-container hidden" : "player-container"}>
					<div className="iframe-container">
						<Player onRef={ ref => (this.player = ref) }/>
						{ (this.props.station.paused) ? <div className="paused-overlay"><span>Paused</span><i className="material-icons">pause</i></div> : null }
					</div>
					<Seekerbar/>
				</div>

				{ (this.props.songExists) ? (
				[
					<div key="content" className="content">
						<span className="title">{ this.props.songTitle }</span>
						<span className="artists">{ this.props.songArtists.join(", ") }</span>
						<span className="time">
							{ formatTime(this.props.songTimeElapsed) } / { formatTime(this.props.songDuration) }
						</span>
						<VolumeSlider/>
						{
							(!this.props.simpleSong) ? this.getRatings() : null
						}
					</div>,
				]) : (
					<h1>No song playing</h1>
				) }
			</main>
		);
	}
}
