import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import { translate } from "react-i18next";

@connect(state => ({
	user: {
		loggedIn: state.session.get("loggedIn")
	},
}))
@translate(["navbar"], { wait: true })
export default class Menu extends Component {
	static propTypes = {
		loggedIn: PropTypes.bool,
		t: PropTypes.func,
	};

	static defaultProps = {
		loggedIn: false,
		t: () => {},
	};

	constructor(props) {
		super(props);

		this.state = {
			showNavbar: false,
		};
	}

	getLink(to, text, canShow = true) {
		return (canShow) ? <NavLink to={ to } onClick={ this.closeNavbar } >{ text }</NavLink> : "";
	}

	toggleNavbar = () => {
		this.setState({
			showNavbar: !this.state.showNavbar,
		});
	}

	closeNavbar = () => {
		this.setState({
			showNavbar: false,
		});
	}

	render() {
		const { t } = this.props;

		return (
			<header>
				{this.getLink("/", <img src="/assets/images/wordmark-white.svg" />)}
				<button className="hamburger" onClick={ this.toggleNavbar }>
					<span></span>
					<span></span>
					<span></span>
				</button>
				<navbar className={ (this.state.showNavbar) ? "show" : "" }>
					{this.getLink("/", t("navbar:home"))}
					{this.getLink("/login", t("navbar:login"), !this.props.user.loggedIn)}
					{this.getLink("/register", t("navbar:register"), !this.props.user.loggedIn)}
					{this.getLink("/settings", t("navbar:settings"), this.props.user.loggedIn)}
					{this.getLink("/logout", t("navbar:logout"), this.props.user.loggedIn)}
				</navbar>
			</header>
		);
	}
}
