import React, { Component } from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";

import io from "io";

@connect(state => ({
	user: {
		loggedIn: state.session.get("loggedIn"),
	},
	likes: state.station.currentSong.getIn(["ratings", "likes"]),
	dislikes: state.station.currentSong.getIn(["ratings", "dislikes"]),
	liked: state.station.currentSong.getIn(["ratings", "liked"]),
	disliked: state.station.currentSong.getIn(["ratings", "disliked"]),
	ratingsEnabled: state.station.currentSong.getIn(["ratings", "enabled"]),
	songId: state.station.currentSong.get("songId"),
}))
export default class Ratings extends Component {
	constructor(props) {
		super(props);
	}

	like = () => {
		io.getSocket(socket => {
			socket.emit("songs.like", this.props.songId, data => {/*TODO Handle error/success*/});
		});
	};

	dislike = () => {
		io.getSocket(socket => {
			socket.emit("songs.dislike", this.props.songId, data => {/*TODO Handle error/success*/});
		});
	};

	unlike = () => {
		io.getSocket(socket => {
			socket.emit("songs.unlike", this.props.songId, data => {/*TODO Handle error/success*/});
		});
	};

	undislike = () => {
		io.getSocket(socket => {
			socket.emit("songs.undislike", this.props.songId, data => {/*TODO Handle error/success*/});
		});
	};

	render() {
		if (!this.props.ratingsEnabled) return null;

		const likes = <span>{ this.props.likes }</span>;
		const dislikes = <span>{ this.props.dislikes }</span>;
		let likeButton = <i className="material-icons disabled">thumb_up</i>;
		let dislikeButton = <i className="material-icons disabled">thumb_down</i>;

		if (this.props.user.loggedIn) {
			if (this.props.liked) likeButton = <i className="material-icons liked" onClick={ this.unlike }>thumb_up</i>;
			else likeButton = <i className="material-icons" onClick={ this.like }>thumb_up</i>;

			if (this.props.disliked) dislikeButton = <i className="material-icons disliked" onClick={ this.undislike }>thumb_down</i>;
			else dislikeButton = <i className="material-icons" onClick={ this.dislike }>thumb_down</i>;
		}

		return (
			<div className="ratings-container">
				<div>
					{ likeButton }
					{ likes }
				</div>
				<div>
					{ dislikeButton }
					{ dislikes }
				</div>
			</div>
		);
	}
}
