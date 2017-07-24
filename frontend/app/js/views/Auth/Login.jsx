import React, { Component } from "react";

import io from "../../io";
import config from "../../../../config/default";

export default class Login extends Component {
	constructor() {
		super();

		this.state = {
			password: "",
			email: "",
		};

		this.login = this.login.bind(this);
	}

	updateField(field, event) {
		this.setState({
			[field]: event.target.value,
		});
	}

	login() {
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
					// return res.message, temporarily:
					alert(res.message); // eslint-disable-line no-alert
				}
			});
		});
	}

	githubRedirect() {
		localStorage.setItem("github_redirect", window.location.pathname);
	}

	render() {
		return (
			<div>
				<label htmlFor="email">Email</label>
				<input type="text" id="email" value={ this.state.email } onChange={ event => this.updateField("email", event) } />
				<label htmlFor="password">Password</label>
				<input type="password" id="password" value={ this.state.password } onChange={ event => this.updateField("password", event) } />
				<p>By logging in/registering you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.</p>
				<button onClick={ this.login }>Login</button>
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
