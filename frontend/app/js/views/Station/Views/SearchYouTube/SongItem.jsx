import React, { Component } from "react";
import PropTypes from "prop-types";

import { formatTime } from "utils";
import { fallbackImage } from "constants.js";

import { connect } from "react-redux";

export default class SongItem extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const { song, callback } = this.props;

		return (
			<li>
				<img src={ song.thumbnail } onError={function(e) {e.target.src=fallbackImage}}/>
				<a href={ song.url } target="_blank">{ song.title }</a>
				<div>
					{ /*<span className="duration">{ formatTime(song.duration) }</span>*/ }
					<span onClick={ () => { callback(song.songId); } } className="add" tabIndex="0"><i className="material-icons">add</i></span>
				</div>
			</li>
		);
	}
}
