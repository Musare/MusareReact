import React, { Component } from "react";
import PropTypes from "prop-types";
import { Map } from "immutable";

import { connect } from "react-redux";

import SongItem from "./SongItem.jsx";

@connect(state => ({
	station: {
		songList: state.station.info.get("songList"),
	},
	currentSong: {
		exists: state.station.currentSong.get("songId") !== "",
		songId: state.station.currentSong.get("songId"),
		thumbnail: state.station.currentSong.get("thumbnail"),
		duration: state.station.currentSong.getIn(["timings", "duration"]),
		title: state.station.currentSong.get("title"),
		artists: state.station.currentSong.get("artists"),
	},
}))
export default class SongList extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const { songList } = this.props.station;

		const currentSong = (this.props.currentSong.exists) ? Map({
			thumbnail: this.props.currentSong.thumbnail,
			duration: this.props.currentSong.duration,
			title: this.props.currentSong.title,
			artists: this.props.currentSong.artists,
		}) : null;

		return (
			<ul>
				{
					(this.props.currentSong.exists) ? <SongItem key={ this.props.currentSong.songId } song={ currentSong } deleteable={ false }/> : null
				}
				{
					songList.map((song) => {
						return <SongItem key={ song.get("songId") } song={ song }/>;
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
