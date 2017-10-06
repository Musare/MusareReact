import React, { Component } from "react";
import { NavLink } from "react-router-dom";

import PropTypes from "prop-types";
import { translate, Trans } from "react-i18next";

import Player from "./Player";
import Seekerbar from "./Seekerbar";
import VolumeSlider from "./VolumeSlider";

import { changeVolume } from "actions/volume";
import { changeSong, setTimeElapsed, timePaused } from "actions/songPlayer";
import { pauseStation, resumeStation } from "actions/station";

import { connect } from "react-redux";

import io from "io";
import config from "config";
import {updateTimePaused} from "../../actions/songPlayer";

const Aux = (props) => {
	return props.children;
};

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
	songTitle: state.songPlayer.get("title"),
	songDuration: state.songPlayer.get("duration"),
	songTimeElapsed: state.songPlayer.get("timeElapsed"),
	songArtists: state.songPlayer.get("artists"),
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
				console.log(res);
				if (res.status === 'success') {
					if (res.data.currentSong) {
						res.data.currentSong.startedAt = res.data.startedAt;
						res.data.currentSong.timePaused = res.data.timePaused;
					}
					this.props.dispatch(changeSong(res.data.currentSong));
				}

				socket.on('event:songs.next', data => {
					if (data.currentSong) {
						data.currentSong.startedAt = res.data.startedAt;
						data.currentSong.timePaused = res.data.timePaused;
					}
					this.props.dispatch(changeSong(data.currentSong));
				});

				socket.on('event:stations.pause', pausedAt => {
					this.props.dispatch(pauseStation(pausedAt));
				});

				socket.on('event:stations.resume', data => {
					this.props.dispatch(updateTimePaused(data.timePaused));
					this.props.dispatch(resumeStation());
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

	render() {
		const { t } = this.props;

		//TODO Make this not re-render a lot

		return (
			<main id="station">
				<h1>{ this.props.station.displayName }</h1>

				{ (this.props.station.paused) ? <button onClick={ this.resumeStation }>Resume</button> : <button onClick={ this.pauseStation }>Pause</button>}

				<button onClick={ this.addSongTemp }>Add song to queue TEMP</button>

				<hr/>
				<div className={(!this.props.songExists) ? "hidden" : ""}>
					<Player onRef={ ref => (this.player = ref) }/>
				</div>

				{ (this.props.songExists) ? (
				[
					<div key="content">
						<h1>Title: { this.props.songTitle }</h1>
						<br/>
						Paused: { (this.props.station.paused) ? "true" : "false" }
						<br/>
						<span>Artists: { this.props.songArtists.join(", ") }</span>
						<span key="time">
							{ formatTime(this.props.songTimeElapsed) } - { formatTime(this.props.songDuration) }
						</span>
						<div key="seekerbar" className="seekerbar-container" style={{"width": "100%", "background-color": "yellow", "height": "20px", "display": "block"}}>
							<Seekerbar/>
						</div>
						<VolumeSlider key="volumeSlider"/>
					</div>,
				]) : (
					<h1>No song playing</h1>
				) }
			</main>
		);
	}
}
