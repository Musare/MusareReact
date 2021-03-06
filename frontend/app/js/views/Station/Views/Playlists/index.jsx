import React, { Component } from "react";
import PropTypes from "prop-types";

import CustomInput from "components/CustomInput.jsx";
import CustomErrors from "components/CustomMessages.jsx";

import PlaylistList from "./PlaylistList.jsx";

import { connect } from "react-redux";

import { closeOverlay1, openOverlay2 } from "actions/stationOverlay";

import io from "io";

@connect(state => ({

}))
export default class Playlists extends Component {
	constructor(props) {
		super(props);

		CustomInput.initialize(this);
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
				<PlaylistList/>
			</div>
		);
	}
}
