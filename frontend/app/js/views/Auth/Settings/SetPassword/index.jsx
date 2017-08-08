import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import CustomInput from "components/CustomInput.jsx";
import CustomErrors from "components/CustomErrors.jsx";

import io from "io";

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
			step: 1,
		};

		io.getSocket(socket => {
			socket.emit("users.findBySession", res => {
				if (res.status === "success") {
					this.setState({
						passwordLinked: res.data.password,
					});
				} else {
					this.errors.addError("You are currently not logged in.");
				}
			});

			socket.on("event:user.linkPassword", () => {
				alert("A password for your account has been set. We will now redirect you to the settings page.");
				location.href = "/settings";
			});
		});
	}

	getActions = () => {
		const requestCodeButton = (<button key="requestCode" onClick={ this.requestCode }>
			Request code
		</button>);

		const codeInput = <CustomInput key="code" type="uniqueCode" name="code" label="Code" placeholder="Code" onRef={ ref => (this.input.code = ref) } />;
		const verifyCodeButton = (<button key="verifyCode" onClick={ this.verifyCode }>
			Verify code
		</button>);

		const newPasswordInput = <CustomInput key="newPassword" type="password" name="newPassword" label="New password" placeholder="New password" onRef={ ref => (this.input.newPassword = ref) } />;
		const newPasswordAgainInput = <CustomInput key="newPasswordAgain" type="password" name="newPasswordAgain" label="New password again" placeholder="New password again" onRef={ ref => (this.input.newPasswordAgain = ref) } />;
		const setPassword = (<button key="setPassword" onClick={ this.setPassword }>
			Change password
		</button>);

		if (this.state.step === 1) {
			return [requestCodeButton];
		} if (this.state.step === 2) {
			return [codeInput, verifyCodeButton];
		} return [newPasswordInput, newPasswordAgainInput, setPassword];
	};

	setPassword = () => {
		if (CustomInput.hasInvalidInput(this.input, ["newPassword", "newPasswordAgain"])) {
			this.errors.clearAddError("Some fields are incorrect. Please fix them before continuing.");
		} else if (CustomInput.isTheSame(this.input, ["newPassword", "newPasswordAgain"])) {
			this.errors.clearAddError("New password and new password again need to be the same.");
		} else {
			this.errors.clearErrors();
			io.getSocket(socket => {
				socket.emit("users.changePasswordWithCode", this.state.code, this.input.newPassword.getValue(), res => {
					if (res.status === "success") {
						alert("Success!");
						location.href = "/settings";
					} else {
						this.errors.addError(res.message);
					}
				});
			});
		}
	};

	requestCode = () => {
		this.errors.clearErrors();
		io.getSocket(socket => {
			socket.emit("users.requestPassword", res => {
				if (res.status === "success") {
					alert("Success!");
					this.setState({
						step: 2,
					});
				} else {
					this.errors.addError(res.message);
				}
			});
		});
	};

	verifyCode = () => {
		if (CustomInput.hasInvalidInput(this.input, ["code"])) {
			this.errors.clearAddError("Some fields are incorrect. Please fix them before continuing.");
		} else {
			this.errors.clearErrors();
			io.getSocket(socket => {
				socket.emit("users.verifyPasswordCode", this.input.code.getValue(), res => {
					if (res.status === "success") {
						alert("Success!");
						this.setState({
							step: 3,
							code: this.input.code.getValue(),
						});
					} else {
						this.errors.addError(res.message);
					}
				});
			});
		}
	};

	render() {
		return (
			<div>
				<h1>Set Password</h1>
				<CustomErrors onRef={ ref => (this.errors = ref) } />
				{ this.getActions() }
			</div>
		);
	}
}
