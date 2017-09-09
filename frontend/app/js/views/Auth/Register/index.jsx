import React, { Component } from "react";
import { NavLink } from "react-router-dom";

import CustomInput from "components/CustomInput.jsx";
import CustomMessages from "components/CustomMessages.jsx";
import PropTypes from "prop-types";
import { translate, Trans } from "react-i18next";

import io from "io";
import config from "config";

@translate(["register"], { wait: true })
export default class Register extends Component {
	static propTypes = {
		t: PropTypes.func,
	};

	static defaultProps = {
		t: () => {},
	};

	constructor() {
		super();

		CustomInput.initialize(this);

		this.state = {
			recaptcha: "",
		};
	}

	componentDidMount() {
		this.state.recaptcha = grecaptcha.render("recaptcha", {
			"sitekey": config.recaptcha.key,
		});
	}

	register = () => {
		this.messages.clearErrorSuccess();
		if (CustomInput.hasInvalidInput(this.input)) {
			this.messages.clearAddError(this.props.t("general:someFieldsAreIncorrectError"));
		} else {
			io.getSocket(socket => {
				socket.emit("users.register", this.input.username.getValue(), this.input.email.getValue(), this.input.password.getValue(), grecaptcha.getResponse(this.state.recaptcha), res => {
					if (res.status === "success") {
						if (res.SID) {
							const date = new Date();
							date.setTime(new Date().getTime() + (2 * 365 * 24 * 60 * 60 * 1000));
							const secure = (config.cookie.secure) ? "secure=true; " : "";
							document.cookie = `${ config.cookie.sidName }=${ res.SID }; expires=${ date.toGMTString() }; domain=${ config.cookie.domain }; ${ secure }path=/`;
							location.reload(); // if we could avoid this, then that would be better
						} else {
							// redirect to login
						}
					} else {
						this.messages.addError(res.message);
						grecaptcha.reset();
					}
				});
			});
		}
	};

	githubRedirect() {
		localStorage.setItem("github_redirect", window.location.pathname);
	}

	render() {
		const { t } = this.props;

		return (
			<main id="register">
				<h1>{ t("register:title") }</h1>
				<CustomMessages onRef={ ref => (this.messages = ref) } />
				<CustomInput type="email" name="email" label={ t("general:emailInput") } placeholder={ t("general:emailInput") } onRef={ ref => (this.input.email = ref) } />
				<CustomInput type="username" name="username" label={ t("general:usernameInput") } placeholder={ t("general:usernameInput") } onRef={ ref => (this.input.username = ref) } />
				<CustomInput type="password" name="password" label={ t("general:passwordInput") } placeholder={ t("general:passwordInput") } onRef={ ref => (this.input.password = ref) } />
				<div id="recaptcha" />
				<Trans i18nKey="register:byLoggingIn" parent="p">
					<NavLink to="/terms"> </NavLink>
					<NavLink to='/privacy'> </NavLink>
				</Trans>
				<button onClick={ this.register }>{ t("register:register") }</button>
				<a className="button gray-button" href={ `${ config.serverDomain }/auth/github/authorize` } onClick={ this.githubRedirect }>{ t("register:registerWithGitHub") }</a>
			</main>
		);
	}
}
