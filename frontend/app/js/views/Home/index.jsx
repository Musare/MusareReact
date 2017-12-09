import React, { Component } from "react";
import { NavLink } from "react-router-dom";

import CustomInput from "components/CustomInput.jsx";
import CustomMessages from "components/CustomMessages.jsx";
import PropTypes from "prop-types";
import { translate, Trans } from "react-i18next";

import { connect } from "react-redux";
import { actionCreators as homepageActionCreators } from "ducks/homepage";
import { bindActionCreators } from "redux";

import StationCard from "./StationCard";

import io from "io";
import config from "config";

@connect(state => ({
	user: {
		loggedIn: state.session.get("loggedIn"),
		userId: state.session.get("userId"),
		role: state.session.get("role"),
	},
	officialStations: state.homepage.getIn(["stations", "official"]),
	communityStations: state.homepage.getIn(["stations", "community"]),
}),
(dispatch) => ({
	onStationIndex: bindActionCreators(homepageActionCreators.stationIndex, dispatch),
	onStationCreate: bindActionCreators(homepageActionCreators.stationCreate, dispatch),
	onStationRemove: bindActionCreators(homepageActionCreators.stationRemove, dispatch),
	onStationSongUpdate: bindActionCreators(homepageActionCreators.stationSongUpdate, dispatch),
	onStationUserCountUpdate: bindActionCreators(homepageActionCreators.stationUserCountUpdate, dispatch),
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
			createStation: {
				private: false,
			},
		};

		io.getSocket(socket => {
			socket.emit("stations.index", data => {
				if (data.status === "success") {
					this.props.onStationIndex(data.stations);
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

	/*listStations = (type) => {
		let stations = [];

		this.state.stations[type].forEach((station) => {
			stations.push(<StationCard station={ station }/>);
		});

		return stations;
	};*/

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
					{ this.props.officialStations.map((station) => {
						return <StationCard station={ station } />;
					}) }
				</div>
				<h2>{ t("home:communityStations") }</h2>
				<div className="community-stations stations">
					{ (this.props.loggedIn) ? (
						<div className="station-card">
							<div className="station-media station-media-icon">
								<div className="create-station-header">
									<h3>Create community station</h3>
								</div>
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
					{ this.props.communityStations.map((station) => {
						return <StationCard station={ station } isOwner={ this.isOwner(station.ownerId) } key={ station.stationId }/>;
					}) }
				</div>
			</main>
		);
	}
}
