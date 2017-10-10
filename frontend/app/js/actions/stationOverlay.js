export const OPEN_OVERLAY1 = "OPEN_OVERLAY1";
export const OPEN_OVERLAY2 = "OPEN_OVERLAY2";
export const CLOSE_OVERLAY1 = "CLOSE_OVERLAY1";
export const CLOSE_OVERLAY2 = "CLOSE_OVERLAY2";

export function openOverlay1(overlay) {
	return {
		type: OPEN_OVERLAY1,
		overlay,
	};
}
export function openOverlay2(overlay, extraProps) {
	return {
		type: OPEN_OVERLAY2,
		overlay,
		extraProps,
	};
}
export function closeOverlay1() {
	return {
		type: CLOSE_OVERLAY1,
	};
}
export function closeOverlay2() {
	return {
		type: CLOSE_OVERLAY2,
		extraValue: null,
	};
}
