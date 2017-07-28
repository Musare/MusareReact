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
			email: "",
			resetCode: "",
			newPassword: "",
			newPasswordAgain: "",
			inputInvalid: {
				email: true,
				resetCode: true,
				newPassword: true,
				newPasswordAgain: true,
			},
			errors: [],
		};
	}

	getActions = () => {
		const emailInput = <CustomInput key="email" label="Email" placeholder="Email" inputType="email" type="email" name="email" value={ this.state.email } customInputEvents={ { onChange: event => this.updateField("email", event) } } validationCallback={ this.validationCallback } />;
		const requestResetCodeButton = (<button key="requestResetCode" onClick={ this.requestResetCode }>
			Request reset code
		</button>);
		const iAlreadyHaveAResetCodeButton = (<button key="skipRequestResetCode" onClick={ this.skipRequestResetCode }>
			I already have a reset code
		</button>);

		const resetCodeInput = <CustomInput key="resetCode" label="Reset code" placeholder="Reset code" inputType="text" type="uniqueCode" name="resetCode" value={ this.state.resetCode } customInputEvents={ { onChange: event => this.updateField("resetCode", event) } } validationCallback={ this.validationCallback } />;
		const verifyResetCode = (<button key="verifyResetCode" onClick={ this.verifyResetCode }>
			Verify reset code
		</button>);

		const newPasswordInput = <CustomInput key="newPassword" label="New password" placeholder="New password" inputType="password" type="password" name="newPassword" value={ this.state.newPassword } customInputEvents={ { onChange: event => this.updateField("newPassword", event) } } validationCallback={ this.validationCallback } />;
		const newPasswordAgainInput = <CustomInput key="newPasswordAgain" label="New password again" placeholder="New password again" inputType="password" type="password" name="newPasswordAgain" value={ this.state.newPasswordAgain } customInputEvents={ { onChange: event => this.updateField("newPasswordAgain", event) } } validationCallback={ this.validationCallback } />;
		const changePassword = (<button key="changePassword" onClick={ this.changePassword }>
			Change password
		</button>);

		if (this.state.step === 1) {
			return [emailInput, requestResetCodeButton, iAlreadyHaveAResetCodeButton];
		} else if (this.state.step === 2) {
			return [resetCodeInput, verifyResetCode];
		} return [newPasswordInput, newPasswordAgainInput, changePassword];
	};

	validationCallback = CustomInput.validationCallback(this);

	requestResetCode = () => {
		if (CustomInput.hasInvalidInput(this.state.inputInvalid, ["email"])) {
			alert("Input invalid. Fix before continuing.");
		} else {
			this.setState({ errors: [] });
			io.getSocket(socket => {
				socket.emit("users.requestPasswordReset", this.state.email, res => {
					if (res.status === "success") {
						alert("Success!");
						this.setState({
							step: 2,
						});
					} else {
						this.setState({
							errors: this.state.errors.concat([res.message]),
						});
					}
				});
			});
		}
	};

	verifyResetCode = () => {
		if (CustomInput.hasInvalidInput(this.state.inputInvalid, ["resetCode"])) {
			alert("Input invalid. Fix before continuing.");
		} else {
			this.setState({ errors: [] });
			io.getSocket(socket => {
				socket.emit("users.verifyPasswordResetCode", this.state.resetCode, res => {
					if (res.status === "success") {
						alert("Success!");
						this.setState({
							step: 3,
						});
					} else {
						this.setState({
							errors: this.state.errors.concat([res.message]),
						});
					}
				});
			});
		}
	};

	changePassword = () => {
		if (CustomInput.hasInvalidInput(this.state.inputInvalid, ["newPassword", "newPasswordAgain"])) {
			alert("Input invalid. Fix before continuing.");
		} else if (this.state.newPassword !== this.state.newPasswordAgain) {
			alert("Passwords need to be the same.");
		} else {
			this.setState({ errors: [] });
			io.getSocket(socket => {
				socket.emit("users.changePasswordWithResetCode", this.state.resetCode, this.state.newPassword, res => {
					if (res.status === "success") {
						alert("Success!");
						location.href = "/login";
					} else {
						this.setState({
							errors: this.state.errors.concat([res.message]),
						});
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

	updateField(field, event) {
		this.setState({
			[field]: event.target.value,
		});
	}

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
				<CustomErrors errors={ this.state.errors } />
				{ this.getActions() }
			</div>
		);
	}
}
