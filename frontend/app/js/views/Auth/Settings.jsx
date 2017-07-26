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
			errors: [],
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
					this.state.errors = ["You are currently not logged in."];
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
			alert("Input invalid. Fix before continuing.");
		} else if (this.isTheSame("username") && this.isTheSame("email")) {
			alert("Nothing has changed.");
		} else {
			this.setState({ errors: [] });
			const email = this.state.email;
			const username = this.state.username;
			io.getSocket(socket => {
				if (!this.isTheSame("email")) {
					socket.emit("users.updateEmail", this.props.user.userId, email, res => {
						if (res.status === "success") {
							alert("Success!");
						} else {
							this.setState({
								errors: this.state.errors.concat([res.message]),
							});
						}
					});
				}

				if (!this.isTheSame("username")) {
					socket.emit("users.updateUsername", this.props.user.userId, username, res => {
						if (res.status === "success") {
							alert("Success!");
						} else {
							this.setState({
								errors: this.state.errors.concat([res.message]),
							});
						}
					});
				}
			});
		}
	};

	changePassword = () => {
		if (CustomInput.hasInvalidInput(this.state.inputInvalid, ["newPassword"])) {
			alert("Input invalid. Fix before continuing.");
		} else if (!this.state.passwordLinked) {
			alert("You don't have a password yet");
		} else {
			this.setState({ errors: [] });
			const newPassword = this.state.newPassword;
			io.getSocket(socket => {
				socket.emit("users.updatePassword", newPassword, res => {
					if (res.status === "success") {
						alert("Success!");
					} else {
						this.setState({
							errors: this.state.errors.concat([res.message]),
						});
					}
				});
			});
		}
	};

	validationCallback = CustomInput.validationCallback(this);

	render() {
		return (
			<div>
				<CustomErrors errors={ this.state.errors } />
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
					<button>Link GitHub account</button>
					<button>Log out everywhere</button>
				</div>
			</div>
		);
	}
}
