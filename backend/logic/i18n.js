'use strict';

const async = require("async");
const i18next = require("i18next");
const Backend = require("i18next-sync-fs-backend");
const rootDir = __dirname.substr(0, __dirname.lastIndexOf("backend"));

let initialized = false;
let lockdown = false;

let i18n;

module.exports = {
	init: function(cb) {
		i18n = i18next
			.use(Backend)
			.init({
				lng: "en",
				debug: true,
				fallbackLng: "en",
				referenceLng: "en",
				backend: {
					loadPath: rootDir + "/locales/{{lng}}/{{ns}}.json",
				},
				ns: ["backend"],
				defaultNS: "backend",
				keySeparator: false, // we use content as keys
				interpolation: {
					escapeValue: false, // not needed for react!!
					formatSeparator: ",",
				},
			});

		initialized = true;
		if (lockdown) return this._lockdown();
		cb();
	},
	i18n,
	_lockdown: function() {
		lockdown = true;
	}
};
