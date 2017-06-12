export const INCREMENT = "INCREMENT";
export const BAN = "BAN";
export const AUTHENTICATE = "AUTHENTICATE";

export function increment() {
	return {
		type: INCREMENT,
	};
}

export function ban(reason) {
	return {
		type: BAN,
		reason,
	};
}

export function authenticate(loggedIn, role, username, userId) {
	return {
		type: AUTHENTICATE,
		loggedIn,
		role,
		username,
		userId,
	};
}
