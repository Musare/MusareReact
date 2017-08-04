import React, { Component } from "react";
import async from "async";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";

import config from "../../../../config/default";

import CustomInput from "./CustomInput.jsx";
import CustomErrors from "./CustomErrors.jsx";

import io from "../../io";

@connect(state => ({
	user: {
		userId: state.user.get("userId"),
	},
}))

export default class Settings extends Component {
	static propTypes = {
		user: PropTypes.object,
	};

	static defaultProps = {
		user: {
			userId: "",
		},
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
					this.errors.addError("You are currently not logged in.");
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
				this.errors.clearAddError("Some fields are incorrect. Please fix them before continuing.");
			} else if (this.input.username.isOriginal() && this.input.email.isOriginal()) {
				this.errors.clearAddError("Username or email hasn't changed.");
			} else {
				this.errors.clearErrors();
				const email = this.input.email.getValue();
				const username = this.input.username.getValue();
				io.getSocket(socket => {
					if (!this.input.email.isOriginal()) {
						socket.emit("users.updateEmail", this.props.user.userId, email, res => {
							if (res.status === "success") {
								alert("Success!");
							} else {
								this.errors.addError(res.message);
							}
						});
					}

					if (!this.input.username.isOriginal()) {
						socket.emit("users.updateUsername", this.props.user.userId, username, res => {
							if (res.status === "success") {
								alert("Success!");
							} else {
								this.errors.addError(res.message);
							}
						});
					}
				});
			}
		});
	};

	changePassword = () => {
		if (CustomInput.hasInvalidInput(this.input, ["newPassword"])) {
			this.errors.clearAddError("Some fields are incorrect. Please fix them before continuing.");
		} else if (!this.state.passwordLinked) {
			this.errors.clearAddError("You don't have a password set.");
		} else {
			this.errors.clearErrors();
			io.getSocket(socket => {
				socket.emit("users.updatePassword", this.input.newPassword.getValue(), res => {
					if (res.status === "success") {
						alert("Success!");
					} else {
						this.errors.addError(res.message);
					}
				});
			});
		}
	};

	logOutEverywhere = () => {
		this.errors.clearErrors();
		io.getSocket(socket => {
			socket.emit("users.removeSessions", this.props.user.userId, res => {
				if (res.status === "success") {
					alert("Success!");
				} else {
					this.errors.addError(res.message);
				}
			});
		});
	};

	unlinkGitHub = () => {
		this.errors.clearErrors();
		io.getSocket(socket => {
			socket.emit("users.unlinkGitHub", res => {
				if (res.status === "success") {
					alert("Success!");
				} else {
					this.errors.addError(res.message);
				}
			});
		});
	};

	unlinkPassword = () => {
		this.errors.clearErrors();
		io.getSocket(socket => {
			socket.emit("users.unlinkPassword", res => {
				if (res.status === "success") {
					alert("Success!");
				} else {
					this.errors.addError(res.message);
				}
			});
		});
	};

	linkButtons = () => {
		const newPassword = <CustomInput key="newPassword" type="password" name="newPassword" label="New password" placeholder="New password" onRef={ ref => (this.input.newPassword = ref) } />;
		const changePasswordButton = <button key="changePassword" onClick={ this.changePassword }>Change password</button>;
		const linkPassword = <NavLink key="linkPassword" to="/settings/setpassword" >Add a password to account</NavLink>;
		const linkGitHub = <a key="linkGitHub" href={ config.serverDomain + "/auth/github/link" }>Link GitHub to account</a>;
		const unlinkGitHub = (<button key="unlinkGitHub" onClick={ this.unlinkGitHub }>
				Remove logging in with GitHub
			</button>);
		const unlinkPassword = (<button key="unlinkPassword" onClick={ this.unlinkPassword }>
			Remove logging in with password
		</button>);

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
		return (
			<div>
				<CustomErrors onRef={ ref => (this.errors = ref) } />
				<div>
					<h2>General</h2>
					<CustomInput type="email" name="email" label="Email" placeholder="Email" onRef={ ref => (this.input.email = ref) } />
					<CustomInput type="username" name="username" label="Username" placeholder="Username" onRef={ ref => (this.input.username = ref) } />
					<button onClick={ this.saveChanges }>Save changes</button>
				</div>
				<div>
					<h2>Security</h2>
					{ this.linkButtons() }
					<button onClick={ this.logOutEverywhere }>Log out everywhere</button>
				</div>
			</div>
		);
	}
}
