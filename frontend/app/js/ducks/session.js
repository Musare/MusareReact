import { Map } from "immutable";

const LOGOUT = "SESSION::LOGOUT";
const LOGIN = "SESSION::LOGIN";
const BANNED = "SESSION::BANNED";
const UNBANNED = "SESSION::UNBANNED";

function logout() {
	return {
		type: LOGOUT,
	}
}

function login(loggedIn, userId, username, role) {
	return {
		type: LOGIN,
		loggedIn,
		userId,
		username,
		role,
	}
}

function banned(reason) {
	return {
		type: BANNED,
		reason,
	}
}

function unbanned() {
	return {
		type: UNBANNED,
	}
}

const initialState = Map({
	loggedIn: false,
	userId: "",
	username: "",
	role: "default",
	authProcessed: false,
	banned: {
		status: false,
		reason: "",
	},
});

function reducer(state = initialState, action) {
	switch (action.type) {
	case LOGOUT:
		return state.merge({
			loggedIn: initialState.get("loggedIn"),
			userId: initialState.get("userId"),
			username: initialState.get("username"),
			role: initialState.get("role"),
			authProcessed: false,
		});
	case LOGIN:
		const { loggedIn, userId, username, role } = action;
		if (loggedIn) {
			return state.merge({
				loggedIn: true,
				userId,
				username,
				role,
				authProcessed: true,
			});
		} else {
			return state.merge({
				authProcessed: true,
			});
		}
	case BANNED:
		const { reason } = action;
		return state.merge({
			banned: true,
			reason,
		});
	case UNBANNED:
		return state.merge({
			banned: false,
			reason: initialState.get("reason"),
		});
	}
	return state;
}

const actionCreators = {
	logout,
	login,
	banned,
	unbanned,
};

const actionTypes = {
	LOGOUT,
	LOGIN,
	BANNED,
	UNBANNED,
};

export {
	actionCreators,
	actionTypes,
};

export default reducer;