import { Map } from "immutable";

import {
	CHANGE_SONG,
	SET_TIME_ELAPSED,
	UPDATE_TIME_PAUSED,
} from "actions/songPlayer";

const initialState = Map({
	simple: true,
	exists: false,
	title: "",
	artists: [],
	duration: 0,
	skipDuration: 0,
	songId: "",
	dislikes: 0,
	likes: 0,
	startedAt: 0,
	timePaused: 0,
	timeElapsed: 0,
});

const actionsMap = {
	[CHANGE_SONG]: (state, action) => {
		let obj = {};
		let exists = !!action.song;
		obj.simple = (exists) ? (action.song.likes === -1 && action.song.dislikes === -1) : true;
		obj.exists = exists;
		if (exists) {
			obj.title = action.song.title;
			obj.artists = action.song.artists;
			obj.duration = action.song.duration;
			obj.skipDuration = action.song.skipDuration;
			obj.songId = action.song.songId;
			obj.dislikes = action.song.dislikes;
			obj.likes = action.song.likes;
			obj.startedAt = action.song.startedAt;
			obj.timePaused = action.song.timePaused;
			obj.timeElapsed = 0;
		} else {
			obj = initialState;
		}

		return state.merge(obj);
	},
	[SET_TIME_ELAPSED]: (state, action) => {
		let timePausedNow = 0;
		if (action.paused) timePausedNow = Date.now() - action.pausedAt;
		return state.merge({
			timeElapsed: (Date.now() - state.get("startedAt") - state.get("timePaused") - timePausedNow) / 1000,
		});
	},
	[UPDATE_TIME_PAUSED]: (state, action) => {
		return state.merge({
			timePaused: action.timePaused,
		});
	},
};

export default function reducer(state = initialState, action = {}) {
	const fn = actionsMap[action.type];
	return fn ? fn(state, action) : state;
}
