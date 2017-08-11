import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { translate } from "react-i18next";

import CustomInput from "components/CustomInput.jsx";
import CustomMessages from "components/CustomMessages.jsx";

import io from "io";

@connect(state => ({
	user: {
		userId: state.user.get("userId"),
	},
}))

@translate(["setPassword"], { wait: true })
export default class SetPassword extends Component {
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
			step: 1,
		};

		io.getSocket(socket => {
			socket.emit("users.findBySession", res => {
				if (res.status === "success") {
					this.setState({
						passwordLinked: res.data.password,
					});
				} else {
					this.messages.addError(this.props.t("general:notLoggedInError"));
				}
			});

			socket.on("event:user.linkPassword", () => {
				this.messages.clearAddInfo(this.props.t("setPassword:passwordHasBeenSet"));
				location.href = "/settings";
			});
		});
	}

	getActions = () => {
		const requestCodeButton = (<button key="requestCode" onClick={ this.requestCode }>
			{ this.props.t("setPassword:requestCode") }
		</button>);

		const codeInput = <CustomInput key="code" type="uniqueCode" name="code" label={ this.props.t("general:codeInput") } placeholder={ this.props.t("general:codeInput") } onRef={ ref => (this.input.code = ref) } />;
		const verifyCodeButton = (<button key="verifyCode" onClick={ this.verifyCode }>
			{ this.props.t("verifyCode") }
		</button>);

		const newPasswordInput = <CustomInput key="newPassword" type="password" name="newPassword" label={ this.props.t("general:newPasswordInput") } placeholder={ this.props.t("general:newPasswordInput") } onRef={ ref => (this.input.newPassword = ref) } />;
		const newPasswordAgainInput = <CustomInput key="newPasswordAgain" type="password" name="newPasswordAgain" label={ this.props.t("general:newPasswordAgainInput") } placeholder={ this.props.t("general:newPasswordAgainInput") } onRef={ ref => (this.input.newPasswordAgain = ref) } />;
		const setPassword = (<button key="setPassword" onClick={ this.setPassword }>
			{ this.props.t("setPassword:setPassword") }
		</button>);

		if (this.state.step === 1) {
			return [requestCodeButton];
		} if (this.state.step === 2) {
			return [codeInput, verifyCodeButton];
		} return [newPasswordInput, newPasswordAgainInput, setPassword];
	};

	setPassword = () => {
		this.messages.clearErrorSuccess();
		if (CustomInput.hasInvalidInput(this.input, ["newPassword", "newPasswordAgain"])) {
			this.messages.clearAddError(this.props.t("general:someFieldsAreIncorrectError"));
		} else if (CustomInput.isTheSame(this.input, ["newPassword", "newPasswordAgain"])) {
			this.messages.clearAddError(this.props.t("general:newPasswordNewPasswordAgainSameError"));
		} else {
			io.getSocket(socket => {
				socket.emit("users.changePasswordWithCode", this.state.code, this.input.newPassword.getValue(), res => {
					if (res.status === "success") {
						this.messages.clearAddSuccess(this.props.t("setPassword:successfullySetPassword"));
						location.href = "/settings";
					} else {
						this.messages.addError(res.message);
					}
				});
			});
		}
	};

	requestCode = () => {
		this.messages.clearErrorSuccess();
		io.getSocket(socket => {
			socket.emit("users.requestPassword", res => {
				if (res.status === "success") {
					this.messages.clearAddSuccess(this.props.t("setPassword:successfullyRequestedCode"));
					this.messages.clearAddInfo(this.props.t("setPassword:weHaveSentAUniqueCode"));
					this.setState({
						step: 2,
					});
				} else {
					this.messages.addError(res.message);
				}
			});
		});
	};

	verifyCode = () => {
		this.messages.clearErrorSuccess();
		if (CustomInput.hasInvalidInput(this.input, ["code"])) {
			this.messages.clearAddError(this.props.t("general:someFieldsAreIncorrectError"));
		} else {
			io.getSocket(socket => {
				socket.emit("users.verifyPasswordCode", this.input.code.getValue(), res => {
					if (res.status === "success") {
						this.messages.clearAddSuccess(this.props.t("setPassword:successfullyVerifiedCode"));
						this.setState({
							step: 3,
							code: this.input.code.getValue(),
						});
					} else {
						this.messages.addError(res.message);
					}
				});
			});
		}
	};

	render() {
		return (
			<div>
				<h1><h1>{ t("setPassword:title") }</h1></h1>
				<CustomMessages onRef={ ref => (this.messages = ref) } />
				{ this.getActions() }
			</div>
		);
	}
}
