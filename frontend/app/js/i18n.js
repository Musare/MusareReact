import i18next from "i18next";
import XHR from "i18next-xhr-backend";
import config from "config";

const i18n = i18next
	.use(XHR)
	.init({
		lng: "en",
		debug: false,
		fallbackLng: "en",
		referenceLng: "en",
		backend: {
			loadPath: "https://translation.musare.com/{{lng}}/{{ns}}.json",
			//addPath: "https://translation.musare.com/add/{{lng}}/{{ns}}",
			allowMultiLoading: false,
			crossDomain: false,
			withCredentials: false,
			queryStringParams: { v: config.version },
		},
		ns: ["general"],
		defaultNS: "general",
		interpolation: {
			escapeValue: false, // not needed for react!!
			formatSeparator: ",",
		},
		react: {
			wait: true,
		},
	});

export default i18n;
