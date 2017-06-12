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

export function authenticate(data) {
	return {
		type: AUTHENTICATE,
		data,
	};
}
