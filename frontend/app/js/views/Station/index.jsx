import React, { Component } from "react";
import { NavLink } from "react-router-dom";

import PropTypes from "prop-types";
import { translate, Trans } from "react-i18next";

import Player from "./Player";
import Time from "./Time";
import Seekerbar from "./Seekerbar";
import VolumeSlider from "./VolumeSlider";

import { changeVolume } from "actions/volume";

import { connect } from "react-redux";

import io from "io";
import config from "config";

const Aux = (props) => {
	return props.children;
};

@connect(state => ({
	user: {
		userId: state.user.get("userId"),
		role: state.user.get("role"),
	},
	loggedIn: state.user.get("loggedIn"),
	volume: state.volume.get("volume"),
}))

@translate(["station"], { wait: true })
export default class Station extends Component {
	static propTypes = {
		t: PropTypes.func,
	};

	static defaultProps = {
		t: () => {},
	};

	constructor() {
		super();

		let temp = window.props;
		let stationName = temp.stationName;

		this.state = {
			station: temp.stationData,
			currentSongExists: false,
		};

		io.getSocket(socket => {
			socket.emit("stations.join", stationName, res => {
				console.log(res);
				if (res.status === 'success') {
					this.setState({
						station: { //TODO Refactor this to be better optimized
							_id: res.data._id,
							name: stationName,
							displayName: res.data.displayName,
							description: res.data.description,
							privacy: res.data.privacy,
							locked: res.data.locked,
							partyMode: res.data.partyMode,
							owner: res.data.owner,
							privatePlaylist: res.data.privatePlaylist,
							type: res.data.type,
							paused: res.data.paused,
						},
						currentSong: (res.data.currentSong) ? res.data.currentSong : {},
						currentSongExists: !!res.data.currentSong,
					});

					if (res.data.paused) this.player.pause(); //TODO Add async getPlayer here
					else this.player.resume();

					if (res.data.currentSong) {
						res.data.currentSong.startedAt = res.data.startedAt;
						res.data.currentSong.timePaused = res.data.timePaused;
					}
					this.changeSong(res.data.currentSong);
				}
			});
		});

		setInterval(() => {
			if (this.state.currentSongExists) {
				this.time.setTime(this.player.getTimeElapsed() / 1000);
				this.seekerbar.setTimeElapsed(this.player.getTimeElapsed() / 1000);
			}
		}, 1000);
	}

	changeSong = (newSongObject) => {
		let currentSongExists = !!newSongObject;
		let state = {
			currentSongExists,
			currentSong: newSongObject,
		};

		if (currentSongExists) {
			state.timeTotal = Time.formatTime(newSongObject.duration);
			state.simpleSong = (newSongObject.likes === -1 && newSongObject.dislikes === -1);
			if (state.simpleSong) {
				state.currentSong.skipDuration = 0;
				newSongObject.skipDuration = 0;// Do this better
			}

			this.seekerbar.setTime(newSongObject.duration);

			this.player.playSong(newSongObject.songId, newSongObject.skipDuration, newSongObject.timePaused, newSongObject.startedAt, () => {
				this.seekerbar.setTimeElapsed(this.player.getTimeElapsed() / 1000);
			});
		} else {
			this.player.clearSong();
		}

		this.setState(state, () => {
			this.getOwnRatings();
		});
	};

	getOwnRatings = () => {
		io.getSocket((socket) => {
			if (!this.state.currentSongExists) return;
			socket.emit('songs.getOwnSongRatings', this.state.currentSong.songId, (data) => {
				if (this.state.currentSong.songId === data.songId) {
					this.setState({
						currentSong: {
							...this.state.currentSong,
							liked: data.liked,
							disliked: data.disliked,
						},
					});
				}
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

	changeId = () => {
		this.player.playSong("jbZXYhjh3ms", 0, 0, Date.now());
	};

	addSongTemp = () => {
		io.getSocket(socket => {
			socket.emit('stations.addToQueue', this.state.station._id, '60ItHLz5WEA', data => {
				console.log("ATQ Res", data);
			});
		});
	};

	changeVolume = () => {
		this.props.dispatch(changeVolume(32))
	};

	render() {
		const { t } = this.props;

		//TODO Make this not re-render a lot

		return (
			<main id="station">
				<h1>{ this.state.station.displayName }</h1>


				<button onClick={ this.changeVolume }>Change volume</button>

				<button onClick={ this.changeId }>Change ID</button>
				<button onClick={ () => { this.player.pause() } }>Pause</button>
				<button onClick={ () => { this.player.resume() } }>Resume</button>

				<div className={(!this.state.currentSongExists) ? "hidden" : ""}>
					<Player onRef={ ref => (this.player = ref) }/>
				</div>

				{ (this.state.currentSongExists) ? (
				[
					<span key="title">{ this.state.currentSong.title }</span>,
					<br key="br1"/>,
					<span key="artists">{ this.state.currentSong.artists.join(", ") }</span>,
					<span key="time">
						<Time onRef={ ref => (this.time = ref) }/> - { Time.formatTime(this.state.currentSong.duration) }
					</span>,
					<div key="seekerbar" className="seekerbar-container" style={{"width": "100%", "background-color": "yellow", "height": "20px", "display": "block"}}>
						<Seekerbar onRef={ ref => (this.seekerbar = ref) }/>
					</div>,
				]) : (
					<h1>No song playing</h1>
				) }


				<VolumeSlider key="volumeSlider"/>,

				<button onClick={ this.addSongTemp }>Add song to queue TEMP</button>
			</main>
		);
	}
}
