import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { translate } from "react-i18next";

import CustomInput from "components/CustomInput.jsx";
import CustomErrors from "components/CustomMessages.jsx";

import io from "io";

@translate(["forgotPassword"], { wait: true })
export default class ForgotPassword extends Component {
	static propTypes = {
		t: PropTypes.func,
	};

	static defaultProps = {
		t: () => {},
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
		const emailInput = <CustomInput key="email" type="email" name="email" label={ this.props.t("general:emailInput") } placeholder={ this.props.t("general:emailInput") } onRef={ ref => (this.input.email = ref) } />;
		const requestResetCodeButton = (<button key="requestResetCode" onClick={ this.requestResetCode }>
			{ this.props.t("forgotPassword:requestResetCode") }
		</button>);
		const iAlreadyHaveAResetCodeButton = (<button key="skipRequestResetCode" onClick={ this.skipRequestResetCode }>
			{ this.props.t("forgotPassword:requestResetCode") }
		</button>);

		const resetCodeInput = <CustomInput key="resetCode" type="uniqueCode" name="resetCode" label={ this.props.t("general:resetCodeInput") } placeholder={ this.props.t("general:resetCodeInput") } onRef={ ref => (this.input.resetCode = ref) } />;
		const verifyResetCode = (<button key="verifyResetCode" onClick={ this.verifyResetCode }>
			{ this.props.t("forgotPassword:verifyResetCode") }
		</button>);

		const newPasswordInput = <CustomInput key="newPassword" type="password" name="newPassword" label={ this.props.t("general:newPasswordInput") } placeholder={ this.props.t("general:newPasswordInput") } onRef={ ref => (this.input.newPassword = ref) } />;
		const newPasswordAgainInput = <CustomInput key="newPasswordAgain" type="password" name="newPasswordAgain" label={ this.props.t("general:newPasswordAgainInput") } placeholder={ this.props.t("general:newPasswordAgainInput") } onRef={ ref => (this.input.newPasswordAgain = ref) } />;
		const changePassword = (<button key="changePassword" onClick={ this.changePassword }>
			{ this.props.t("forgotPassword:changePassword") }
		</button>);

		if (this.state.step === 1) {
			return [emailInput, requestResetCodeButton, iAlreadyHaveAResetCodeButton];
		} else if (this.state.step === 2) {
			return [resetCodeInput, verifyResetCode];
		} return [newPasswordInput, newPasswordAgainInput, changePassword];
	};

	requestResetCode = () => {
		if (CustomInput.hasInvalidInput(this.input, ["email"])) {
			this.messages.clearAddError(this.props.t("general:someFieldsAreIncorrectError"));
		} else {
			this.messages.clearAll();
			io.getSocket(socket => {
				socket.emit("users.requestPasswordReset", this.input.email.getValue(), res => {
					if (res.status === "success") {
						this.messages.clearAddSuccess(this.props.t("forgotPassword:successfullyRequestedResetCode"));
						this.messages.clearAddInfo(this.props.t("forgotPassword:weHaveSentAUniqueResetCode"));
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
			this.messages.clearAddError(this.props.t("general:someFieldsAreIncorrectError"));
		} else {
			this.messages.clearErrors();
			io.getSocket(socket => {
				socket.emit("users.verifyPasswordResetCode", this.input.resetCode.getValue(), res => {
					if (res.status === "success") {
						this.messages.clearAddSuccess(this.props.t("forgotPassword:successfullyVerifiedResetCode"));
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
			this.messages.clearAddError(this.props.t("general:someFieldsAreIncorrectError"));
		} else if (CustomInput.isTheSame(this.input, ["newPassword", "newPasswordAgain"])) {
			this.messages.clearAddError(this.props.t("general:newPasswordNewPasswordAgainSameError"));
		} else {
			io.getSocket(socket => {
				socket.emit("users.changePasswordWithResetCode", this.state.resetCode, this.input.newPassword.getValue(), res => {
					if (res.status === "success") {
						this.messages.clearAddSuccess(this.props.t("forgotPassword:successfullyChangedPassword"));
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
		const { t } = this.props;

		return (
			<div>
				<h1>{ t("forgotPassword:title") }</h1>
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
