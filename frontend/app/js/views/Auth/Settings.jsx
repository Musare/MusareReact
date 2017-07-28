import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

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

		this.state = {
			email: "",
			username: "",
			currentPassword: "",
			newPassword: "",
			newPasswordAgain: "",
			passwordLinked: false,
			gitHubLinked: false,
			inputInvalid: {
				email: true,
				username: true,
				newPassword: true,
			},
			savedValue: {
				email: "",
				username: "",
			},
		};

		this.customInputs = {};

		io.getSocket(socket => {
			socket.emit("users.findBySession", res => {
				if (res.status === "success") {
					this.setState({
						email: res.data.email.address,
						username: res.data.username,
						passwordLinked: res.data.password,
						gitHubLinked: res.data.github,
						savedValue: {
							email: res.data.email.address,
							username: res.data.username,
						},
					}, () => {
						this.customInputs.email.triggerChangeEvent(true);
						this.customInputs.username.triggerChangeEvent(true);
					});
				} else {
					this.errors.addError("You are currently not logged in.");
				}
			});

			socket.on("event:user.username.changed", username => {
				this.setState({
					username,
					savedValue: {
						username,
					},
				}, () => {
					this.customInputs.username.triggerChangeEvent(true);
				});
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

	updateField(field, event) {
		this.setState({
			[field]: event.target.value,
		});
	}

	/* githubRedirect() {
		localStorage.setItem("github_redirect", window.location.pathname);
	} */
	isTheSame = (type) => {
		return this.state[type] === this.state.savedValue[type];
	};

	saveChanges = () => {
		if (CustomInput.hasInvalidInput(this.state.inputInvalid, ["username", "email"])) {
			this.errors.clearAddError("Some fields are incorrect. Please fix them before continuing.");
		} else if (this.isTheSame("username") && this.isTheSame("email")) {
			this.errors.clearAddError("Username or email hasn't changed.");
		} else {
			this.errors.clearErrors();
			const email = this.state.email;
			const username = this.state.username;
			io.getSocket(socket => {
				if (!this.isTheSame("email")) {
					socket.emit("users.updateEmail", this.props.user.userId, email, res => {
						if (res.status === "success") {
							alert("Success!");
						} else {
							this.errors.addError(res.message);
						}
					});
				}

				if (!this.isTheSame("username")) {
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
	};

	changePassword = () => {
		if (CustomInput.hasInvalidInput(this.state.inputInvalid, ["newPassword"])) {
			this.errors.clearAddError("Some fields are incorrect. Please fix them before continuing.");
		} else if (!this.state.passwordLinked) {
			this.errors.clearAddError("You don't have a password set.");
		} else {
			this.errors.clearErrors();
			const newPassword = this.state.newPassword;
			io.getSocket(socket => {
				socket.emit("users.updatePassword", newPassword, res => {
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
		const linkPassword = <button key="linkPassword">TODO</button>;
		const linkGitHub = <a key="linkGitHub" href="http://localhost:8080/auth/github/link">Link GitHub to account</a>;
		const unlinkGitHub = (<button key="unlinkGitHub" onClick={ this.unlinkGitHub }>
				Remove logging in with GitHub
			</button>);
		const unlinkPassword = (<button key="unlinkPassword" onClick={ this.unlinkPassword }>
			Remove logging in with password
		</button>);
		if (this.state.passwordLinked && this.state.gitHubLinked) {
			return [unlinkGitHub, unlinkPassword];
		} else if (!this.state.passwordLinked) {
			return linkPassword;
		} return linkGitHub;
	};

	validationCallback = CustomInput.validationCallback(this);

	render() {
		return (
			<div>
				<CustomErrors onRef={ ref => (this.errors = ref) } />
				<div>
					<h2>General</h2>
					<CustomInput label="Email" placeholder="Email" inputType="email" type="email" name="email" value={ this.state.email } customInputEvents={ { onChange: event => this.updateField("email", event) } } validationCallback={ this.validationCallback } onRef={ ref => (this.customInputs.email = ref) } />
					<CustomInput label="Username" placeholder="Username" inputType="text" type="username" name="username" value={ this.state.username } customInputEvents={ { onChange: event => this.updateField("username", event) } } validationCallback={ this.validationCallback } onRef={ ref => (this.customInputs.username = ref) } />
					<button onClick={ this.saveChanges }>Save changes</button>
				</div>
				<div>
					<h2>Security</h2>
					<CustomInput label="New password" placeholder="New password" inputType="password" type="password" name="newPassword" value={ this.state.newPassword } customInputEvents={ { onChange: event => this.updateField("newPassword", event) } } validationCallback={ this.validationCallback } />
					<button onClick={ this.changePassword }>Change password</button>
					{ this.linkButtons() }
					<button onClick={ this.logOutEverywhere }>Log out everywhere</button>
				</div>
			</div>
		);
	}
}
