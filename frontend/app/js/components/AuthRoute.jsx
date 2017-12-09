import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Redirect, Route } from "react-router-dom";
import { translate } from "react-i18next";
import { initializeStation } from "actions/station";

import { actionCreators as stationInfoActionCreators } from "ducks/stationInfo";
import { bindActionCreators } from "redux";

import io from "io";

const renderMergedProps = (component, ...rest) => {
	const finalProps = Object.assign({}, ...rest);
	return (
		React.createElement(component, finalProps)
	);
};

const PropsRoute = ({ component, ...rest }) => {
	return (
		<Route {...rest} render={routeProps => {
			return renderMergedProps(component, routeProps, rest);
		}}/>
	);
};
// Above two functions are from https://github.com/ReactTraining/react-router/issues/4105#issuecomment-289195202

function clone(obj) {
	return Object.assign({}, obj);
}

@connect(state => ({
	user: {
		role: state.session.get("role"),
		loggedIn: state.session.get("loggedIn"),
		authProcessed: state.session.get("authProcessed"),
	},
	station: {
		stationId: state.station.info.get("stationId"),
		name: state.station.info.get("name"),
	},
}),
(dispatch) => ({
	onJoinStation: bindActionCreators(stationInfoActionCreators.joinStation, dispatch),
}))

@translate(["general"], { wait: true })
export default class AuthRoute extends Component {
	static propTypes = {
		user: PropTypes.shape({
			role: PropTypes.string,
			loggedIn: PropTypes.bool,
			authProcessed: PropTypes.bool,
		}),
		title: PropTypes.string,
		auth: PropTypes.string,
		component: PropTypes.oneOfType([
			PropTypes.element,
			PropTypes.func,
		]),
		computedMatch: PropTypes.object,
		t: PropTypes.func,
	};

	static defaultProps = {
		user: {
			role: "default",
			loggedIn: false,
			authProcessed: false,
		},
		title: "Musare",
		auth: "ignored",
		component: () => {},
		computedMatch: {},
		t: () => {},
	};

	constructor(props) {
		super(props);
		const state = {
			stationName: props.computedMatch.params.name,
			waitingFor: "",
			continue: false,
			stationData: null,
			receivedStationData: false,
		};
		const { auth } = props;
		let getStationData = false;

		if (auth === "ignored") state.continue = true;
		else if (auth === "station") {
			state.waitingFor = "station";
			getStationData = true;
		} else state.waitingFor = "auth";
		this.state = state;

		if (getStationData) this.getStationData();
	}

	componentWillUpdate(nextProps) {
		document.title = `${ nextProps.title } - Musare`;
	}

	getStationData = () => {
		io.getSocket(socket => {
			socket.emit("stations.findByName", this.state.stationName, res => { //TODO Add simple endpoint
				if (res.status === "success") {
					this.props.onJoinStation({
						//TODO Refactor this to be better optimized
						stationId: res.data._id,
						name: res.data.name,
						displayName: res.data.displayName,
						description: res.data.description,
						privacy: res.data.privacy,
						type: res.data.type,
						ownerId: res.data.owner,
						paused: res.data.paused,
						pausedAt: res.data.pausedAt,
						// Mode
						// Userlist
							userList: [],
							userCount: 0,
							locked: res.data.locked,
							partyMode: res.data.partyMode,
						// Usercount
						songList: res.data.queue,
						// locked: res.data.locked,
						// partyMode: res.data.partyMode,
						// privatePlaylist: res.data.privatePlaylist,
					});
				} else {
					this.setState({
						noStation: true,
					});
				}
			});
		});
	};

	render() {
		const { user, auth, t } = this.props;
		const { loggedIn, role, authProcessed } = user;
		const { waitingFor, receivedStationData } = this.state;

		if (this.state.continue) {
			return <PropsRoute props={ this.props } component={ this.props.component }/>
		} else if (waitingFor === "station") {
			if (this.props.station.stationId) {
				// TODO Replace the above hack with a proper Object.clone
				return <Route component={ this.props.component } />;
			} else if (this.state.noStation) {
				return <Redirect to={ "/" } />;
			}
		} else if (waitingFor === "auth" && authProcessed) {
			if (auth === "required") {
				if (loggedIn) return <Route props={ this.props } component={ this.props.component } />;
				return <Redirect to={ "/" } />;
			} else if (auth === "disallowed") {
				if (!loggedIn) return <Route props={ this.props } component={ this.props.component } />;
				return <Redirect to={ "/login" } />;
			} else if (auth === "admin") {
				if (role === "admin") return <Route props={ this.props } component={ this.props.component } />;
				return <Redirect to={ "/" } />;
			}
		}
		return <h1>{ t("general:loading") }</h1>;
	}
}
