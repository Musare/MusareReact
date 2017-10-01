import React, { Component } from "react";
import { NavLink } from "react-router-dom";

import PropTypes from "prop-types";
import { translate, Trans } from "react-i18next";

import Player from "./Player";

import { connect } from "react-redux";

import io from "io";
import config from "config";

@connect(state => ({
	user: {
		userId: state.user.get("userId"),
		role: state.user.get("role"),
	},
	loggedIn: state.user.get("loggedIn"),
}))

@translate(["station"], { wait: true })
export default class Station extends Component {
	static propTypes = {
		t: PropTypes.func,
	};

	static defaultProps = {
		t: () => {},
	};

	constructor() {
		super();

		this.state = {

		};

		io.getSocket(socket => {

		});
	}

	isOwner = (ownerId) => {
		if (this.props.loggedIn) {
			if (this.props.user.role === "admin") return true;
			if (this.props.user.userId === ownerId) return true;
		}

		return false;
	};

	changeId = () => {
		this.player.playSong("jbZXYhjh3ms", 0, 0, Date.now());
	};

	render() {
		const { t } = this.props;

		//TODO Make this not re-render a lot

		return (
			<main id="station">
				<h1>{ t("home:title") }</h1>

				<button onClick={ this.changeId }>Change ID</button>
				<button onClick={ () => { this.player.pause() } }>Pause</button>
				<button onClick={ () => { this.player.resume() } }>Resume</button>

				<Player onRef={ ref => (this.player = ref) }/>
			</main>
		);
	}
}
