import React, { Component } from "react";
import PropTypes from "prop-types";
const i18next = require("i18next");

const t = i18next.t;

const isLength = (string, min, max) => {
	return !(typeof string !== "string" || string.length < min || string.length > max);
};

const regex = {
	azAZ09_: /^[A-Za-z0-9_]+$/,
	azAZ09: /^[A-Za-z0-9]+$/,
	az09_: /^[a-z0-9_]+$/,
	az09: /^[a-z0-9]+$/,
	emailSimple: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-z0-9]+\.[a-z0-9]+(\.[a-z0-9]+)?$/,
	password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]/,
	ascii: /^[\x00-\x7F]+$/,
};

const dictionary = {
	username: {
		inputType: "text",
		minLength: 2,
		maxLength: 32,
		regex: regex.azAZ09_,
		errors: {
			format: t("general:invalidUsernameFormat", { characters: `a-z, A-Z, 0-9${ t("general:and") } _` }),
		},
	},
	email: {
		inputType: "email",
		minLength: 3,
		maxLength: 254,
		regex: regex.emailSimple,
		errors: {
			format: t("general:invalidEmailFormat"),
		},
	},
	password: {
		inputType: "password",
		minLength: 6,
		maxLength: 200,
		regex: regex.password,
		errors: {
			format: t("general:invalidPasswordFormat", { characters: "$@$!%*?&" }),
		},
	},
	uniqueCode: {
		inputType: "text",
		minLength: 8,
		maxLength: 8,
		regex: regex.azAZ09,
		errors: {
			length: t("general:invalidCodeLength", { length: 8 }),
			format: t("general:invalidCodeFormat"),
		},
	},
	stationName: {
		inputType: "text",
		minLength: 2,
		maxLength: 16,
		regex: regex.az09_,
		errors: {
			//format: t("general:invalidUsernameFormat", { characters: `a-z, A-Z, 0-9${ t("general:and") } _` }),
			format: t("general:invalidStationNameFormat", { characters: `a-z, 0-9${ t("general:and") } _` }),
		},
	},
	stationDisplayName: {
		inputType: "text",
		minLength: 2,
		maxLength: 32,
		regex: regex.azAZ09_,
		errors: {
			//format: t("general:invalidUsernameFormat", { characters: `a-z, A-Z, 0-9${ t("general:and") } _` }),
			format: t("general:invalidStationDisplayNameFormat", { characters: `a-z, A-Z, 0-9${ t("general:and") } _` }),
		},
	},
	stationDescription: {
		inputType: "text",
		minLength: 2,
		maxLength: 200,
		isTextarea: true,
		errors: {},
	},
};

export default class CustomInput extends Component {
	static propTypes = {
		type: PropTypes.string,
		name: PropTypes.string,
		label: PropTypes.string,
		//showLabel: PropTypes.boolean,
		placeholder: PropTypes.string,
		onRef: PropTypes.func,
	};

	static defaultProps = {
		type: "",
		name: "",
		label: "",
		//showLabel: true,
		placeholder: "",
		valid: false,
		onRef: () => {},
	};

	static initialize = (context) => {
		context.input = {}; // eslint-disable-line no-param-reassign
	};

	static hasInvalidInput = (input, properties) => {
		let invalid = false;
		if (properties) {
			properties.forEach((property) => {
				if (!input[property].isValid()) invalid = true;
			});
		} else {
			Object.keys(input).forEach((key) => {
				if (!input[key].isValid()) invalid = true;
			});
		}
		return invalid;
	};

	static isTheSame = (input, properties) => {
		let invalid = false;
		const value = input[properties[0]].getValue();
		properties.forEach((key) => {
			if (input[key].getValue() !== value) invalid = true;
		});
		return invalid;
	};

	constructor(props) {
		super(props);

		this.state = {
			inputType: dictionary[props.type].inputType,
			isTextarea: (typeof dictionary[props.type].isTextarea === "boolean") ? dictionary[props.type].isTextarea : false,
			value: "",
			original: "",
			errors: [],
			pristine: true,
			disabled: false,
			valid: false,
		};
		// More values/functions needs like isEmpty, isRequired
	}

	componentDidMount() {
		this.props.onRef(this);
	}
	componentWillUnmount() {
		this.props.onRef(null);
	}

	onBlur = () => {
		this.validate();
	};

	onFocus = () => {
		this.setState({
			pristine: false,
		});
	};

	onChange = (event) => {
		this.setState({
			value: event.target.value,
		});
	};

	setValue = (value, original = false) => {
		const state = {
			value,
		};
		if (original) state.original = value;
		this.setState(state);
	};

	getValue = () => {
		return this.state.value;
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

	isValid = () => {
		return this.state.valid;
	};

	isOriginal = () => {
		return this.state.original === this.state.value;
	};

	isPristine = () => {
		return this.state.pristine;
	};

	validate = (cb = () => {}) => {
		const errors = [];
		const info = dictionary[this.props.type];
		const value = this.state.value;
		if (!isLength(value, info.minLength, info.maxLength)) errors.push((info.errors.length) ? info.errors.length : t("general:valueMustBeBetween", { min: info.minLength, max: info.maxLength }));
		if (info.regex && !info.regex.test(value)) errors.push(info.errors.format);
		this.setState({
			errors,
			valid: errors.length === 0,
		}, cb);
	};

	render() {
		const ElementType = (!this.state.isTextarea) ? "input" : "textarea";

		return (
			<label htmlFor={ this.props.name }>
				{(this.props.showLabel) ? <span>{ this.props.label }</span> : null}
				<ElementType
					placeholder={ this.props.placeholder }
					type={ this.state.inputType }
					name={ this.props.name }
					value={ this.state.value }
					className={ (this.state.errors.length > 0) ? "has-validation-errors" : "" }
					onBlur={ this.onBlur }
					onFocus={ this.onFocus }
					onChange={ this.onChange }
					ref={ (input) => this.inputElement = input }
				/>
				{ this.listErrors() }
			</label>
		);
	}
}
