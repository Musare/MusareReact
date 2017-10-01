import React, { Component } from "react";
import PropTypes from "prop-types";
const i18next = require("i18next");

const t = i18next.t;

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
			volume: 0,
		};
	}

	componentDidMount() {
		this.props.onRef(this);
		this.initializePlayer();
	}
	componentWillUnmount() {
		this.props.onRef(null);
	}

	playSong(songId, skipDuration, timePaused, startedAt) {
		if (this.state.player.ready) {
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

			this.player.loadVideoById(songId, this.getProperVideoTime());
		} else return; // CALLBACK
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
		if (this.state.player.paused) return;
		this.setState({
			player: {
				...this.state.player,
				paused: true,
				pausedAt: Date.now(),
			},
		});
		this.player.pauseVideo();
	}

	resume() {
		if (!this.state.player.paused) return;
		this.setState({
			player: {
				...this.state.player,
				paused: false,
			},
		});
		this.player.playVideo();
	}

	initializePlayerVolume() {
		let volume = parseInt(localStorage.getItem("volume"));
		volume = (typeof volume === "number") ? volume : 20;
		this.player.setVolume(this.state.volume);
		if (this.state.volume > 0) this.player.unMute();
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

					this.initializePlayerVolume();
				},
				"onError": function(err) {
					console.log("iframe error", err);
					// VOTE TO SKIP SONG
				},
				"onStateChange": (event) => {
					if (event.data === YT.PlayerState.PLAYING) {
						if (this.state.player.loading) this.setState({
							player: {
								...this.state.player,
								loading: false,
							},
						});
						if (this.state.player.paused) this.player.pauseVideo();
						if (this.state.player.paused || this.state.player.loading) this.player.seekTo(this.getProperVideoTime(), true);
					}

					if (event.data === YT.PlayerState.PAUSED) {
						if (!this.state.player.paused) {
							this.player.seekTo(this.getProperVideoTime(), true);
							this.player.playVideo();
						}
					}
				},
			},
		});
	}

	render() {
		return (
			<div id="player"/>
		);
	}
}
