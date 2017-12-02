import { Map } from "immutable";

const CHANGE_VOLUME_LOUDNESS = "VOLUME::CHANGE_VOLUME_LOUDNESS";
const MUTE_VOLUME = "VOLUME::MUTE_VOLUME";
const UNMUTE_VOLUME = "VOLUME::UNMUTE_VOLUME";

function changeVolumeLoudness(loudness) {
	return {
		type: CHANGE_VOLUME_LOUDNESS,
		loudness,
	}
}

function muteVolume() {
	return {
		type: MUTE_VOLUME,
	}
}

function unmuteVolume() {
	return {
		type: UNMUTE_VOLUME,
	}
}

const initialState = Map({
	loudness: 25,
	muted: false,
});

function reducer(state = initialState, action) {
	switch (action.type) {
	case CHANGE_VOLUME_LOUDNESS:
		const { loudness } = action;
		return state.merge({
			loudness,
		});
	case MUTE_VOLUME:
		return state.merge({
			muted: true,
		});
	case UNMUTE_VOLUME:
		return state.merge({
			muted: false,
		});
	}
	return state;
}

const actionCreators = {
	changeVolumeLoudness,
	muteVolume,
	unmuteVolume,
};

const actionTypes = {
	CHANGE_VOLUME_LOUDNESS,
	MUTE_VOLUME,
	UNMUTE_VOLUME,
};

export {
	actionCreators,
	actionTypes,
};

export default reducer;