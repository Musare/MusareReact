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

import { asyncComponent } from 'react-async-component';

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
						component={ asyncComponent({
							resolve: () => System.import("views/Auth/Login")
						})}
						auth="disallowed"
						title={ t("pages:login") }
					/>
					<AuthRoute
						exact
						path="/logout"
						component={ asyncComponent({
							resolve: () => System.import("views/Auth/Logout")
						})}
						auth="required"
						title="Logout"
					/>
					<AuthRoute
						exact
						path="/register"
						component={ asyncComponent({
							resolve: () => System.import("views/Auth/Register")
						})}
						auth="disallowed"
						title={ t("pages:register") }
					/>
					<AuthRoute
						exact
						path="/settings"
						component={ asyncComponent({
							resolve: () => System.import("views/Auth/Settings")
						})}
						auth="required"
						title={ t("pages:settings") }
					/>
					<AuthRoute
						exact
						path="/settings/setpassword"
						component={ asyncComponent({
							resolve: () => System.import("views/Auth/Settings/SetPassword")
						})}
						auth="required"
						title={ t("pages:setPassword") }
					/>
					<AuthRoute
						exact
						path="/reset_password"
						component={ asyncComponent({
							resolve: () => System.import("views/Auth/ForgotPassword")
						})}
						auth="disallowed"
						title={ t("pages:resetPassword") }
					/>
					<AuthRoute
						path="/terms"
						component={ asyncComponent({
							resolve: () => System.import("views/Terms")
						})}
						auth="ignored"
						title={ t("pages:terms") }
					/>
					<AuthRoute
						path="/privacy"
						component={ asyncComponent({
							resolve: () => System.import("views/Privacy")
						})}
						auth="ignored"
						title={ t("pages:privacy") }
					/>
					<AuthRoute
						path="/team"
						component={ asyncComponent({
							resolve: () => System.import("views/Team")
						})}
						auth="ignored"
						title={ t("pages:team") }
					/>
					<AuthRoute
						path="/u/:username"
						component={ asyncComponent({
							resolve: () => System.import("views/Profile")
						})}
						auth="ignored"
						title={ t("pages:profile") }
					/>
					<AuthRoute
						exact
						path="/"
						component={ asyncComponent({
							resolve: () => System.import("views/Home")
						})}
						auth="ignored"
						title={ t("pages:homepage") }
					/>
					<AuthRoute
						path="*"
						component={ asyncComponent({
							resolve: () => System.import("views/Errors/Error404")
						})}
						auth="ignored"
						title={ t("pages:error404") }
					/>
				</Switch>
			</div>
		);
	}
}

export default withRouter(App);