import React, { Component } from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";

import SongItem from "./SongItem.jsx";

@connect(state => ({
	station: {
		songList: state.station.info.get("songList"),
	},
}))
export default class SongList extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const { songList } = this.props.station;

		return (
			<ul>
				{
					songList.map((song) => {
						return <SongItem key={ song.songId } song={ song }/>;
					})
				}
				{
					(songList.length === 0)
					? <li>No songs in queue.</li>
					: null
				}
			</ul>
		);
	}
}
