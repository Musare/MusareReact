import React, { Component } from "react";
import PropTypes from "prop-types";

export default class CustomErrors extends Component {
	static propTypes = {
		onRef: PropTypes.func,
	};

	static defaultProps = {
		onRef: () => {},
	};

	constructor() {
		super();

		this.state = {
			errors: [],
		};
	}

	componentDidMount() {
		this.props.onRef(this);
	}

	componentWillUnmount() {
		this.props.onRef(null);
	}

	clearErrors = () => {
		this.setState({
			errors: [],
		});
	};

	addError = (error) => {
		// TODO add error parsing, e.g. for arrays/objects
		this.setState({
			errors: this.state.errors.concat([error]),
		});
	};

	clearAddError = (error) => {
		this.setState({
			errors: [error],
		});
	};

	listErrors = () => {
		let errors = this.state.errors;
		let key = 0;
		if (errors.length > 0) {
			errors = errors.map((error) => {
				key++;
				return (<li key={ key }>{ error }</li>);
			});
			return (
				<div className="errors">
					<p>Something went wrong</p>
					<ul>
						{ errors }
					</ul>
				</div>
			);
		} return null;
	};

	render() {
		return this.listErrors();
	}
}
