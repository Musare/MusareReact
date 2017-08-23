import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Redirect, Route } from "react-router-dom";
import { translate } from "react-i18next";

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

@connect(state => ({
	loggedIn: state.user.get("loggedIn"),
	role: state.user.get("role"),
	authProcessed: state.user.get("authProcessed"),
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

		if (auth === "ignored") state.continue = true;
		else if (auth === "station") {
			state.waitingFor = "station";
			this.getStationData();
		} else state.waitingFor = "auth";

		this.state = state;
	}

	componentWillUpdate(nextProps) {
		document.title = `${ nextProps.title } - Musare`;
	}

	getStationData = () => {
		io.getSocket(socket => {
			socket.emit("stations.findByName", this.state.stationName, res => {
				this.setState({
					receivedStationData: true,
					stationData: res.data,
				});
			});
		});
	};

	render() {
		const { auth, role, loggedIn, authProcessed, t } = this.props;
		const { stationName, waitingFor, receivedStationData, stationData } = this.state;

		if (this.state.continue) {
			return <PropsRoute props={ this.props } component={ this.props.component }/>
		} else if (waitingFor === "station" && receivedStationData) {
			if (stationData) {
				const props = JSON.parse(JSON.stringify(this.props));
				// TODO Replace the above hack with a proper Object.clone
				props.stationName = stationName;
				props.stationData = stationData;
				return <Route props={ props } component={ this.props.component } />;
			}
			return <Redirect to={ "/" } />;
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
