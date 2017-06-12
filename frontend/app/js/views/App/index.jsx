import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { ban, authenticate } from "actions/app";
import Menu from "components/Global/Menu";

import io from "../../io";
import config from "../../../../config/default";

@connect()

export default class App extends Component {
	static propTypes = {
		children: PropTypes.object,
		dispatch: PropTypes.func,
	}

	componentDidMount() {
		const { dispatch } = this.props;

		io.init(config.serverDomain);
		io.getSocket(socket => {
			socket.on("ready", (status, role, username, userId) => {
				dispatch(authenticate(status, role, username, userId));
			});
			socket.on("keep.event:banned", reason => dispatch(ban(reason)));
		});
	}

	render() {
		const { children } = this.props;

		return (
			<div className="App">
				<Menu />

				<div className="Page">
					{ children }
				</div>
			</div>
		);
	}
}
