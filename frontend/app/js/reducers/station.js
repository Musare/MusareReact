import { Map } from "immutable";

import {
	INITIALIZE_STATION,
	PAUSE_STATION,
	RESUME_STATION,
	LEAVE_STATION,
} from "actions/station";

const initialState = Map({
	id: "",
	name: "",
	displayName: "",
	description: "",
	paused: true,
	pausedAt: 0,
	privacy: "public",
	type: "official",
	locked: false,
	partyMode: false,
	privatePlaylist: "",
	ownerId: "",
});

const actionsMap = {
	[INITIALIZE_STATION]: (state, action) => {
		return state.merge({
			id: action.station.stationId,
			name: action.station.name,
			displayName: action.station.displayName,
			description: action.station.description,
			paused: action.station.paused,
			pausedAt: action.station.pausedAt,
			privacy: action.station.privacy,
			type: action.station.type,
			locked: action.station.locked,
			partyMode: action.station.partyMode,
			privatePlaylist: action.station.privatePlaylist,
			ownerId: action.station.owner,
		});
	},
	[PAUSE_STATION]: (state, action) => {
		return state.merge({
			paused: true,
			pausedAt: action.pausedAt,
		});
	},
	[RESUME_STATION]: (state, action) => {
		return state.merge({
			paused: false,
		});
	},
	[LEAVE_STATION]: (state, action) => {
		return initialState;
	},
};

export default function reducer(state = initialState, action = {}) {
	const fn = actionsMap[action.type];
	return fn ? fn(state, action) : state;
}
