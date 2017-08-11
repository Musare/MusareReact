import i18next from "i18next";
import XHR from 'i18next-xhr-backend';
import config from "config";

const i18n = i18next
	.use(XHR)
	.init({
		lng: "en",
		debug: true,
		fallbackLng: "en",
		referenceLng: "en",
		backend: {
			loadPath: '/locales/{{lng}}/{{ns}}.json',
			addPath: 'locales/add/{{lng}}/{{ns}}',
			allowMultiLoading: false,
			crossDomain: false,
			withCredentials: false,
			queryStringParams: { v: config.version }
		},
		ns: ["general"],
		defaultNS: "general",
		keySeparator: false, // we use content as keys
		interpolation: {
			escapeValue: false, // not needed for react!!
			formatSeparator: ",",
		},
		react: {
			wait: true,
		},
	});

export default i18n;
