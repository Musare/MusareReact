import React, { Component } from "react";

import CustomInput from "./CustomInput.jsx";
import CustomErrors from "./CustomErrors.jsx";

import io from "../../io";
import config from "../../../../config/default";

export default class Register extends Component {
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
		if (CustomInput.hasInvalidInput(this.input)) {
			this.errors.clearAddError("Some fields are incorrect. Please fix them before continuing.");
		} else {
			this.errors.clearErrors();
			io.getSocket(socket => {
				socket.emit("users.register", this.input.username.getValue(), this.input.email.getValue(), this.input.password.getValue(), grecaptcha.getResponse(this.state.recaptcha), res => {
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
						this.errors.addError(res.message);
					}
				});
			});
		}
	};

	githubRedirect() {
		localStorage.setItem("github_redirect", window.location.pathname);
	}

	render() {
		return (
			<div>
				<CustomErrors onRef={ ref => (this.errors = ref) } />
				<CustomInput type="email" name="email" label="Email" placeholder="Email" onRef={ ref => (this.input.email = ref) } />
				<CustomInput type="username" name="username" label="Username" placeholder="Username" onRef={ ref => (this.input.username = ref) } />
				<CustomInput type="password" name="password" label="Password" placeholder="Password" onRef={ ref => (this.input.password = ref) } />
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
