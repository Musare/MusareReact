import React, { Component } from "react";

import CustomInput from "components/CustomInput.jsx";
import CustomMessages from "components/CustomMessages.jsx";

import io from "io";
import config from "config";

export default class Login extends Component {
	constructor() {
		super();

		CustomInput.initialize(this);
	}

	login = () => {
		this.messages.clearErrorSuccess();
		if (CustomInput.hasInvalidInput(this.input)) {
			this.messages.clearAddError("Some fields are incorrect. Please fix them before continuing.");
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
		return (
			<div>
				<CustomMessages onRef={ ref => (this.messages = ref) } />
				<CustomInput type="email" name="email" label="Email" placeholder="Email" onRef={ ref => (this.input.email = ref) } />
				<CustomInput type="password" name="password" label="Password" placeholder="Password" onRef={ ref => (this.input.password = ref) } />
				<p>By logging in/registering you agree to our <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>.</p>
				<button onClick={ this.login }>Login</button>
				<a href={ `${ config.serverDomain }/auth/github/authorize` } onClick={ this.githubRedirect }>
					<img alt="GitHub Icon" src="/assets/images/social/github.svg" /> &nbsp;&nbsp;Login with GitHub
				</a>
				<a href="/reset_password">Forgot password?</a>
			</div>
		);
	}
}
