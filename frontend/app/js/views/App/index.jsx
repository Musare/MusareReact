import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { ban, authenticate } from "actions/app";
import Menu from "components/Global/Menu";

import io from "../../io";
import config from "../../../../config/default";

const asyncComponent = getComponent => {
	return class AsyncComponent extends React.Component {
		static Component = null;
		state = { Component: AsyncComponent.Component };

		componentWillMount() {
			if (!this.state.Component) {
				getComponent().then(Component => { // eslint-disable-line no-shadow
					AsyncComponent.Component = Component;
					this.setState({ Component });
				});
			}
		}
		render() {
			const { Component } = this.state; // eslint-disable-line no-shadow
			if (Component) return <Component { ...this.props } />;
			return null;
		}
	};
};

@connect()

export default class App extends Component { // eslint-disable-line react/no-multi-comp
	static propTypes = {
		dispatch: PropTypes.func,
	}

	static defaultProps = {
		dispatch: () => {},
	}

	componentDidMount() {
		const { dispatch } = this.props;

		io.init(config.serverDomain);
		io.getSocket(socket => {
			socket.on("ready", (status, role, username, userId) => {
				dispatch(authenticate({ status, role, username, userId }));
			});
			socket.on("keep.event:banned", reason => dispatch(ban(reason)));
		});
	}

	render() {
		return (
			<div>
				<Menu />
				<div>
					<Switch>
						<Route
							exact
							path="/login"
							component={ asyncComponent(() =>
								System.import("views/Auth/Login").then(module => module.default)
							) }
						/>
						<Route
							exact
							path="/logout"
							component={ asyncComponent(() =>
								System.import("views/Auth/Logout").then(module => module.default)
							) }
						/>
						<Route
							exact
							path="/register"
							component={ asyncComponent(() =>
								System.import("views/Auth/Register").then(module => module.default)
							) }
						/>
						<Route
							exact
							path="/template"
							component={ asyncComponent(() =>
								System.import("views/Template").then(module => module.default)
							) }
						/>
						<Route
							exact
							path="/"
							component={ asyncComponent(() =>
								System.import("views/Home").then(module => module.default)
							) }
						/>
						<Route
							path="*"
							component={ asyncComponent(() =>
								System.import("views/NotFound").then(module => module.default)
							) }
						/>
					</Switch>
				</div>
			</div>
		);
	}
}
