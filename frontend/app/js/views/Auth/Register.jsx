import React, { Component } from "react";
import PropTypes from "prop-types";

import io from "../../io";
import config from "../../../../config/default";

export default class Register extends Component {
	static propTypes = {
		password: PropTypes.string,
		username: PropTypes.string,
		email: PropTypes.string,
		recaptcha: PropTypes.string,
	}

	constructor() {
		super();

		this.state = {
			password: "",
			username: "",
			email: "",
			recaptcha: "",
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
		io.getSocket(socket => {
			// if (!email || !username || !password) return Toast.methods.addToast('Please fill in all fields', 8000);
			// if (!validation.isLength(email, 3, 254)) return Toast.methods.addToast('Email must have between 3 and 254 characters.', 8000);
			// if (email.indexOf('@') !== email.lastIndexOf('@') || !validation.regex.emailSimple.test(email)) return Toast.methods.addToast('Invalid email format.', 8000);
			// if (!validation.isLength(username, 2, 32)) return Toast.methods.addToast('Username must have between 2 and 32 characters.', 8000);
			// if (!validation.regex.azAZ09_.test(username)) return Toast.methods.addToast('Invalid username format. Allowed characters: a-z, A-Z, 0-9 and _.', 8000);
			// if (!validation.isLength(password, 6, 200)) return Toast.methods.addToast('Password must have between 6 and 200 characters.', 8000);
			// if (!validation.regex.password.test(password)) return Toast.methods.addToast('Invalid password format. Must have one lowercase letter, one uppercase letter, one number and one special character.', 8000);
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
					// return res.message, temporarily:
					alert(res.message);
				}
			});
		});
	}

	render() {
		return (
			<div>
				<label htmlFor="email">Email</label>
				<input type="text" id="email" value={ this.state.email } onChange={ event => this.updateField("email", event) } />
				<label htmlFor="username">Username</label>
				<input type="text" id="username" value={ this.state.username } onChange={ event => this.updateField("username", event) } />
				<label htmlFor="password">Password</label>
				<input type="password" id="password" value={ this.state.password } onChange={ event => this.updateField("password", event) } />
				<div id="recaptcha" />
				<button onClick={ this.register }>Register</button>
			</div>
		);
	}
}
