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
	station: {
		stationId: state.station.get("id"),
		name: state.station.get("name"),
		displayName: state.station.get("displayName"),
		paused: state.station.get("paused"),
		pausedAt: state.station.get("pausedAt"),
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

	getOwnRatings = () => {
		io.getSocket((socket) => {
			if (!this.props.songExists) return;
			socket.emit('songs.getOwnSongRatings', this.props.songId, (data) => {
				if (this.props.songId === data.songId) this.props.dispatch(receivedOwnRatings(data.liked, data.disliked));
			});
		});
	};

	isOwner = (ownerId) => {
		if (this.props.loggedIn) {
			if (this.props.user.role === "admin") return true;
			if (this.props.user.userId === ownerId) return true;
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

		return <div>
			{ likeButton }
			{ likes }
			{ dislikeButton }
			{ dislikes }
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

	skip = () => {
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

				<button onClick={ () => { this.props.dispatch(openOverlay1("settings")) } }>Open settings</button>

				<h1>{ this.props.station.displayName }</h1>

				{ (this.props.station.paused) ? <button onClick={ this.resumeStation }>Resume</button> : <button onClick={ this.pauseStation }>Pause</button>}

				<button onClick={ this.addSongTemp }>Add song to queue TEMP</button>
				<button onClick={ this.skip }>Skip</button>

				<hr/>
				<div className={(!this.props.songExists) ? "hidden" : ""}>
					<Player onRef={ ref => (this.player = ref) }/>
					{ (this.props.station.paused) ? <div><span>Paused</span><i className="material-icons">pause</i></div> : null }
				</div>

				{ (this.props.songExists) ? (
				[
					<div key="content">
						<h1>Title: { this.props.songTitle }</h1>
						<br/>
						<span>Artists: { this.props.songArtists.join(", ") }</span>
						<br/>
						<span key="time">
							{ formatTime(this.props.songTimeElapsed) } - { formatTime(this.props.songDuration) }
						</span>
						<div key="seekerbar" className="seekerbar-container" style={{"width": "100%", "background-color": "yellow", "height": "20px", "display": "block"}}>
							<Seekerbar/>
						</div>
						{
							(!this.props.simpleSong) ? this.getRatings() : null
						}
						<VolumeSlider key="volumeSlider"/>
					</div>,
				]) : (
					<h1>No song playing</h1>
				) }
			</main>
		);
	}
}
