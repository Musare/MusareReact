import React, { Component } from "react";
import PropTypes from "prop-types";

import CustomInput from "components/CustomInput.jsx";
import CustomErrors from "components/CustomMessages.jsx";

import { connect } from "react-redux";

import { closeOverlay1, openOverlay2 } from "actions/stationOverlay";

import io from "io";
import {closeOverlay2} from "../../../actions/stationOverlay";

@connect(state => ({
	user: {
		userId: state.user.get("userId"),
		role: state.user.get("role"),
	},
	loggedIn: state.user.get("loggedIn"),
	stationId: state.station.get("id"),
	stationOwner: state.station.get("ownerId"),
	songTitle: state.songPlayer.get("title"),
	songArtists: state.songPlayer.get("artists"),
	songDuration: state.songPlayer.get("duration"),
	simpleSong: state.songPlayer.get("simple"),
	songExists: state.songPlayer.get("exists"),
}))
export default class Settings extends Component {
	constructor(props) {
		super(props);

		this.state = {
			queue: [],
			userIdMap: {},
			userIdMapLoading: [],
		};

		io.getSocket((socket) => {
			socket.emit('stations.getQueue', this.props.stationId, data => {
				if (data.status === 'success') {
					this.setState({
						queue: data.queue,
					});
					data.queue.forEach((song) => {
						this.checkUserId(song.requestedBy);
					});
				}
			});

			socket.on('event:queue.update', queue => {
				this.setState({
					queue,
				});
				queue.forEach((song) => {
					this.checkUserId(song.requestedBy);
				});
			});
		});
	}

	isOwner = () => {
		if (this.props.loggedIn) {
			if (this.props.user.role === "admin") return true;
			if (this.props.user.userId === this.props.stationOwner) return true;
		}

		return false;
	};

	deleteSong = (songId) => {
		io.getSocket((socket) => {
			socket.emit("stations.removeFromQueue", this.props.stationId, songId, (data) => {
				if (data.status === "success") this.messages.clearAddSuccess("Successfully removed song.");
				else this.messages.clearAddError("Failed to remove song.", data.message);
			});
		});
	};

	checkUserId = (userId) => {
		if (!this.state.userIdMap[`Z${ userId }`] && !this.state.userIdMapLoading[`Z${ userId }`]) {
			this.setState({
				userIdMapLoading: this.state.userIdMapLoading.concat([`Z${ userId }`]),
			});
			io.getSocket((socket) => {
				socket.emit("users.getUsernameFromId", userId, (data) => {
					if (data.status === "success") {
						this.setState({
							userIdMap: {
								[`Z${ userId }`]: data.data,
							},
						});
					}
				});
			});
		}
	};

	addSongToQueueCallback = (songId) => {
		io.getSocket((socket) => {
			// Add song to queue
			socket.emit("stations.addToQueue", this.props.stationId, songId, res => {
				if (res.status === "success") {
					this.messages.clearAddSuccess("Successfully added song.");
				} else {
					this.messages.addError(res.message);
				}
				this.props.dispatch(closeOverlay2());
			});
		});
	};

	addSongToQueue = () => {
		this.props.dispatch(openOverlay2("searchYouTube", null, this.addSongToQueueCallback));
	};

	close = () => {
		this.props.dispatch(closeOverlay1());
	};

	render() {
		console.log(this.isOwner());

		return (
			<div className="overlay">
				<button onClick={ this.close }>Back</button>
				<h1>Queue</h1>
				<CustomErrors onRef={ ref => (this.messages = ref) } />

				{
					(this.state.queue)
					? (
						<ul>
							{
								(this.props.songExists)
								? (
									<li>
										<p>{ this.props.songTitle }</p>
										<p>{ this.props.songDuration }</p>
										<hr/>
									</li>
								) : null
							}
							{
								this.state.queue.map((song) => {
									return (
										<li key={ song.songId }>
											<p>{ song.title }</p>
											<p>{ song.duration }</p>
											<a href={ `/u/${ this.state.userIdMap[`Z${ song.requestedBy }`] }` }>{ this.state.userIdMap[`Z${ song.requestedBy }`] }</a>
											<p onClick={ () => { this.deleteSong(song.songId) } }>Delete</p>
											<hr/>
										</li>
									);
								})
							}
						</ul>
					)
					: null
				}

				<button onClick={ this.addSongToQueue }>Add song to queue</button>

				<button onClick={ () => {io.getSocket((socket) => {socket.emit("stations.addToQueue", this.props.stationId, "A1PAO3jgmXY", (data) => {console.log(data);});});} }>Add temp</button>
				<button onClick={ () => {io.getSocket((socket) => {socket.emit('stations.updatePartyMode', this.props.stationId, true, res => {console.log(res);});})}}>Enable party</button>
			</div>
		);
	}
}
