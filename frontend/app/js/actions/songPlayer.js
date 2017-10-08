export const CHANGE_SONG = "CHANGE_SONG";
export const SET_TIME_ELAPSED = "SET_TIME_ELAPSED";
export const UPDATE_TIME_PAUSED = "UPDATE_TIME_PAUSED";
export const RECEIVED_RATINGS = "RECEIVED_RATINGS";
export const RECEIVED_OWN_RATINGS = "RECEIVED_OWN_RATINGS";

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
export function receivedRatings(likes, dislikes) {
	return {
		type: RECEIVED_RATINGS,
		likes, //TODO Check songId
		dislikes,
	};
}
export function receivedOwnRatings(liked, disliked) {
	return {
		type: RECEIVED_OWN_RATINGS,
		liked, //TODO Check songId
		disliked,
	};
}