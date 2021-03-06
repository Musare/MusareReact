import { Map } from "immutable";

import {
	BAN,
	AUTHENTICATE,
} from "actions/auth";

const initialState = Map({
	loggedIn: false,
	authProcessed: false,
	role: "default",
	username: "",
	userId: "",
	banned: {
		status: false,
		reason: "",
	},
});

const actionsMap = {
	[BAN]: (state, action) => {
		return Object.assign({}, state.toObject(), {
			banned: {
				status: true,
				reason: action.reason,
			},
		});
	},
	[AUTHENTICATE]: (state, action) => {
		return state.merge({
			loggedIn: action.data.loggedIn,
			authProcessed: true,
			role: action.data.role,
			username: action.data.username,
			userId: action.data.userId,
		});
	},
};

export default function reducer(state = initialState, action = {}) {
	const fn = actionsMap[action.type];
	return fn ? fn(state, action) : state;
}
