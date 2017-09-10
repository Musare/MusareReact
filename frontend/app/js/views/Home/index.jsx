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
	},
}))

@translate(["homepage"], { wait: true })
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
						"name": "kridsads",
						"displayName": "KrisVossad130",
						"description": "Test123asd",
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

	listStations = (type) => {
		let stations = [];

		let userId = "";
		if (this.props.user) {
			userId = this.props.user.userId;
		}

		this.state.stations[type].forEach((station) => {
			stations.push(
				(
					<div key={station._id} className="station-card">
						<div className="station-media">
							<img style={{width: "64px"}} src={station.currentSong.thumbnail}/>
						</div>
						<p>{station.displayName}</p>
						<p>{station.description}</p>
						<p>{station.userCount}</p>
						<p>{station.privacy}</p>
						{ (station.type === "community" || station.owner === userId) ? <p>I am the owner</p> : null }
					</div>
				)
			);
		});

		return stations;
	};

	render() {
		const { t } = this.props;

		return (
			<main id="homepage">
				<h1>{ t("homepage:title") }</h1>
				<CustomMessages onRef={ ref => (this.messages = ref) } />
				<h2>Official Stations</h2>
				{ this.listStations("official") }
				<h2>Community Stations</h2>
				{ this.listStations("community") }
			</main>
		);
	}
}
