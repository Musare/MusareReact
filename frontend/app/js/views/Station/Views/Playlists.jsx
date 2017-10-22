import React, { Component } from "react";
import PropTypes from "prop-types";

import CustomInput from "components/CustomInput.jsx";
import CustomErrors from "components/CustomMessages.jsx";

import { connect } from "react-redux";

import { closeOverlay1, openOverlay2 } from "actions/stationOverlay";

import io from "io";

@connect(state => ({
	user: {
		userId: state.user.get("userId"),
		role: state.user.get("role"),
	},
	loggedIn: state.user.get("loggedIn"),
	stationId: state.station.get("id"),
	stationOwner: state.station.get("ownerId"),
	partyEnabled: state.station.get("partyMode"),
	queueLocked: state.station.get("locked"),
	privatePlaylist: state.station.get("privatePlaylist"),
}))
export default class Playlists extends Component {
	constructor(props) {
		super(props);

		CustomInput.initialize(this);

		this.state = {
			playlists: [],
			mode: this.getModeTemp(props.partyEnabled, props.queueLocked),
		};

		io.getSocket((socket) => {
			socket.emit('playlists.indexForUser', res => {
				if (res.status === 'success') this.setState({
					playlists: res.data,
				});
			});
		});
	}

	close = () => {
		this.props.dispatch(closeOverlay1());
	};

	createPlaylist = () => {
		this.messages.clearErrorSuccess();
		if (CustomInput.hasInvalidInput(this.input, ["description"])) {
			this.messages.clearAddError(this.props.t("general:someFieldsAreIncorrectError"));
		} else {
			io.getSocket(socket => {
				socket.emit('playlists.create', { displayName: this.input.description.getValue(), songs: [] }, res => {
					if (res.status === "success") {
						this.props.dispatch(openOverlay2("editPlaylist", { playlistId: res.playlistId }));
					} else {
						this.messages.addError(res.message);
					}
				});
			});
		}
	};

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
	};

	getPlaylistAction = (playlistId) => {
		if (this.state.mode === "normal") {
			if (this.isOwner()) {
				const play = <span onClick={ () => { this.playPlaylist(playlistId) } }>PLAY!</span>;
				//const stop = <span onClick={ () => { this.stopPlaylist(playlistId) } }>STOP!</span>;
				const stop = null; // There's currently no backend functionality to stop a playlist from playing

				if (this.props.privatePlaylist === playlistId) return stop;
				else return play;
			}
		}

		return null;
	};

	isOwner = () => {
		if (this.props.loggedIn) {
			if (this.props.user.userId === this.props.stationOwner) return true;
		}

		return false;
	};

	playPlaylist = (playlistId) => {
		this.messages.clearErrorSuccess();
		io.getSocket((socket) => {
			socket.emit("stations.selectPrivatePlaylist", this.props.stationId, playlistId, (res) => {
				if (res.status === "success") {
					this.message.addSuccess("Successfully selected private playlist.");
				} else {
					this.messages.addError(res.message);
				}
			});
		});
	};

	/*stopPlaylist = (playlistId) => {
		this.messages.clearErrorSuccess();
		io.getSocket((socket) => {
			socket.emit("stations.selectPrivatePlaylist", this.props.stationId, playlistId, (res) => {
				if (res.status === "success") {
					this.message.addSuccess("Successfully selected private playlist.");
				} else {
					this.messages.addError(res.message);
				}
			});
		});
	};*/

	render() {
		return (
			<div className="overlay">
				<button onClick={ this.close }>Back</button>
				<h1>Playlists</h1>
				<CustomErrors onRef={ ref => (this.messages = ref) } />

				<CustomInput key="description" type="playlistDescription" name="description" label="Description" placeholder="Description" original={ this.props.description } onRef={ ref => (this.input.description = ref) } />
				<button onClick={ this.createPlaylist }>Create playlist</button>

				<h2>Playlists</h2>
				<ul>
					{
						this.state.playlists.map((playlist) => {
							return (
								<li key={ playlist._id }>
									{ playlist.displayName } - <span onClick={ () => { this.props.dispatch(openOverlay2("editPlaylist", { playlistId: playlist._id })) } }>Edit</span>
									{ this.getPlaylistAction(playlist._id) }
								</li>
							)
						})
					}
				</ul>
			</div>
		);
	}
}
