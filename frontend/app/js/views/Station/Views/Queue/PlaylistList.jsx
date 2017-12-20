import React, { Component } from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";

import PlaylistItem from "./PlaylistItem.jsx";

@connect(state => ({
	station: {
		playlists: state.station.playlists,
	},
}))
export default class PlaylistList extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const { playlists } = this.props;

		return (
			<ul>
				{
					playlists.map((playlist) => {
						return <PlaylistItem key={ playlist.get("displayName") } playlist={ playlist }/>;
					})
				}
			</ul>
		);
	}
}
