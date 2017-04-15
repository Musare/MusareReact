import App from "views/App";

const errorLoading = error => {
	throw new Error(`Dynamic page loading failed: ${ error }`);
};

const loadRoute = cb => {
	return module => cb(null, module.default);
};

export default {
	path: "/",
	component: App,
	indexRoute: {
		getComponent(location, cb) {
			System.import("views/Home")
			.then(loadRoute(cb))
			.catch(errorLoading);
		},
	},
	childRoutes: [
		{
			path: "home",
			getComponent(location, cb) {
				System.import("views/Home")
					.then(loadRoute(cb, false))
					.catch(errorLoading);
			},
		},
		{
			path: "template",
			getComponent(location, cb) {
				System.import("views/Template")
					.then(loadRoute(cb, false))
					.catch(errorLoading);
			},
		},
		{
			path: "*",
			getComponent(location, cb) {
				System.import("views/NotFound")
					.then(loadRoute(cb))
					.catch(errorLoading);
			},
		},
	],
};
