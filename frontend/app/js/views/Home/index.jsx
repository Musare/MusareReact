import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { increment } from "actions/app";

@connect(state => ({
	counter: state.app.get("counter"),
}))

export default class Home extends Component {
	static propTypes = {
		counter: PropTypes.number,
		dispatch: PropTypes.func,
	}

	static defaultProps = {
		counter: 0,
		dispatch: () => {},
	}

	constructor() {
		super();

		this.handleIncrement = this.handleIncrement.bind(this);
	}

	handleIncrement() {
		const { dispatch } = this.props;

		dispatch(increment());
	}

	render() {
		const {
			counter,
		} = this.props;

		return (
			<div>
				<h2>Welcome to Musare!</h2>
				<h3>{ counter }</h3>
				<button onClick={ this.handleIncrement }>
					Increase counter
				</button>
			</div>
		);
	}
}
