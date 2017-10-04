import React, { Component } from "react";
import PropTypes from "prop-types";

export default class Seekerbar extends Component {
	static propTypes = {
		onRef: PropTypes.func,
	};

	static defaultProps = {
		onRef: () => {},
	};

	constructor(props) {
		super(props);

		this.state = {
			timeTotal: 0,
			timeElapsed: 0,
			timeElapsedGuess: 0,
			percentage: 0,
		};

		setInterval(() => {
			let timeElapsedGuess = this.state.timeElapsedGuess;
			timeElapsedGuess += 15;

			if (timeElapsedGuess <= this.state.timeElapsed) {
				timeElapsedGuess = this.state.timeElapsed;
			}

			this.setState({
				percentage: (timeElapsedGuess / this.state.timeTotal) * 100,
				timeElapsedGuess,
			});
		}, 50);
	}

	componentDidMount() {
		this.props.onRef(this);
	}
	componentWillUnmount() {
		this.props.onRef(null);
	}

	setTime = (timeTotal) => {
		this.setState({
			timeTotal: timeTotal * 1000,
			timeElapsed: 0,
		});
	};

	setTimeElapsed = (time) => {
		this.setState({
			timeElapsed: time * 1000,
		});
	};

	render() {
		return (
			<span style={{"width": this.state.percentage + "%", "background-color": "blue", "height": "100%", "display": "inline-block"}}/>
		);
	}
}
