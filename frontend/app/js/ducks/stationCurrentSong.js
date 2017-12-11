import { Map, List } from "immutable";
import store from "../index.js";

function calculateTimeElapsed() {
	const state = store.getState();
	const
		paused		=	state.station.info.get("paused"),
		songId		=	state.station.currentSong.get("songId"),
		pausedAt	=	state.station.currentSong.getIn(["timings", "pausedAt"]),
		startedAt	=	state.station.currentSong.getIn(["timings", "startedAt"]),
		timePaused	=	state.station.currentSong.getIn(["timings", "timePaused"]);

	if (songId !== "") {
		let timePausedNow = (paused) ? Date.now() - pausedAt : 0;
		//TODO Fix this function. It's accurate, but sometimes if paused at the wrong moment (e.g. 10 seconds to the milisecond) the display can flicker between 9 and 10 seconds every .5s.
		return (Date.now() - startedAt - timePaused - timePausedNow) / 1000;
	} else return 0;
}

const NEXT_SONG = "STATION_CURRENT_SONG::NEXT_SONG";
const LIKE_UPDATE = "STATION_CURRENT_SONG::LIKE_UPDATE";
const DISLIKE_UPDATE = "STATION_CURRENT_SONG::DISLIKE_UPDATE";
const LIKED_UPDATE = "STATION_CURRENT_SONG::LIKED_UPDATE";
const DISLIKED_UPDATE = "STATION_CURRENT_SONG::DISLIKED_UPDATE";
const PAUSE_TIME = "STATION_CURRENT_SONG::PAUSE_TIME";
const RESUME_TIME = "STATION_CURRENT_SONG::RESUME_TIME";
const TIME_ELAPSED_UPDATE = "STATION_CURRENT_SONG::TIME_ELAPSED_UPDATE";

function nextSong(song) {
	return {
		type: NEXT_SONG,
		song,
	}
}

function likeUpdate(likes) {
	return {
		type: LIKE_UPDATE,
		likes,
	}
}

function dislikeUpdate(dislikes) {
	return {
		type: DISLIKE_UPDATE,
		dislikes,
	}
}

function likedUpdate(liked) {
	return {
		type: LIKED_UPDATE,
		liked,
	}
}

function dislikedUpdate(disliked) {
	return {
		type: DISLIKED_UPDATE,
		disliked,
	}
}

function pauseTime(pausedAt) {
	return {
		type: PAUSE_TIME,
		pausedAt,
	}
}

function resumeTime(timePaused) {
	return {
		type: RESUME_TIME,
		timePaused,
	}
}

function timeElapsedUpdate() {
	return {
		type: TIME_ELAPSED_UPDATE,
		timeElapsed: calculateTimeElapsed(),
	}
}



const initialState = Map({
	"songId": "",
	"timings": Map({
		"duration": 0,
		"skipDuration": 0,
		"timeElapsed": 0,
		"timePaused": 0,
		"pausedAt": 0,
		"startedAt": 0,
	}),
	"title": "",
	"artists": [],
	"thumbnail": "",
	"playlists": List([]),
	"ratings": Map({
		"enabled": false,
		"likes": 0,
		"dislikes": 0,
		"liked": false,
		"disliked": false,
	}),
});

function reducer(state = initialState, action) {
	switch (action.type) {
	case NEXT_SONG:
		const { song } = action;
		if (song === null) return initialState;
		//TODO Handle no song event / Song being null event (so no song)
		const previousState = state;
		state = initialState;

		return state.merge({
			songId: song.songId,
			timings: Map({
				duration: song.timings.duration,
				skipDuration: song.timings.skipDuration,
				timeElapsed: 0,
				pausedAt: previousState.getIn(["timings", "pausedAt"]),
				timePaused: song.timings.timePaused,
				startedAt: song.timings.startedAt,
			}),
			title: song.title,
			artists: List(song.artists),
			thumbnail: song.thumbnail,
			ratings: Map({
				enabled: !(song.ratings.likes === -1 && song.ratings.dislikes === -1),
				likes: song.ratings.likes,
				dislikes: song.ratings.dislikes,
				liked: false,
				disliked: false,
			}),
		});
	case LIKE_UPDATE:
		const { likes } = action;
		state = state.setIn(["ratings", "likes"], likes);
		return state;
	case DISLIKE_UPDATE:
		const { dislikes } = action;
		state = state.setIn(["ratings", "dislikes"], dislikes);
		return state;
	case LIKED_UPDATE:
		const { liked } = action;
		state = state.setIn(["ratings", "liked"], liked);
		return state;
	case DISLIKED_UPDATE:
		const { disliked } = action;
		state = state.setIn(["ratings", "disliked"], disliked);
		return state;
	case PAUSE_TIME:
		const { pausedAt } = action;
		state = state.setIn(["timings", "pausedAt"], pausedAt);
		return state;
	case RESUME_TIME:
		const { timePaused } = action;
		state = state.setIn(["timings", "timePaused"], timePaused);
		return state;
	case TIME_ELAPSED_UPDATE:
		const { timeElapsed } = action;
		return state.setIn(["timings", "timeElapsed"], timeElapsed);
	}
	return state;
}

const actionCreators = {
	nextSong,
	likeUpdate,
	dislikeUpdate,
	likedUpdate,
	dislikedUpdate,
	pauseTime,
	resumeTime,
	timeElapsedUpdate,
};

const actionTypes = {
	NEXT_SONG,
	LIKE_UPDATE,
	DISLIKE_UPDATE,
	LIKED_UPDATE,
	DISLIKED_UPDATE,
	PAUSE_TIME,
	RESUME_TIME,
	TIME_ELAPSED_UPDATE,
};

export {
	actionCreators,
	actionTypes,
};

export default reducer;