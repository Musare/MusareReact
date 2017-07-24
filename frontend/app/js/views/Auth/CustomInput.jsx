import React, { Component } from "react";
import PropTypes from "prop-types";

export default class CustomInput extends Component {
	static propTypes = {
		type: PropTypes.string,
		inputType: PropTypes.string,
		name: PropTypes.string,
		value: PropTypes.string,
		label: PropTypes.string,
		placeholder: PropTypes.string,
		customInputEvents: PropTypes.object,
	};

	static defaultProps = {
		type: "text",
		inputType: "text",
		name: "",
		value: "",
		label: "",
		placeholder: "",
		customInputEvents: {},
	};

	constructor(props) {
		super(props);

		this.state = {
			customInputEvents: props.customInputEvents,
			errors: "",
			value: props.value,
		};

		if (this.state.customInputEvents.onBlur) {
			const oldOnBlur = this.state.customInputEvents.onBlur;
			this.state.customInputEvents.onBlur = () => {
				this.onBlurHandler();
				oldOnBlur();
			};
		} else this.state.customInputEvents.onBlur = this.onBlurHandler;

		if (this.state.customInputEvents.onChange) {
			const oldOnChange = this.state.customInputEvents.onChange;
			this.state.customInputEvents.onChange = (event) => {
				this.onChangeHandler(event);
				oldOnChange(event);
			};
		} else this.state.customInputEvents.onChange = this.onChangeHandler;
	}

	onBlurHandler = () => {
		this.validateInput();
	};

	onChangeHandler = (event) => {
		this.setState({
			value: event.target.value,
		});
	};

	listErrors = () => {
		let errors = this.state.errors;
		if (errors.length > 0) {
			errors = errors.map((error) => {
				return (<li>{ error }</li>);
			});
			return (
				<ul className="validation-errors">
					{ errors }
				</ul>
			);
		} return "";
	};

	validateInput = () => {
		const value = this.state.value;
		const type = this.props.type;
		const errors = [];
		if (type === "email") {
			if (value.indexOf("@") === -1) {
				errors.push(`${ this.props.label } must have at least one @.`);
			} else if (value.lastIndexOf("@") !== value.indexOf("@")) {
				errors.push(`${ this.props.label } must not have more than one @.`);
			}
		} else if (type === "password") {
			if (value.length < 4) {
				errors.push(`${ this.props.label } must be at least 4 characters long.`);
			} else if (value.length > 10) {
				errors.push(`${ this.props.label } can't be more than 10 characters long.`);
			}
		}

		this.setState({ errors });
	};

	render() {
		return (
			<label htmlFor={ this.props.name }>
				<span>{ this.props.label }</span>
				<input
					placeholder={ this.props.placeholder }
					type={ this.props.inputType }
					name={ this.props.name }
					value={ this.state.value }
					className={ (this.state.errors.length > 0) ? "has-validation-errors" : "" }
					{ ...this.state.customInputEvents }
				/>
				{ this.listErrors() }
			</label>
		);
	}
}
