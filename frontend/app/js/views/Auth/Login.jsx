import React, { Component } from "react";

import CustomInput from "./CustomInput.jsx";
import CustomErrors from "./CustomErrors.jsx";

import io from "../../io";
import config from "../../../../config/default";

export default class Login extends Component {
	constructor() {
		super();

		this.state = {
			password: "",
			email: "",
			errors: [],
			inputInvalid: {
				email: true,
				password: true,
			},
		};

		this.login = this.login.bind(this);
	}

	updateField(field, event) {
		this.setState({
			[field]: event.target.value,
		});
	}

	login() {
		if (CustomInput.hasInvalidInput(this.state.inputInvalid)) {
			alert("Input invalid. Fix before continuing.");
		} else {
			this.setState({ errors: [] });
			io.getSocket(socket => {
				socket.emit("users.login", this.state.email, this.state.password, res => {
					if (res.status === "success") {
						const date = new Date();
						date.setTime(new Date().getTime() + (2 * 365 * 24 * 60 * 60 * 1000));
						const secure = (config.cookie.secure) ? "secure=true; " : "";
						let domain = "";
						if (config.cookie.domain !== "localhost") domain = ` domain=${ config.cookie.domain };`;
						document.cookie = `SID=${ res.SID }; expires=${ date.toGMTString() }; ${ domain }${ secure }path=/`;
						location.reload(); // if we could avoid this, then that would be better
					} else {
						this.setState({ errors: [res.message] });
					}
				});
			});
		}
	}

	githubRedirect() {
		localStorage.setItem("github_redirect", window.location.pathname);
	}

	validationCallback = CustomInput.validationCallback(this);

	render() {
		return (
			<div>
				<CustomErrors errors={ this.state.errors } />
				<CustomInput label="Email" placeholder="Email" inputType="email" type="email" name="email" value={ this.state.email } customInputEvents={ { onChange: event => this.updateField("email", event) } } validationCallback={ this.validationCallback } />
				<CustomInput label="Password" placeholder="Password" inputType="password" type="password" name="password" value={ this.state.password } customInputEvents={ { onChange: event => this.updateField("password", event) } } validationCallback={ this.validationCallback } />
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