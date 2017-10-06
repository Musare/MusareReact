import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Redirect, Route } from "react-router-dom";
import { translate } from "react-i18next";
import { initializeStation } from "actions/station";

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
	loggedIn: state.user.get("loggedIn"),
	role: state.user.get("role"),
	authProcessed: state.user.get("authProcessed"),
	station: {
		stationId: state.station.get("id"),
		name: state.station.get("name"),
	},
}))

@translate(["general"], { wait: true })
export default class AuthRoute extends Component {
	static propTypes = {
		loggedIn: PropTypes.bool,
		title: PropTypes.string,
		role: PropTypes.string,
		auth: PropTypes.string,
		authProcessed: PropTypes.bool,
		component: PropTypes.oneOfType([
			PropTypes.element,
			PropTypes.func,
		]),
		computedMatch: PropTypes.object,
		t: PropTypes.func,
	};

	static defaultProps = {
		loggedIn: false,
		title: "Musare",
		role: "default",
		auth: "ignored",
		authProcessed: false,
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
			socket.emit("stations.findByName", this.state.stationName, res => {
				if (res.status === "success") {
					this.props.dispatch(initializeStation({
						//TODO Refactor this to be better optimized
						stationId: res.data._id,
						name: res.data.name,
						displayName: res.data.displayName,
						description: res.data.description,
						privacy: res.data.privacy,
						locked: res.data.locked,
						partyMode: res.data.partyMode,
						owner: res.data.owner,
						privatePlaylist: res.data.privatePlaylist,
						type: res.data.type,
						paused: res.data.paused,
						pausedAt: res.data.pausedAt,
					}));
				} else {
					this.setState({
						noStation: true,
					});
				}
			});
		});
	};

	render() {
		const { auth, role, loggedIn, authProcessed, t } = this.props;
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
