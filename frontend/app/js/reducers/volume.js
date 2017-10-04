import { Map } from "immutable";

import {
	INITIALIZE,
	CHANGE_VOLUME,
	CHANGE_VOLUME_MUTED,
} from "actions/volume";

const initialState = Map({
	volume: 0,
	muted: false, //TODO Store muted and initialize it
});

const actionsMap = {
	[INITIALIZE]: (state, action) => {
		return state.merge({
			volume: action.volume,
		});
	},
	[CHANGE_VOLUME]: (state, action) => {
		return state.merge({
			volume: action.volume,
		});
	},
	[CHANGE_VOLUME_MUTED]: (state, action) => {
		return state.merge({
			muted: action.muted,
		});
	},
};

export default function reducer(state = initialState, action = {}) {
	const fn = actionsMap[action.type];
	return fn ? fn(state, action) : state;
}
