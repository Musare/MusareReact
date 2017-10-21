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
		isInput: true,
		regex: regex.azAZ09_,
		errors: {
			format: t("general:invalidUsernameFormat", { characters: `a-z, A-Z, 0-9${ t("general:and") } _` }),
		},
	},
	email: {
		inputType: "email",
		minLength: 3,
		maxLength: 254,
		isInput: true,
		regex: regex.emailSimple,
		errors: {
			format: t("general:invalidEmailFormat"),
		},
	},
	password: {
		inputType: "password",
		minLength: 6,
		maxLength: 200,
		isInput: true,
		regex: regex.password,
		errors: {
			format: t("general:invalidPasswordFormat", { characters: "$@$!%*?&" }),
		},
	},
	uniqueCode: {
		inputType: "text",
		minLength: 8,
		maxLength: 8,
		isInput: true,
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
		isInput: true,
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
		isInput: true,
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
	playlistDescription: {
		inputType: "text",
		minLength: 1,
		maxLength: 16,
		isInput: true,
		regex: regex.ascii,
		errors: {
			//format: t("general:invalidUsernameFormat", { characters: `a-z, A-Z, 0-9${ t("general:and") } _` }),
			format: "Only ascii is allowed",
		},
	},
	stationPrivacy: {
		isRadio: true,
		options: [
			{
				text: "Public - Lorem ipsum lorem ipsum lorem ipsum",
				value: "public",
			},
			{
				text: "Unlisted - Lorem ipsum lorem ipsum lorem ipsum",
				value: "unlisted",
			},
			{
				text: "Private - Lorem ipsum lorem ipsum lorem ipsum",
				value: "private",
			},
		],
	},
	stationMode: {
		isRadio: true,
		options: [
			{
				text: "Normal - Lorem ipsum lorem ipsum lorem ipsum",
				value: "normal",
			},
			{
				text: "Party - Lorem ipsum lorem ipsum lorem ipsum",
				value: "party",
			},
			{
				text: "DJ - Lorem ipsum lorem ipsum lorem ipsum",
				value: "dj",
			},
		],
	},
	youTubeSearchQuery: {
		inputType: "text",
		isInput: true,
	},
};

export default class CustomInput extends Component {
	static propTypes = {
		type: PropTypes.string,
		original: PropTypes.string,
		name: PropTypes.string,
		label: PropTypes.string,
		//showLabel: PropTypes.boolean,
		placeholder: PropTypes.string,
		onRef: PropTypes.func,
	};

	static defaultProps = {
		type: "",
		original: "",
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
			isInput: (typeof dictionary[props.type].isInput === "boolean") ? dictionary[props.type].isInput : false,
			isRadio: (typeof dictionary[props.type].isRadio === "boolean") ? dictionary[props.type].isRadio : false,
			options: (typeof dictionary[props.type].options === "object") ? dictionary[props.type].options : null,
			value: "",
			original: this.props.original,
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
		this.setState(state, () => {
			if (this.state.isRadio) {
				this.validate();
			}
		});
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
		if (!this.state.isRadio) {
			const errors = [];
			const info = dictionary[this.props.type];
			const value = this.state.value;
			if (!isLength(value, info.minLength, info.maxLength)) errors.push((info.errors.length) ? info.errors.length : t("general:valueMustBeBetween", {
				min: info.minLength,
				max: info.maxLength
			}));
			if (info.regex && !info.regex.test(value)) errors.push(info.errors.format);
			this.setState({
				errors,
				valid: errors.length === 0,
			}, cb);
		} else {
			this.setState({
				valid: this.state.value !== null,
			}, cb);
		}
	};

	componentWillMount() {
		if (this.props.original) {
			this.setValue(this.props.original, true);
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.original !== prevProps.original) {
			this.setValue(this.props.original, true);
		}
	}

	render() {
		if (this.state.isTextarea || this.state.isInput) {
			const ElementType = (this.state.isInput) ? "input" : "textarea";

			return (
				<label htmlFor={this.props.name}>
					{(this.props.showLabel) ? <span>{this.props.label}</span> : null}
					<ElementType
						placeholder={this.props.placeholder}
						type={this.state.inputType}
						name={this.props.name}
						value={this.state.value}
						className={(this.state.errors.length > 0) ? "has-validation-errors" : ""}
						onBlur={this.onBlur}
						onFocus={this.onFocus}
						onChange={this.onChange}
						ref={(input) => this.inputElement = input}
					/>
					{this.listErrors()}
				</label>
			);
		} else {
			let optionsArr = this.state.options.map((option) => {
				let checked = option.value === this.state.value;
				return (
					<label key={ option.value }>
						<input type="radio" name={ this.props.type } value={ option.value } checked={ checked } onChange={ this.onChange }/>
						<span>{ option.text }</span>
					</label>
				);
			});

			return (
				<label htmlFor={this.props.name}>
					{(this.props.showLabel) ? <span>{this.props.label}</span> : null}
					<div>
						{ optionsArr }
						{/*<ElementType
							placeholder={this.props.placeholder}
							type={this.state.inputType}
							name={this.props.name}
							value={this.state.value}
							className={(this.state.errors.length > 0) ? "has-validation-errors" : ""}
							onBlur={this.onBlur}
							onFocus={this.onFocus}
							onChange={this.onChange}
							ref={(input) => this.inputElement = input}
						/>*/}
					</div>
					{this.listErrors()}
				</label>
			);
		}
	}
}
