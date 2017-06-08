module.exports = {
	"extends": ["eslint-config-airbnb"],
	"parser": "babel-eslint",
	"settings": {
		"ecmascript": 6
	},
	"ecmaFeatures": {
		"jsx": true,
		"modules": true,
		"destructuring": true,
		"classes": true,
		"forOf": true,
		"blockBindings": true,
		"arrowFunctions": true
	},
	"env": {
		"browser": true
	},
	"globals": {
		"io": true,
		"grecaptcha": true
	},
	"rules": {
		"linebreak-style": ["error", "windows"],
		"arrow-body-style": 0,
		"arrow-parens": 0,
		"class-methods-use-this": 0,
		"func-names": 0,
		"indent": ["error", "tab"],
		"no-tabs": 0,
		"new-cap": 0,
		"no-plusplus": 0,
		"no-return-assign": 0,
		"quote-props": 0,
		"template-curly-spacing": [2, "always"],
		"comma-dangle": ["error", {
			"arrays": "always-multiline",
			"objects": "always-multiline",
			"imports": "always-multiline",
			"exports": "always-multiline",
			"functions": "never"
		}],
		"jsx-quotes": [2, "prefer-double"],
		"quotes": [2, "double"],
		"react/jsx-indent": [2, "tab"],
		"react/jsx-indent-props": [2, "tab"],
		"react/forbid-prop-types": 0,
		"react/jsx-curly-spacing": [2, "always"],
		"react/jsx-filename-extension": 0,
		"react/jsx-boolean-value": 0,
		"react/prefer-stateless-function": 0,
		"import/extensions": 0,
		"import/no-extraneous-dependencies": 0,
		"import/no-unresolved": 0,
		"import/prefer-default-export": 0
	}
}
