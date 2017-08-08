import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import CustomInput from "components/CustomInput.jsx";
import CustomErrors from "components/CustomMessages.jsx";

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
			step: 1,
			resetCode: "",
		};
	}

	getActions = () => {
		const emailInput = <CustomInput key="email" type="email" name="email" label="Email" placeholder="Email" onRef={ ref => (this.input.email = ref) } />;
		const requestResetCodeButton = (<button key="requestResetCode" onClick={ this.requestResetCode }>
			Request reset code
		</button>);
		const iAlreadyHaveAResetCodeButton = (<button key="skipRequestResetCode" onClick={ this.skipRequestResetCode }>
			I already have a reset code
		</button>);

		const resetCodeInput = <CustomInput key="resetCode" type="uniqueCode" name="resetCode" label="Reset code" placeholder="Reset code" onRef={ ref => (this.input.resetCode = ref) } />;
		const verifyResetCode = (<button key="verifyResetCode" onClick={ this.verifyResetCode }>
			Verify reset code
		</button>);

		const newPasswordInput = <CustomInput key="newPassword" type="password" name="newPassword" label="New password" placeholder="New password" onRef={ ref => (this.input.newPassword = ref) } />;
		const newPasswordAgainInput = <CustomInput key="newPasswordAgain" type="password" name="newPasswordAgain" label="New password again" placeholder="New password again" onRef={ ref => (this.input.newPasswordAgain = ref) } />;
		const changePassword = (<button key="changePassword" onClick={ this.changePassword }>
			Change password
		</button>);

		if (this.state.step === 1) {
			return [emailInput, requestResetCodeButton, iAlreadyHaveAResetCodeButton];
		} else if (this.state.step === 2) {
			return [resetCodeInput, verifyResetCode];
		} return [newPasswordInput, newPasswordAgainInput, changePassword];
	};

	requestResetCode = () => {
		if (CustomInput.hasInvalidInput(this.input, ["email"])) {
			this.messages.clearAddError("Some fields are incorrect. Please fix them before continuing.");
		} else {
			this.messages.clearAll();
			io.getSocket(socket => {
				socket.emit("users.requestPasswordReset", this.input.email.getValue(), res => {
					if (res.status === "success") {
						this.messages.clearAddSuccess("Successfully requested reset code.");
						this.messages.clearAddInfo("We have sent a unique reset code to your email address.");
						this.setState({
							step: 2,
						});
					} else {
						this.messages.addError(res.message);
					}
				});
			});
		}
	};

	verifyResetCode = () => {
		if (CustomInput.hasInvalidInput(this.input, ["resetCode"])) {
			this.messages.clearAddError("Some fields are incorrect. Please fix them before continuing.");
		} else {
			this.messages.clearErrors();
			io.getSocket(socket => {
				socket.emit("users.verifyPasswordResetCode", this.input.resetCode.getValue(), res => {
					if (res.status === "success") {
						this.messages.clearAddSuccess("Successfully verified reset code.");
						this.setState({
							step: 3,
							resetCode: this.input.resetCode.getValue(),
						});
					} else {
						this.messages.addError(res.message);
					}
				});
			});
		}
	};

	changePassword = () => {
		this.messages.clearErrorSuccess();
		if (CustomInput.hasInvalidInput(this.input, ["newPassword", "newPasswordAgain"])) {
			this.messages.clearAddError("Some fields are incorrect. Please fix them before continuing.");
		} else if (CustomInput.isTheSame(this.input, ["newPassword", "newPasswordAgain"])) {
			this.messages.clearAddError("New password and new password again need to be the same.");
		} else {
			io.getSocket(socket => {
				socket.emit("users.changePasswordWithResetCode", this.state.resetCode, this.input.newPassword.getValue(), res => {
					if (res.status === "success") {
						this.messages.clearAddSuccess("Successfully changed password. Redirecting you to the login page.");
						// TODO Maybe add 5s delay and replace location.href everywhere
						location.href = "/login";
					} else {
						this.messages.addError(res.message);
					}
				});
			});
		}
	};

	skipRequestResetCode = () => {
		this.setState({
			step: 2,
		});
	};

	render() {
		return (
			<div>
				<h1>Reset password</h1>
				<div className="steps">
					<span className={ `step-circle-1 ${ this.state.step === 1 ? "step-circle-active" : "" }` }>1</span>
					<span className="step-line-1" />
					<span className={ `step-circle-2 ${ this.state.step === 2 ? "step-circle-active" : "" }` }>2</span>
					<span className="step-line-2" />
					<span className={ `step-circle-3 ${ this.state.step === 3 ? "step-circle-active" : "" }` }>3</span>
				</div>
				<CustomErrors onRef={ ref => (this.messages = ref) } />
				{ this.getActions() }
			</div>
		);
	}
}
