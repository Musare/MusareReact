import React, { Component } from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { translate } from "react-i18next";

import { ban, authenticate } from "actions/auth";
import Navbar from "components/Global/Navbar";

import config from "config";
import AuthRoute from "components/AuthRoute";
import io from "./io";

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
@translate(["pages"], { wait: false })
class App extends Component { // eslint-disable-line react/no-multi-comp
	static propTypes = {
		dispatch: PropTypes.func,
		t: PropTypes.func,
	};

	static defaultProps = {
		dispatch: () => {},
		t: () => {},
	};

	componentDidMount() {
		const { dispatch } = this.props;

		io.init(config.serverDomain);
		io.getSocket(socket => {
			socket.on("ready", (loggedIn, role, username, userId) => {
				dispatch(authenticate({ loggedIn, role, username, userId }));
			});
			socket.on("keep.event:banned", reason => dispatch(ban(reason)));

			socket.on("keep.event:user.session.removed", () => {
				location.reload();
				// TODO Give user prompt they've been logged out and let them continue.
			});
		});

		if (localStorage.getItem("github_redirect")) {
			// TODO
			localStorage.removeItem("github_redirect");
		}
	}

	render() {
		const { t } = this.props;

		return (
			<div>
				<Navbar />
				<Switch>
					<AuthRoute
						exact
						path="/login"
						component={ asyncComponent(() =>
							System.import("views/Auth/Login").then(module => module.default)
						) }
						auth="disallowed"
						title={ t("pages:login") }
					/>
					<AuthRoute
						exact
						path="/logout"
						component={ asyncComponent(() =>
							System.import("views/Auth/Logout").then(module => module.default)
						) }
						auth="required"
						title="Logout"
					/>
					<AuthRoute
						exact
						path="/register"
						component={ asyncComponent(() =>
							System.import("views/Auth/Register").then(module => module.default)
						) }
						auth="disallowed"
						title={ t("pages:register") }
					/>
					<AuthRoute
						exact
						path="/settings"
						component={ asyncComponent(() =>
							System.import("views/Auth/Settings").then(module => module.default)
						) }
						auth="required"
						title={ t("pages:settings") }
					/>
					<AuthRoute
						exact
						path="/settings/setpassword"
						component={ asyncComponent(() =>
							System.import("views/Auth/Settings/SetPassword").then(module => module.default)
						) }
						auth="required"
						title={ t("pages:setPassword") }
					/>
					<AuthRoute
						exact
						path="/reset_password"
						component={ asyncComponent(() =>
							System.import("views/Auth/ForgotPassword").then(module => module.default)
						) }
						auth="disallowed"
						title={ t("pages:resetPassword") }
					/>
					<AuthRoute
						exact
						path="/"
						component={ asyncComponent(() =>
							System.import("views/Home").then(module => module.default)
						) }
						auth="ignored"
						title={ t("pages:homepage") }
					/>
					<AuthRoute
						path="*"
						component={ asyncComponent(() =>
							System.import("views/Errors/Error404").then(module => module.default)
						) }
						auth="ignored"
						title={ t("pages:error404") }
					/>
				</Switch>
			</div>
		);
	}
}

export default withRouter(App);