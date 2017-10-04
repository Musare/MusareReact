import React, { Component } from "react";
import PropTypes from "prop-types";

const formatTime = (duration) => {
	let d = moment.duration(duration, "seconds");
	if (duration < 0) return "0:00";
	return ((d.hours() > 0) ? (d.hours() < 10 ? ("0" + d.hours() + ":") : (d.hours() + ":")) : "") + (d.minutes() + ":") + (d.seconds() < 10 ? ("0" + d.seconds()) : d.seconds());
};

export default class Time extends Component {
	static propTypes = {
		onRef: PropTypes.func,
	};

	static defaultProps = {
		onRef: () => {},
	};

	constructor(props) {
		super(props);

		this.state = {
			time: 0,
		};
	}

	componentDidMount() {
		this.props.onRef(this);
	}
	componentWillUnmount() {
		this.props.onRef(null);
	}

	formatTime = formatTime;
	static formatTime = formatTime;

	setTime = (time) => {
		this.setState({
			time,
		});
	};

	render() {
		return (
			<span>{ this.formatTime(this.state.time) }</span>
		);
	}
}
