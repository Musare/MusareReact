import React, { Component } from "react";
import PropTypes from "prop-types";
const i18next = require("i18next");

import { connect } from "react-redux";

import { pauseStation, unpauseStation } from "actions/station";

const t = i18next.t;
let getPlayerCallbacks = [];

@connect(state => ({
	volume: state.volume.get("loudness"),
	muted: state.volume.get("muted"),
	songId: state.station.currentSong.get("songId"),
	startedAt: state.station.currentSong.getIn(["timings", "startedAt"]),
	timePaused: state.station.currentSong.getIn(["timings", "timePaused"]),
	skipDuration: state.station.currentSong.getIn(["timings", "skipDuration"]),
	pausedAt: state.station.currentSong.getIn(["timings", "pausedAt"]),
	exists: state.station.currentSong.get("songId") !== "",
	paused: state.station.info.get("paused"),
}))
export default class Player extends Component {
	static propTypes = {
		onRef: PropTypes.func,
	};

	static defaultProps = {
		onRef: () => {},
	};

	constructor(props) {
		super(props);

		this.state = {
			player: {
				initializing: false,
				ready: false,
				loading: false,
			},
		};

		if (props.paused) this.pause();
	}

	componentDidMount() {
		this.props.onRef(this);
		this.setState({
			seekerbar: this.seekerbar,
		});
		this.initializePlayer();
	}
	componentWillUnmount() {
		this.props.onRef(null);
	}

	clearSong() {
		this.getPlayer((player) => {
			player.loadVideoById("");
		});
	}

	playSong() {
		this.getPlayer((player) => {
			this.setState({
				player: {
					...this.state.player,
					loading: true,
				},
			});

			player.loadVideoById(this.props.songId, this.getProperVideoTime());
		});
	}

	getProperVideoTime = () => {
		if (this.props.exists) {
			return this.getTimeElapsed() / 1000 + this.props.skipDuration;
		} else return 0;
	};

	getTimeElapsed = () => {
		if (this.props.exists) {
			// TODO Replace with Date.currently
			let timePausedNow = 0;
			if (this.props.paused) timePausedNow = Date.now() - this.props.pausedAt;
			return Date.now() - this.props.startedAt - this.props.timePaused - timePausedNow;
		} else return 0;
	};

	pause() {
		this.getPlayer((player) => {
			player.pauseVideo();
		});
	}

	resume() {
		this.getPlayer((player) => {
			player.playVideo();
		});
	}

	mute() {
		this.getPlayer((player) => {
			player.mute();
		});
	}

	unmute() {
		this.getPlayer((player) => {
			player.unMute();
		});
	}

	initializePlayer = (force) => {
		if ((this.state.player.ready || this.state.player.initializing) && !force) return;
		if (!force) {
			this.setState({
				player: {
					...this.state.player,
					initializing: true,
				},
			});
		}
		if (!YT.Player) {
			setTimeout(() => {
				this.initializePlayer(true);
			}, 100);
		} else {
			this.player = new YT.Player("player", {
				height: 270,
				width: 480,
				videoId: "",
				playerVars: {controls: 0, iv_load_policy: 3, rel: 0, showinfo: 0},
				events: {
					"onReady": () => {
						this.setState({
							player: {
								...this.state.player,
								initializing: false,
								ready: true,
							},
						});

						getPlayerCallbacks.forEach((cb) => {
							cb(this.player);
						});

						this.player.setVolume(this.props.volume);
						if (this.props.muted) this.mute();
						else this.unmute();
					},
					"onError": function (err) {
						console.log("iframe error", err);
						// VOTE TO SKIP SONG
					},
					"onStateChange": (event) => {
						this.getPlayer((player) => {
							if (event.data === YT.PlayerState.PLAYING) {
								if (this.state.player.loading) this.setState({
									player: {
										...this.state.player,
										loading: false,
									},
								});
								if (this.props.paused) player.pauseVideo();
								if (this.props.paused || this.state.player.loading) player.seekTo(this.getProperVideoTime(), true);
							}

							if (event.data === YT.PlayerState.PAUSED) {
								if (!this.props.paused) {
									player.seekTo(this.getProperVideoTime(), true);
									player.playVideo();
								}
							}
						});
					},
				},
			});
		}
	};

	getPlayer(cb) {
		if (!this.state.player.ready) getPlayerCallbacks.push(cb);
		else cb(this.player);
	};

	componentWillUpdate(nextProps) {
		if (nextProps.volume !== this.props.volume) {
			this.getPlayer((player) => {
				player.setVolume(nextProps.volume);
			});
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.songId !== prevProps.songId && this.props.startedAt !== prevProps.startedAt) { //Add unique token instead of comparing startedAt
			if (this.props.exists) {
				this.playSong();
			} else this.clearSong();
		}

		if (this.props.paused !== prevProps.paused) { //Add unique token instead of comparing startedAt
			if (this.props.paused) this.pause();
			else this.resume();
		}

		if (this.props.muted !== prevProps.muted) {
			if (this.props.muted) this.mute();
			else this.unmute();
		}
	}

	render() {
		return (
			<div id="player"/>
		);
	}
}
