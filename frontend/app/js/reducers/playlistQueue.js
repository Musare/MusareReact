import { Map } from "immutable";

import {
	SELECT_PLAYLIST,
	DESELECT_PLAYLISTS,
	ADD_SONG,
} from "actions/playlistQueue";

const initialState = Map({
	playlistSelected: null,
	addedSongId: null,
});

const actionsMap = {
	[SELECT_PLAYLIST]: (state, action) => {
		return state.merge({
			playlistSelected: action.playlistId,
		});
	},
	[DESELECT_PLAYLISTS]: (state, action) => {
		return state.merge({
			playlistSelected: null,
			addedSongId: null,
		});
	},
	[ADD_SONG]: (state, action) => {
		return state.merge({
			addedSongId: action.songId,
		});
	},
};

export default function reducer(state = initialState, action = {}) {
	const fn = actionsMap[action.type];
	return fn ? fn(state, action) : state;
}
