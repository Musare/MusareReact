export const INITIALIZE = "INITIALIZE";
export const CHANGE_VOLUME = "CHANGE_VOLUME";
export const CHANGE_VOLUME_MUTED = "CHANGE_VOLUME_MUTED";

export function initialize(volume) {
	return {
		type: INITIALIZE,
		volume,
	};
}

export function changeVolume(volume) {
	return {
		type: CHANGE_VOLUME,
		volume,
	};
}

export function changeVolumeMuted(muted) {
	return {
		type: CHANGE_VOLUME_MUTED,
		muted,
	};
}
