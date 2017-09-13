import React, { Component } from "react";
import { NavLink } from "react-router-dom";

import CustomInput from "components/CustomInput.jsx";
import CustomMessages from "components/CustomMessages.jsx";
import PropTypes from "prop-types";
import { translate, Trans } from "react-i18next";

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

@translate(["home", "createCommunityStation"], { wait: true })
export default class Homepage extends Component {
	static propTypes = {
		t: PropTypes.func,
	};

	static defaultProps = {
		t: () => {},
	};

	constructor() {
		super();

		CustomInput.initialize(this);

		this.state = {
			stations: {
				official: [],
				community: [],
			},
			createStation: {
				private: false,
			}
		};

		io.getSocket(socket => {
			socket.emit("stations.index", data => {
				if (data.status === "success") {
					let community = [];
					let official = [];
					data.stations.forEach(station => {
						if (!station.currentSong) station.currentSong = { thumbnail: '/assets/images/notes-transparent.png' };
						if (station.currentSong && !station.currentSong.thumbnail) station.currentSong.thumbnail = "/assets/images/notes-transparent.png";
						if (station.type === 'official') official.push(station);
						else community.push(station);
					});

					official.push({
						"_id": "59b522222634af57e8e2dbcf",
						"name": "pr_o",
						"displayName": "PrivateOfficial",
						"description": "Test official station. Private.",
						"type": "official",
						"queue": [],
						"locked": false,
						"privacy": "private",
						"blacklistedGenres": [],
						"genres": [],
						"playlist": [],
						"startedAt": 0,
						"pausedAt": 0,
						"timePaused": 0,
						"currentSongIndex": 0,
						userCount: 0,
						"currentSong": {
							"songId": "60ItHLz5WEA",
							"title": "Faded - Alan Walker",
							"duration": 212,
							"skipDuration": 0,
							"skipVotes": [],
							"dislikes": -1,
							"likes": -1,
							"artists": [],
							thumbnail: "/assets/images/notes-transparent.png"
						},
						"paused": false,
						"__v": 0
					});

					official.push({
						"_id": "59b522222634af57e8e2dbcf",
						"name": "un_o",
						"displayName": "UnlistedOfficial",
						"description": "Test official station. Unlisted.",
						"type": "official",
						"queue": [],
						"locked": false,
						"privacy": "unlisted",
						"blacklistedGenres": [],
						"genres": [],
						"playlist": [],
						"startedAt": 0,
						"pausedAt": 0,
						"timePaused": 0,
						"currentSongIndex": 0,
						userCount: 0,
						"currentSong": {
							"songId": "60ItHLz5WEA",
							"title": "Faded - Alan Walker",
							"duration": 212,
							"skipDuration": 0,
							"skipVotes": [],
							"dislikes": -1,
							"likes": -1,
							"artists": [],
							thumbnail: "/assets/images/notes-transparent.png"
						},
						"paused": false,
						"__v": 0
					});

					official.push({
						"_id": "59b522222634afe7e8e2dbcf",
						"name": "pu_o",
						"displayName": "PublicOfficial",
						"description": "Test official station. Public.",
						"type": "official",
						"queue": [],
						"locked": false,
						"privacy": "public",
						"blacklistedGenres": [],
						"genres": [],
						"playlist": [],
						"startedAt": 0,
						"pausedAt": 0,
						"timePaused": 0,
						"currentSongIndex": 0,
						userCount: 0,
						"currentSong": {
							"songId": "60ItHLz5WEA",
							"title": "Faded - Alan Walker",
							"duration": 212,
							"skipDuration": 0,
							"skipVotes": [],
							"dislikes": -1,
							"likes": -1,
							"artists": [],
							thumbnail: "/assets/images/notes-transparent.png"
						},
						"paused": false,
						"__v": 0
					});

					community.push({
						"_id": "59b522222634afe7e8e2dbcf",
						"name": "pu_c",
						"displayName": "PublicCommunity",
						"description": "Test community station. Public.",
						"type": "community",
						"queue": [],
						"locked": false,
						"privacy": "public",
						"blacklistedGenres": [],
						"genres": [],
						"playlist": [],
						"startedAt": 0,
						"pausedAt": 0,
						"timePaused": 0,
						"currentSongIndex": 0,
						userCount: 0,
						"currentSong": {
							"songId": "60ItHLz5WEA",
							"title": "Faded - Alan Walker",
							"duration": 212,
							"skipDuration": 0,
							"skipVotes": [],
							"dislikes": -1,
							"likes": -1,
							"artists": [],
							thumbnail: "/assets/images/notes-transparent.png"
						},
						"paused": false,
						"__v": 0
					});

					community.push({
						"_id": "59b522222634afe7e8e2dbcf",
						"name": "un_c",
						"displayName": "UnlistedCommunity",
						"description": "Test community station. Unlisted.",
						"type": "community",
						"queue": [],
						"locked": false,
						"privacy": "unlisted",
						"blacklistedGenres": [],
						"genres": [],
						"playlist": [],
						"startedAt": 0,
						"pausedAt": 0,
						"timePaused": 0,
						"currentSongIndex": 0,
						userCount: 0,
						"currentSong": {
							"songId": "60ItHLz5WEA",
							"title": "Faded - Alan Walker",
							"duration": 212,
							"skipDuration": 0,
							"skipVotes": [],
							"dislikes": -1,
							"likes": -1,
							"artists": [],
							thumbnail: "/assets/images/notes-transparent.png"
						},
						"paused": false,
						"__v": 0
					});

					community.push({
						"_id": "59b522222634afe7e8e2dbcf",
						"name": "pr_c",
						"displayName": "PrivateCommunity",
						"description": "Test community station. Private.",
						"type": "community",
						"queue": [],
						"locked": false,
						"privacy": "private",
						"blacklistedGenres": [],
						"genres": [],
						"playlist": [],
						"startedAt": 0,
						"pausedAt": 0,
						"timePaused": 0,
						"currentSongIndex": 0,
						userCount: 0,
						"currentSong": {
							"songId": "60ItHLz5WEA",
							"title": "Faded - Alan Walker",
							"duration": 212,
							"skipDuration": 0,
							"skipVotes": [],
							"dislikes": -1,
							"likes": -1,
							"artists": [],
							thumbnail: "/assets/images/notes-transparent.png"
						},
						"paused": false,
						"__v": 0
					});

					this.setState({
						stations: {
							official,
							community,
						}
					});
				}
			});
		});
	}

	isOwner = (ownerId) => {
		if (this.props.loggedIn) {
			if (this.props.user.role === "admin") return true;
			if (this.props.user.userId === ownerId) return true;
		}

		return false;
	};

	listStations = (type) => {
		let stations = [];

		this.state.stations[type].forEach((station) => {
			let icon = null;
			if (station.type === "official") {
				if (station.privacy !== "public") icon =
					<i className="material-icons" title={ this.props.t("home:thisStationIsNotVisible") }>lock</i>;
			} else {
				// TODO Add isOwner function globally
				if (this.isOwner(station.ownerId)) icon =
					<i className="material-icons" title={ this.props.t("home:thisIsYourStation") }>home</i>;
				if (station.privacy !== "public") icon =
					<i className="material-icons" title={ this.props.t("home:thisStationIsNotVisible") }>lock</i>;
			}

			stations.push(
				(
					<div key={station._id} className="station-card">
						<div className="station-media">
							<img src={station.currentSong.thumbnail}/>
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
				)
			);
		});

		return stations;
	};

	togglePrivate = () => {
		this.setState({
			createStation: {
				private: !this.state.createStation.private,
			},
		});
	};

	createCommunity = () => {
		this.messages.clearErrorSuccess();
		if (CustomInput.hasInvalidInput(this.input)) {
			this.messages.clearAddError(this.props.t("general:someFieldsAreIncorrectError"));
		} else {
			io.getSocket(socket => {
				//TODO Add private value
				socket.emit("stations.create", {
					name: this.input.stationName.getValue(),
					type: "community",
					displayName: this.input.stationDisplayName.getValue(),
					description: this.input.stationDescription.getValue(),
				}, res => {
					if (res.status === "success") {
						location.href = "/community/" + this.input.stationName.getValue();//TODO Remove
					} else {
						this.messages.addError(res.message);
					}
				});
			});
		}
	};

	render() {
		const { t } = this.props;

		//TODO Make this not re-render a lot

		return (
			<main id="homepage">
				<h1>{ t("home:title") }</h1>
				<CustomMessages onRef={ ref => (this.messages = ref) } />
				<h2>{ t("home:officialStations") }</h2>
				<div className="official-stations stations">
					{ this.listStations("official") }
				</div>
				<h2>{ t("home:communityStations") }</h2>
				<div className="community-stations stations">
					{ (this.props.loggedIn) ? (
						<div className="station-card">
							<div className="station-media station-media-icon">
								<i className="material-icons" title={ this.props.t("createCommunityStation:addCommunityStation") } onClick={ this.createCommunity }>add</i>
							</div>
							<div className="station-body">
								<CustomInput key="stationDisplayName" type="stationDisplayName" name="stationDisplayName" showLabel={ false } placeholder={ this.props.t("createCommunityStation:displayNameHere") } onRef={ ref => (this.input.stationDisplayName = ref) } />
								<CustomInput key="stationDescription" type="stationDescription" name="stationDescription" showLabel={ false } placeholder={ this.props.t("createCommunityStation:descriptionHere") } onRef={ ref => (this.input.stationDescription = ref) } />
							</div>
							<div className="station-footer">
								<div className="nameContainer">
									<span>musare.com/c/</span>
									<CustomInput key="stationName" type="stationName" name="stationName" showLabel={ false } placeholder={ this.props.t("createCommunityStation:nameHere") } onRef={ ref => (this.input.stationName = ref) } />
								</div>
								{(this.state.createStation.private) ? <i className="material-icons" title={ this.props.t("createCommunityStation:makeThisStationPublic") } onClick={ this.togglePrivate }>lock</i> : <i className="material-icons active" title={ this.props.t("createCommunityStation:makeThisStationPrivate") } onClick={ this.togglePrivate }>lock</i>}
							</div>
						</div>
					) : null }
					{ this.listStations("community") }
				</div>
			</main>
		);
	}
}
