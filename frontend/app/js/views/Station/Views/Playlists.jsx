import React, { Component } from "react";
import PropTypes from "prop-types";

import CustomInput from "components/CustomInput.jsx";
import CustomErrors from "components/CustomMessages.jsx";

import { connect } from "react-redux";

import { closeOverlay1, openOverlay2 } from "actions/stationOverlay";

import io from "io";

@connect(state => ({
	stationId: state.station.get("id"),
}))
export default class Playlists extends Component {
	constructor(props) {
		super(props);

		CustomInput.initialize(this);

		this.state = {
			playlists: [],
		};

		io.getSocket((socket) => {
			socket.emit('playlists.indexForUser', res => {
				res.data.push({
					displayName: "Playlist",
					_id: "RandomId",
				});
				console.log("Remove above dummy data.");
				if (res.status === 'success') this.setState({
					playlists: res.data,
				});
			});
		});
	}

	close = () => {
		this.props.dispatch(closeOverlay1());
	};

	render() {
		return (
			<div className="overlay">
				<button onClick={ this.close }>Back</button>
				<h1>Playlists</h1>
				<CustomErrors onRef={ ref => (this.messages = ref) } />

				<h2>Playlists</h2>
				<ul>
					{
						this.state.playlists.map((playlist) => {
							return <li key={ playlist._id }>{ playlist.displayName } - <span onClick={ () => { this.props.dispatch(openOverlay2("editPlaylist")) } }>Edit</span></li>;
						})
					}
				</ul>
			</div>
		);
	}
}
