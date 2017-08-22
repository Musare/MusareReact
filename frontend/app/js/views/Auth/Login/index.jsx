import React, { Component } from "react";
import { NavLink } from "react-router-dom";

import CustomInput from "components/CustomInput.jsx";
import CustomMessages from "components/CustomMessages.jsx";
import PropTypes from "prop-types";
import { translate, Trans } from "react-i18next";

import "login.scss";

import io from "io";
import config from "config";

@translate(["login"], { wait: true })
export default class Login extends Component {
	static propTypes = {
		t: PropTypes.func,
	};

	static defaultProps = {
		t: () => {},
	};

	constructor() {
		super();

		CustomInput.initialize(this);
	}

	login = () => {
		this.messages.clearErrorSuccess();
		if (CustomInput.hasInvalidInput(this.input)) {
			this.messages.clearAddError(this.props.t("general:someFieldsAreIncorrectError"));
		} else {
			io.getSocket(socket => {
				socket.emit("users.login", this.input.email.getValue(), this.input.password.getValue(), res => {
					if (res.status === "success") {
						const date = new Date();
						date.setTime(new Date().getTime() + (2 * 365 * 24 * 60 * 60 * 1000));
						const secure = (config.cookie.secure) ? "secure=true; " : "";
						let domain = "";
						if (config.cookie.domain !== "localhost") domain = ` domain=${ config.cookie.domain };`;
						document.cookie = `${ config.cookie.sidName }=${ res.SID }; expires=${ date.toGMTString() }; ${ domain }${ secure }path=/`;
						location.reload(); // if we could avoid this, then that would be better
					} else {
						this.messages.addError(res.message);
					}
				});
			});
		}
	}

	githubRedirect() {
		localStorage.setItem("github_redirect", window.location.pathname);
	}

	render() {
		const { t } = this.props;

		return (
			<main>
				<h1>{ t("login:title") }</h1>
				<CustomMessages onRef={ ref => (this.messages = ref) } />
				<CustomInput type="email" name="email" label={ t("general:emailInput") } placeholder={ t("general:emailInput") } onRef={ ref => (this.input.email = ref) } />
				<CustomInput type="password" name="password" label={ t("general:passwordInput") } placeholder={ t("general:passwordInput") } onRef={ ref => (this.input.password = ref) } />
				<Trans i18nKey="login:byLoggingIn" parent="p">
					<NavLink to="/terms"> </NavLink>
					<NavLink to='/privacy'> </NavLink>
				</Trans>
				<button onClick={ this.login }>{ t("login:login") }</button>
				<a href={ `${ config.serverDomain }/auth/github/authorize` } className="button gray-button" onClick={ this.githubRedirect }>
					{ t("login:loginWithGitHub") }
				</a>
				<a href="/reset_password" className="button">{ t("login:forgotPassword") }</a>
			</main>
		);
	}
}
