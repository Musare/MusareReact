import React, { Component } from "react";

import { fallbackImage } from "constants.js";

import { connect } from "react-redux";
import { translate } from "react-i18next";

@connect(state => ({
	user: {
		loggedIn: state.session.get("loggedIn"),
		userId: state.session.get("userId"),
		role: state.session.get("role"),
	},
}))
@translate(["home"], { wait: true })
export default class StationCard extends Component {
	isOwner = () => {
		if (this.props.user.loggedIn) {
			if (this.props.user.role === "admin") return true;
			if (this.props.user.userId === this.props.station.get("stationOwner")) return true;
		}

		return false;
	};

	render() {
		const { station } = this.props;
		let icon = null;
		if (station.get("type") === "official") {
			if (station.get("privacy") !== "public") icon =
				<i className="material-icons" title={ this.props.t("home:thisStationIsNotVisible") }>lock</i>;
		} else {
			if (this.isOwner()) icon =
				<i className="material-icons" title={ this.props.t("home:thisIsYourStation") }>home</i>;
			if (station.get("privacy") !== "public") icon =
				<i className="material-icons" title={ this.props.t("home:thisStationIsNotVisible") }>lock</i>;
		}

		return (
			<div className="station-card">
				<div className="station-media">
					<img src={(station.get("currentSong")) ? station.getIn(["currentSong", "thumbnail"]) : ""} onError={function(e) {e.target.src=fallbackImage}}/>
				</div>
				<div className="station-body">
					<h3 className="displayName">{station.get("displayName")}</h3>
					<p className="description">{station.get("description")}</p>
				</div>
				<div className="station-footer">
					<div className="user-count" title={ this.props.t("home:howManyOtherUsers") }>
						<i className="material-icons">people</i>
						<span>{station.get("userCount")}</span>
					</div>
					{ icon }
				</div>
				<a href={station.get("type") + "/" + station.get("name")}/>
			</div>
		);
	}
}