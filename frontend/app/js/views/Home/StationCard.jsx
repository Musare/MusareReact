import React, { Component } from "react";

import { connect } from "react-redux";
import { translate } from "react-i18next";

@translate(["home"], { wait: true })
export default class StationCard extends Component {
	render() {
		const { station, isOwner } = this.props;
		let icon = null;
		if (station.type === "official") {
			if (station.privacy !== "public") icon =
				<i className="material-icons" title={ this.props.t("home:thisStationIsNotVisible") }>lock</i>;
		} else {
			if (isOwner) icon =
				<i className="material-icons" title={ this.props.t("home:thisIsYourStation") }>home</i>;
			if (station.privacy !== "public") icon =
				<i className="material-icons" title={ this.props.t("home:thisStationIsNotVisible") }>lock</i>;
		}

		return (
			<div className="station-card">
				<div className="station-media">
					<img src={(station.currentSong) ? station.currentSong.thumbnail : ""}/>
				</div>
				<div className="station-body">
					<h3 className="displayName">{station.displayName}</h3>
					<p className="description">{station.description}</p>
				</div>
				<div className="station-footer">
					<div className="user-count" title={ this.props.t("home:howManyOtherUsers") }>
						<i className="material-icons">people</i>
						<span>{station.userCount}</span>
					</div>
					{ icon }
				</div>
				<a href={station.type + "/" + station.name}/>
			</div>
		);
	}
}