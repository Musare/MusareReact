import React, { Component } from "react";
import PropTypes from "prop-types";

import io from "../../io";
import config from "../../../../config/default";

export default class Login extends Component {
	constructor() {
		super();

		this.state = {};

		this.logout = this.logout.bind(this);
	}

	logout() {
		io.getSocket(socket => {
			socket.emit("users.logout", res => {
				if (res.status === "success") {
					document.cookie = "SID=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
					location.reload(); // if we could avoid this, then that would be better
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
				<button onClick={ this.logout }>Logout</button>
			</div>
		);
	}
}
