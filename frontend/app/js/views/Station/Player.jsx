import React, { Component } from "react";
import PropTypes from "prop-types";
const i18next = require("i18next");

import { connect } from "react-redux";

const t = i18next.t;
let getPlayerCallbacks = [];

@connect(state => ({
	volume: state.volume.get("volume"),
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
				paused: true,
				pausedAt: null, // Find better spot for this one
			},
		};
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

	playSong(songId, skipDuration, timePaused, startedAt, cb) {
		this.getPlayer((player) => {
			let pausedAt = (this.state.player.paused) ? Date.now() : null;
			this.setState({
				song: {
					songId,
					skipDuration,
					timePaused,
					startedAt,
				},
				player: {
					...this.state.player,
					pausedAt,
					loading: true,
				},
			});

			player.loadVideoById(songId, this.getProperVideoTime());
			cb();
		});
	}

	getProperVideoTime = () => {
		if (this.state.song) {
			return this.getTimeElapsed() / 1000 + this.state.song.skipDuration;
		} else return 0;
	};

	getTimeElapsed = () => {
		if (this.state.song) {
			// TODO Replace with Date.currently
			let timePausedNow = 0;
			if (this.state.player.paused) timePausedNow = Date.now() - this.state.player.pausedAt;
			return Date.now() - this.state.song.startedAt - this.state.song.timePaused - timePausedNow;
		} else return 0;
	};

	pause() {
		this.getPlayer((player) => {
			if (this.state.player.paused) return;
			this.setState({
				player: {
					...this.state.player,
					paused: true,
					pausedAt: Date.now(),
				},
			});
			player.pauseVideo();
		});
	}

	resume() {
		this.getPlayer((player) => {
			if (!this.state.player.paused) return;
			this.setState({
				player: {
					...this.state.player,
					paused: false,
				},
			});
			player.playVideo();
		});
	}

	initializePlayer = () => {
		// TODO Ensure YT.Player exists
		if (this.state.player.ready || this.state.player.initializing) return;
		this.setState({
			player: {
				...this.state.player,
				initializing: true,
			},
		});
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
							test: 1,
						},
					});

					getPlayerCallbacks.forEach((cb) => {
						cb(this.player);
					});

					this.player.setVolume(this.props.volume);
				},
				"onError": function(err) {
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
							if (this.state.player.paused) player.pauseVideo();
							if (this.state.player.paused || this.state.player.loading) player.seekTo(this.getProperVideoTime(), true);
						}

						if (event.data === YT.PlayerState.PAUSED) {
							if (!this.state.player.paused) {
								player.seekTo(this.getProperVideoTime(), true);
								player.playVideo();
							}
						}
					});
				},
			},
		});
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

	render() {
		return (
			<div id="player"/>
		);
	}
}
