import React, { Component } from "react";
import async from "async";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import { translate } from "react-i18next";

import config from "config";

import CustomInput from "components/CustomInput.jsx";
import CustomMessages from "components/CustomMessages.jsx";

import io from "io";

@connect(state => ({
	user: {
		userId: state.user.get("userId"),
	},
}))

@translate(["settings"], { wait: true })
export default class Settings extends Component {
	static propTypes = {
		user: PropTypes.object,
		t: PropTypes.func,
	};

	static defaultProps = {
		user: {
			userId: "",
		},
		t: () => {},
	};

	constructor(props) {
		super(props);

		CustomInput.initialize(this);

		this.state = {
			passwordLinked: false,
			gitHubLinked: false,
		};

		io.getSocket(socket => {
			socket.emit("users.findBySession", res => {
				if (res.status === "success") {
					this.input.email.setValue(res.data.email.address, true);
					this.input.username.setValue(res.data.username, true);
					this.setState({
						passwordLinked: res.data.password,
						gitHubLinked: res.data.github,
					});
				} else {
					this.messages.addError(this.props.t("general:notLoggedInError"));
				}
			});

			socket.on("event:user.username.changed", username => {
				this.input.username.setValue(username, true);
			});

			// TODO Email changed event?

			socket.on("event:user.linkPassword", () => {
				this.setState({
					passwordLinked: true,
				});
			});

			socket.on("event:user.linkGitHub", () => {
				this.setState({
					gitHubLinked: true,
				});
			});

			socket.on("event:user.unlinkPassword", () => {
				this.setState({
					passwordLinked: false,
				});
			});

			socket.on("event:user.unlinkGitHub", () => {
				this.setState({
					gitHubLinked: false,
				});
			});
		});
	}

	/* githubRedirect() {
		localStorage.setItem("github_redirect", window.location.pathname);
	} */

	saveChanges = () => {
		this.messages.clearErrorSuccess();
		async.waterfall([
			(next) => {
				if (this.input.username.isPristine()) this.input.username.validate(next);
				else next();
			},
			(next) => {
				if (this.input.email.isPristine()) this.input.email.validate(next);
				else next();
			},
		], () => {
			if (CustomInput.hasInvalidInput(this.input, ["username", "email"])) {
				this.messages.clearAddError(this.props.t("general:someFieldsAreIncorrectError"));
			} else if (this.input.username.isOriginal() && this.input.email.isOriginal()) {
				this.messages.clearAddError(this.props.t("settings:usernameOrEmailHasntChanged"));
			} else {
				const email = this.input.email.getValue();
				const username = this.input.username.getValue();
				io.getSocket(socket => {
					if (!this.input.email.isOriginal()) {
						socket.emit("users.updateEmail", this.props.user.userId, email, res => {
							if (res.status === "success") {
								this.messages.clearAddSuccess(this.props.t("settings:successfullyUpdatedEmail"));
							} else {
								this.messages.addError(res.message);
							}
						});
					}

					if (!this.input.username.isOriginal()) {
						socket.emit("users.updateUsername", this.props.user.userId, username, res => {
							if (res.status === "success") {
								this.messages.clearAddSuccess(this.props.t("settings:successfullyUpdatedUsername"));
							} else {
								this.messages.addError(res.message);
							}
						});
					}
				});
			}
		});
	};

	changePassword = () => {
		this.messages.clearErrorSuccess();
		if (CustomInput.hasInvalidInput(this.input, ["newPassword"])) {
			this.messages.clearAddError(this.props.t("general:someFieldsAreIncorrectError"));
		} else if (!this.state.passwordLinked) {
			this.messages.clearAddError("You don't have a password set.");
		} else {
			io.getSocket(socket => {
				socket.emit("users.updatePassword", this.input.newPassword.getValue(), res => {
					if (res.status === "success") {
						this.messages.clearAddSuccess("Successfully changed password.");
					} else {
						this.messages.addError(res.message);
					}
				});
			});
		}
	};

	logOutEverywhere = () => {
		this.messages.clearErrorSuccess();
		io.getSocket(socket => {
			socket.emit("users.removeSessions", this.props.user.userId, res => {
				if (res.status === "success") {
					this.messages.clearAddSuccess(this.props.t("settings:successfullyLoggedOutEverywhere"));
				} else {
					this.messages.addError(res.message);
				}
			});
		});
	};

	unlinkGitHub = () => {
		this.messages.clearErrorSuccess();
		io.getSocket(socket => {
			socket.emit("users.unlinkGitHub", res => {
				if (res.status === "success") {
					this.messages.clearAddSuccess(this.props.t("settings:successfullyUnlinkedGitHub"));
				} else {
					this.messages.addError(res.message);
				}
			});
		});
	};

	unlinkPassword = () => {
		this.messages.clearErrorSuccess();
		io.getSocket(socket => {
			socket.emit("users.unlinkPassword", res => {
				if (res.status === "success") {
					this.messages.clearAddSuccess(this.props.t("settings:successfullyUnlinkedPassword"));
				} else {
					this.messages.addError(res.message);
				}
			});
		});
	};

	linkButtons = () => {
		const newPassword = <CustomInput key="newPassword" type="password" name="newPassword" label={ this.props.t("general:newPasswordInput") } placeholder={ this.props.t("general:newPasswordInput") } onRef={ ref => (this.input.newPassword = ref) } />;
		const changePasswordButton = <button key="changePassword" onClick={ this.changePassword }>{ this.props.t("settings:changePassword") }</button>;
		const linkPassword = <NavLink key="linkPassword" className="button" to="/settings/setpassword" >{ this.props.t("settings:addAPasswordToAccount") }</NavLink>;
		const linkGitHub = <a key="linkGitHub" className="gray-button" href={ config.serverDomain + "/auth/github/link" }>{ this.props.t("settings:linkGitHubToAccount") }</a>;
		const unlinkGitHub = (
			<button key="unlinkGitHub" className="red-button" onClick={ this.unlinkGitHub }>
				{ this.props.t("settings:removeLoggingInWithGitHub") }
			</button>
		);
		const unlinkPassword = (
			<button key="unlinkPassword" className="red-button" onClick={ this.unlinkPassword }>
				{ this.props.t("settings:removeLoggingInWithPassword") }
			</button>
		);

		const toReturn = [];
		if (this.state.passwordLinked) {
			toReturn.push(newPassword);
			toReturn.push(changePasswordButton);
		}
		if (this.state.passwordLinked && this.state.gitHubLinked) {
			toReturn.push(unlinkGitHub);
			toReturn.push(unlinkPassword);
		} else if (!this.state.passwordLinked) {
			toReturn.push(linkPassword);
		} else toReturn.push(linkGitHub);
		return toReturn;
	};

	render() {
		const { t } = this.props;

		return (
			<main>
				<h1>{ t("settings:title") }</h1>
				<CustomMessages onRef={ ref => (this.messages = ref) } />
				<div className="sections">
					<div className="section general-section">
						<h2>{ this.props.t("settings:general") }</h2>
						<CustomInput type="email" name="email" label={ this.props.t("general:emailInput") } placeholder={ this.props.t("general:emailInput") } onRef={ ref => (this.input.email = ref) } />
						<CustomInput type="username" name="username" label={ this.props.t("general:usernameInput") } placeholder={ this.props.t("general:usernameInput") } onRef={ ref => (this.input.username = ref) } />
						<button onClick={ this.saveChanges }>{ this.props.t("settings:saveChanges") }</button>
					</div>
					<div className="section security-section">
						<h2>{ this.props.t("settings:security") }</h2>
						{ this.linkButtons() }
						<button className="red-button" onClick={ this.logOutEverywhere }>{ this.props.t("settings:logOutEverywhere") }</button>
					</div>
				</div>
			</main>
		);
	}
}
