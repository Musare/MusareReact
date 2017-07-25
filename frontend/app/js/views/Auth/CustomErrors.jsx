import React, { Component } from "react";
import PropTypes from "prop-types";

export default class CustomErrors extends Component {
	static propTypes = {
		errors: PropTypes.array,
	};

	static defaultProps = {
		errors: [],
	};

	listErrors = () => {
		let errors = this.props.errors;
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
