export const INITIALIZE_STATION = "INITIALIZE_STATION";
export const PAUSE_STATION = "PAUSE_STATION";
export const RESUME_STATION = "RESUME_STATION";
export const LEAVE_STATION = "LEAVE_STATION";

export function initializeStation(station) {
	return {
		type: INITIALIZE_STATION,
		station,
	};
}
export function pauseStation(pausedAt) {
	return {
		type: PAUSE_STATION,
		pausedAt,
	};
}
export function resumeStation() {
	return {
		type: RESUME_STATION,
	};
}
export function leaveStation() {
	return {
		type: LEAVE_STATION,
	};
}