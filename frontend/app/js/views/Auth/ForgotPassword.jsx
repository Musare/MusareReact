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

		const resetCodeInput = <CustomInput key="resetCode" type="uniqueCode" name="resetCode" label="Reset code" placeholder="Reset code" onRef={ ref => (this.input.email = ref) } />;
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
			this.errors.clearAddError("Some fields are incorrect. Please fix them before continuing.");
		} else {
			this.errors.clearErrors();
			io.getSocket(socket => {
				socket.emit("users.requestPasswordReset", this.input.email.getValue(), res => {
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
		}
	};

	verifyResetCode = () => {
		if (CustomInput.hasInvalidInput(this.input, ["resetCode"])) {
			this.errors.clearAddError("Some fields are incorrect. Please fix them before continuing.");
		} else {
			this.errors.clearErrors();
			io.getSocket(socket => {
				socket.emit("users.verifyPasswordResetCode", this.input.resetCode.getValue(), res => {
					if (res.status === "success") {
						alert("Success!");
						this.setState({
							step: 3,
							resetCode: this.input.resetCode.getValue(),
						});
					} else {
						this.errors.addError(res.message);
					}
				});
			});
		}
	};

	changePassword = () => {
		if (CustomInput.hasInvalidInput(this.input, ["newPassword", "newPasswordAgain"])) {
			this.errors.clearAddError("Some fields are incorrect. Please fix them before continuing.");
		} else if (CustomInput.isTheSame(this.input, ["newPassword", "newPasswordAgain"])) {
			this.errors.clearAddError("New password and new password again need to be the same.");
		} else {
			this.errors.clearErrors();
			io.getSocket(socket => {
				socket.emit("users.changePasswordWithResetCode", this.state.resetCode, this.input.newPassword.getValue(), res => {
					if (res.status === "success") {
						alert("Success!");
						location.href = "/login";
					} else {
						this.errors.addError(res.message);
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
				<CustomErrors onRef={ ref => (this.errors = ref) } />
				{ this.getActions() }
			</div>
		);
	}
}
