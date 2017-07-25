import React, { Component } from "react";
import PropTypes from "prop-types";

const regex = {
	azAZ09_: /^[A-Za-z0-9_]+$/,
	az09_: /^[a-z0-9_]+$/,
	emailSimple: /^[\x00-\x7F]+@[a-z0-9]+\.[a-z0-9]+(\.[a-z0-9]+)?$/,
	password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]/,
	ascii: /^[\x00-\x7F]+$/,
};

const isLength = (string, min, max) => {
	return !(typeof string !== "string" || string.length < min || string.length > max);
};

const validation = {
	username: (value) => {
		const errors = [];
		if (!isLength(value, 2, 32)) errors.push("Username must be between 2 and 32 characters long.");
		if (!regex.azAZ09_.test(value)) errors.push("Invalid username format. Allowed characters: a-z, A-Z, 0-9 and _.");
		return errors;
	},
	email: (value) => {
		const errors = [];
		if (!isLength(value, 3, 254)) errors.push("Email must be between 3 and 254 characters long.");
		if (value.indexOf("@") !== value.lastIndexOf("@") || !regex.emailSimple.test(value)) errors.push("Invalid email format.");
		return errors;
	},
	password: (value) => {
		const errors = [];
		if (!isLength(value, 6, 200)) errors.push("Password must be between 6 and 200 characters long.");
		if (!regex.password.test(value)) errors.push("Invalid password format.");
		return errors;
	},
};

export default class CustomInput extends Component {
	static propTypes = {
		type: PropTypes.string,
		inputType: PropTypes.string,
		name: PropTypes.string,
		value: PropTypes.string,
		label: PropTypes.string,
		placeholder: PropTypes.string,
		customInputEvents: PropTypes.object,
		validationCallback: PropTypes.func,
	};

	static defaultProps = {
		type: "text",
		inputType: "text",
		name: "",
		value: "",
		label: "",
		placeholder: "",
		customInputEvents: {},
		validationCallback: () => {},
	};

	static validationCallback = (ctx) => {
		return (name, invalid) => {
			const inputInvalid = ctx.state.inputInvalid;
			inputInvalid[name] = invalid;
			ctx.setState({ inputInvalid });
		};
	};

	static hasInvalidInput = (inputInvalid) => {
		let invalid = false;
		Object.values(inputInvalid).forEach((value) => {
			if (value) invalid = true;
		});
		return invalid;
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
		let key = 0;
		if (errors.length > 0) {
			errors = errors.map((error) => {
				key++;
				return (<li key={ key }>{ error }</li>);
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
		const errors = (validation[type]) ? validation[type](value) : [];
		this.setState({ errors });
		this.props.validationCallback(this.props.name, errors.length > 0);
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
