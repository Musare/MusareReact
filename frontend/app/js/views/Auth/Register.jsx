import React, { Component } from "react";

import CustomInput from "./CustomInput.jsx";
import CustomErrors from "./CustomErrors.jsx";

import io from "../../io";
import config from "../../../../config/default";

export default class Register extends Component {
	constructor() {
		super();

		this.state = {
			password: "",
			username: "",
			email: "",
			recaptcha: "",
			inputInvalid: {
				email: true,
				username: true,
				password: true,
			},
			errors: []
		};

		this.register = this.register.bind(this);
	}

	componentDidMount() {
		this.state.recaptcha = grecaptcha.render("recaptcha", {
			"sitekey": config.recaptcha.key,
		});
	}

	updateField(field, event) {
		this.setState({
			[field]: event.target.value,
		});
	}

	register() {
		if (CustomInput.hasInvalidInput(this.state.inputInvalid)) {
			alert("Input invalid. Fix before continuing.");
		} else {
			this.setState({ errors: [] });
			io.getSocket(socket => {
				socket.emit("users.register", this.state.username, this.state.email, this.state.password, grecaptcha.getResponse(this.state.recaptcha), res => {
					if (res.status === "success") {
						if (res.SID) {
							const date = new Date();
							date.setTime(new Date().getTime() + (2 * 365 * 24 * 60 * 60 * 1000));
							const secure = (config.cookie.secure) ? "secure=true; " : "";
							document.cookie = `SID=${ res.SID }; expires=${ date.toGMTString() }; domain=${ config.cookie.domain }; ${ secure }path=/`;
							location.reload(); // if we could avoid this, then that would be better
						} else {
							// redirect to login
						}
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
				<CustomInput label="Username" placeholder="Username" inputType="text" type="username" name="username" value={ this.state.username } customInputEvents={ { onChange: event => this.updateField("username", event) } } validationCallback={ this.validationCallback } />
				<CustomInput label="Password" placeholder="Password" inputType="password" type="password" name="password" value={ this.state.password } customInputEvents={ { onChange: event => this.updateField("password", event) } } validationCallback={ this.validationCallback } />
				<div id="recaptcha" />
				<p>By logging in/registering you agree to our <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>.</p>
				<button onClick={ this.register }>Register</button>
				<a href={ `${ config.serverDomain }/auth/github/authorize` } onClick={ this.githubRedirect }>
					<div className="icon">
						<img alt="GitHub Icon" src="/assets/images/social/github.svg" />
					</div>
					&nbsp;&nbsp;Login with GitHub
				</a>
			</div>
		);
	}
}
