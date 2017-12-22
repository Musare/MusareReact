import React, { Component } from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";

import SongItem from "./SongItem.jsx";

export default class SongList extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const { callback, songs } = this.props;

		return (
			<ul>
				{
					songs.map((song) => {
						return (
							<SongItem key={ song.songId } song={ song } callback={ callback }/>
						);
					})
				}
			</ul>
		);
	}
}
