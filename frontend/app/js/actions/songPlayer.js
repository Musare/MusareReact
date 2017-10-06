export const CHANGE_SONG = "CHANGE_SONG";
export const SET_TIME_ELAPSED = "SET_TIME_ELAPSED";
export const UPDATE_TIME_PAUSED = "UPDATE_TIME_PAUSED";

export function changeSong(song) {
	return {
		type: CHANGE_SONG,
		song,
	};
}
export function setTimeElapsed(paused, pausedAt) {
	return {
		type: SET_TIME_ELAPSED,
		paused,
		pausedAt,
	};
}
export function updateTimePaused(timePaused) {
	return {
		type: UPDATE_TIME_PAUSED,
		timePaused,
	};
}