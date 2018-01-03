import React, { Component } from "react";
import PropTypes from "prop-types";

import { formatTime } from "utils";
import { fallbackImage } from "constants.js";

import { connect } from "react-redux";

import io from "io";

@connect(state => ({
	user: {
		loggedIn: state.session.get("loggedIn"),
		userId: state.session.get("userId"),
		role: state.session.get("role"),
	},
	station: {
		stationId: state.station.info.get("stationId"),
		owner: state.station.info.get("ownerId"),
	},
}))
export default class SongItem extends Component {
	constructor(props) {
		super(props);
	}

	deleteSong = (songId) => {
		io.getSocket((socket) => {
			socket.emit("stations.removeFromQueue", this.props.station.stationId, songId, (data) => {
				//if (data.status === "success") this.messages.clearAddSuccess("Successfully removed song.");
				//else this.messages.clearAddError("Failed to remove song.", data.message);
			});
		});
	};

	isOwner = () => {
		if (this.props.user.loggedIn) {
			if (this.props.user.role === "admin") return true;
			if (this.props.user.userId === this.props.station.owner) return true;
		}

		return false;
	};

	render() {
		const { song } = this.props;
		const showRequestedBy = (song.get("requestedByUsername") && song.get("requestedByUsername") !== "Unknown");
		const showDelete = (this.isOwner() && this.props.deleteable !== false);

		return (
			<li>
				<div className="left">
					<img src={ song.get("thumbnail") } onError={function(e) {e.target.src=fallbackImage}}/>
				</div>
				<div className="right">
					<span className="duration">{ formatTime(song.get("duration")) }</span>
					<p className="title">{ song.get("title") }</p>
					<span className="title-artists-spacing"/>
					<p className="artists">{ song.get("artists").join(", ") }</p>
					{
						(showRequestedBy) ?
						<span>
							<span>Requested by: </span>
							<a href={`/u/${ song.get("requestedByUsername") }`}>{ song.get("requestedByUsername") }</a>
						</span> : null
					}
					{
						(showDelete)
						? <i style={{ color: "black" }} onClick={ () => { this.deleteSong(song.get("songId")) } }>Delete</i>
						: null
					}
				</div>
			</li>
		);
	}
}
