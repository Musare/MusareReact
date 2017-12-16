import React, { Component } from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";

@connect(state => ({
	station: {
		playlistSelectedId: state.station.info.get("playlistSelected"),
	},
}))
export default class PlaylistItem extends Component {
	constructor(props) {
		super(props);
	}

	selectPlaylist = (playlistId) => {
		this.props.dispatch(selectPlaylist(playlistId));
	}

	getPlaylistAction = (playlistId) => {
		if (playlistId === this.props.station.playlistSelectedId) {
			return <span>SELECTED</span>;
		} else return <span onClick={ () => { this.selectPlaylist(playlistId); } }>SELECT</span>;
	}

	render() {
		const { playlist } = this.props;

		return (
			<li style={{color: "black"}}>
				{ playlist.get("displayName") } - { this.getPlaylistAction(playlist.get("_id")) }
			</li>
		);
	}
}
