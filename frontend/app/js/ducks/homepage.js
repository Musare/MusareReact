import { Map, List } from "immutable";

const STATION_REMOVE = "HOMEPAGE::STATION_REMOVE";
const STATION_SONG_UPDATE = "HOMEPAGE::STATION_SONG_UPDATE";
const STATION_USER_COUNT_UPDATE = "HOMEPAGE::STATION_USER_COUNT_UPDATE";

function stationRemove(stationId) {
	return {
		type: STATION_REMOVE,
		stationId,
	}
}

function stationSongUpdate(stationId, song) {
	return {
		type: STATION_SONG_UPDATE,
		stationId,
		thumbnail: song.thumbnail,
	}
}

function stationUserCountUpdate(stationId, userCount) {
	return {
		type: STATION_USER_COUNT_UPDATE,
		stationId,
		userCount,
	}
}



const initialState = Map({
	stations: Map({
		official: List([]),
		community: List([]),
	}),
});

function reducer(state = initialState, action) {
	switch (action.type) {
	case STATION_REMOVE:
		const { stationId } = action;
		const indexOfficial = state.getIn(["stations", "official"]).findIndex(function (station) {
			return station.get("stationId") === stationId;
		});
		if (indexOfficial > -1) {
			state.updateIn(["stations", "official"], (list) => {
				list.delete(indexOfficial);
			});
		}
		const indexCommunity = state.getIn(["stations", "community"]).findIndex(function (station) {
			return station.get("stationId") === stationId;
		});
		if (indexCommunity > -1) {
			state.updateIn(["stations", "community"], (list) => {
				list.delete(indexCommunity);
			});
		}

		return state;
	case STATION_SONG_UPDATE:
		/*return state.merge({
			muted: true,
		});*/
	case STATION_USER_COUNT_UPDATE:
		/*return state.merge({
			muted: false,
		});*/
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