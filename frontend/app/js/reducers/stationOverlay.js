import { Map } from "immutable";

import {
	OPEN_OVERLAY1,
	OPEN_OVERLAY2,
	OPEN_OVERLAY3,
	CLOSE_OVERLAY1,
	CLOSE_OVERLAY2,
	CLOSE_OVERLAY3,
} from "actions/stationOverlay";

const initialState = Map({
	overlay1: null,
	overlay2: null,
	overlay3: null,
	callback: null,
	extraProps2: null,
});

const actionsMap = {
	[OPEN_OVERLAY1]: (state, action) => {
		return state.merge({
			overlay1: action.overlay,
		});
	},
	[OPEN_OVERLAY2]: (state, action) => {
		return state.merge({
			overlay2: action.overlay,
			extraProps2: action.extraProps,
		});
	},
	[OPEN_OVERLAY3]: (state, action) => {
		return state.merge({
			overlay3: action.overlay,
			callback: action.callback,
		});
	},
	[CLOSE_OVERLAY1]: (state, action) => {
		return state.merge({
			overlay1: null,
		});
	},
	[CLOSE_OVERLAY2]: (state, action) => {
		return state.merge({
			overlay2: null,
			callback: null,
		});
	},
	[CLOSE_OVERLAY3]: (state, action) => {
		return state.merge({
			overlay3: null,
		});
	},
};

export default function reducer(state = initialState, action = {}) {
	const fn = actionsMap[action.type];
	return fn ? fn(state, action) : state;
}
