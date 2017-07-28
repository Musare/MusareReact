import React, { Component } from "react";
import PropTypes from "prop-types";
import reactTriggerChange from "react-trigger-change";

const regex = {
	azAZ09_: /^[A-Za-z0-9_]+$/,
	azAZ09: /^[A-Za-z0-9]+$/,
	az09_: /^[a-z0-9_]+$/,
	az09: /^[a-z0-9]+$/,
	emailSimple: /^[\x00-\x7F]+@[a-z0-9]+\.[a-z0-9]+(\.[a-z0-9]+)?$/,
	password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]/,
	ascii: /^[\x00-\x7F]+$/,
};

const isLength = (string, min, max) => {
	return !(typeof string !== "string" || string.length < min || string.length > max);
};

// TODO add features where inputs need to be the same

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
	uniqueCode: (value) => {
		const errors = [];
		if (!isLength(value, 8, 8)) errors.push("Code must be 8 characters long.");
		if (!regex.azAZ09.test(value)) errors.push("Invalid code format.");
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
		onRef: PropTypes.func,
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
		onRef: () => {},
	};

	static validationCallback = (ctx) => {
		return (name, invalid) => {
			const inputInvalid = ctx.state.inputInvalid;
			inputInvalid[name] = invalid;
			ctx.setState({ inputInvalid });
		};
	};

	static hasInvalidInput = (inputInvalid, properties) => {
		let invalid = false;
		if (properties) {
			properties.forEach((property) => {
				if (inputInvalid[property]) invalid = true;
			});
		} else {
			Object.keys((key) => {
				if (key) invalid = true;
			});
		}
		return invalid;
	};

	constructor(props) {
		super(props);

		this.state = {
			customInputEvents: props.customInputEvents,
			errors: "",
			value: props.value,
			validateOnChange: false,
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

	componentDidMount() {
		this.props.onRef(this);
	}
	componentWillUnmount() {
		this.props.onRef(null);
	}

	// Triggered when user stops focusing on the input element
	onBlurHandler = () => {
		this.validateInput();
	};

	// Triggered when the input element's value changes
	onChangeHandler = (event) => {
		this.setState({
			value: event.target.value,
		}, () => {
			if (this.state.validateOnChange === true) {
				this.setState({
					validateOnChange: false,
				});
				this.validateInput();
			}
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

	triggerChangeEvent = (validateOnChange) => {
		reactTriggerChange(this.inputElement);
		this.setState({ validateOnChange });
	};

	render() {
		return (
			<label htmlFor={ this.props.name }>
				<span>{ this.props.label }</span>
				<input
					placeholder={ this.props.placeholder }
					type={ this.props.inputType }
					name={ this.props.name }
					value={ this.props.value }
					className={ (this.state.errors.length > 0) ? "has-validation-errors" : "" }
					{ ...this.state.customInputEvents }
					ref={ (input) => this.inputElement = input }
				/>
				{ this.listErrors() }
			</label>
		);
	}
}
