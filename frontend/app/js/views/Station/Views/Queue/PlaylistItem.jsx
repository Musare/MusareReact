import React, { Component } from "react";
import PropTypes from "prop-types";

import { actionCreators as stationInfoActionCreators } from "ducks/stationInfo";
import { bindActionCreators } from "redux";

import { connect } from "react-redux";

@connect(state => ({
	station: {
		playlistSelectedId: state.station.info.get("privatePlaylistQueue"),
	},
}),
(dispatch) => ({
	onSelectPlaylist: bindActionCreators(stationInfoActionCreators.selectPlaylistQueue, dispatch),
}))
export default class PlaylistItem extends Component {
	constructor(props) {
		super(props);
	}

	getPlaylistAction = (playlistId) => {
		if (playlistId === this.props.station.playlistSelectedId) {
			return <span>SELECTED</span>;
		} else return <span onClick={ () => { this.props.onSelectPlaylist(playlistId); } }>SELECT</span>;
	}

	render() {
		const { playlist } = this.props;

		return (
			<li style={{color: "black"}}>
				{ playlist.get("displayName") } - { this.getPlaylistAction(playlist.get("playlistId")) }
			</li>
		);
	}
}
