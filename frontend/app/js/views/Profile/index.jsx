import React, {Component} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import { Redirect } from "react-router-dom";
import {translate} from "react-i18next";

import { fallbackImage } from "constants.js";

import CustomMessages from "components/CustomMessages.jsx";

import io from "io";

@connect(state => ({
	user: {
		userId: state.session.get("userId"),
		role: state.session.get("role"),
	},
}))

@translate(["profile"], {wait: true})
export default class Profile extends Component {
	static propTypes = {
		user: PropTypes.object,
		t: PropTypes.func,
	};

	static defaultProps = {
		user: {
			userId: "",
			role: "default",
		},
		t: () => {
		},
	};

	constructor(props) {
		super(props);

		const prettyRole = {
			default: "Default",
			admin: "Admin",
		};

		this.state = {
			user: {},
			loaded: false,
			notFound: true,
		};

		io.getSocket(socket => {
			socket.emit("users.findByUsername", this.props.props.computedMatch.params.username, res => {
				if (res.status === "success") {
					const user = this.state.user;
					user.username = res.data.username;
					user.image = "/assets/images/notes.png";
					user.joinDatePretty = moment(res.data.createdAt).format("LL");
					user.likes = res.data.liked.length;
					user.dislikes = res.data.disliked.length;
					user.songsRequested = res.data.statistics.songsRequested;
					user.rolePretty = prettyRole[res.data.role];
					user.role = res.data.role;
					user.userId = res.data._id;
					document.title = user.username + " - Musare"; // TODO Improve title system
					this.setState({ user, loaded: true, notFound: false });
				} else {
					this.setState({ loaded: true, notFound: true });
				}
			});
		});
	}

	promoteDemoteButton = () => {
		if (this.state.loaded === false) return null;
		if (this.props.user.role !== "admin") return null;

		const demoteButton = <button onClick={ this.demoteToDefault }>{ this.props.t("profile:demoteToDefault") }</button>;
		const promoteButton = <button onClick={ this.promoteToAdmin }>{ this.props.t("profile:promoteToAdmin") }</button>;

		return (this.state.user.role === "admin") ? demoteButton : promoteButton;
	};

	promoteDemote = (role) => {
		this.messages.clearErrorSuccess();
		io.getSocket(socket => {
			socket.emit("users.updateRole", this.state.user.userId, role, res => {
				if (res.status === "success") {
					this.messages.clearAddSuccess(this.props.t("profile:failedToChangeRank"));// TODO Fix
				} else {
					this.messages.addError(res.message);
				}
			});
		});
	};

	promoteToAdmin = () => {
		this.promoteDemote("admin");
	};

	demoteToDefault = () => {
		this.promoteDemote("default");
	};

	render() {
		const { t } = this.props;
		const {user, loaded, notFound} = this.state;

		return (loaded)
		? (
			(notFound)
			? <Redirect to={"/404"}/>
			: (
				<main id="profile">
					<h1>{user.username}</h1>
					<CustomMessages onRef={ref => (this.messages = ref)}/>
					<img
						src={ user.image } onError={function(e) {e.target.src=fallbackImage}}/>
					<p>{ t("profile:aMemberSince") } {user.joinDatePretty}</p>
					<div className="profile-details-list">
						<span>
							<b>{ t("profile:likedSongs") }:</b>
							<span>{ user.likes }</span>
						</span>
						<span>
							<b>{ t("profile:dislikedSongs") }</b>
							<span>{ user.dislikes }</span>
						</span>
						<span>
							<b>{ t("profile:songsRequested") }</b>
							<span>{ user.songsRequested }</span>
						</span>
						<span>
							<b>{ t("profile:rank") }</b>
							<span>{ user.rolePretty }</span>
						</span>
					</div>
					{ this.promoteDemoteButton() }
				</main>
			)
		)
		: <h1>Loading...</h1>;
	}
}
