import { Map, List, fromJS } from "immutable";

const STATION_INDEX = "HOMEPAGE::STATION_INDEX";
const STATION_CREATE = "HOMEPAGE::STATION_CREATE";
const STATION_REMOVE = "HOMEPAGE::STATION_REMOVE";
const STATION_SONG_UPDATE = "HOMEPAGE::STATION_SONG_UPDATE";
const STATION_USER_COUNT_UPDATE = "HOMEPAGE::STATION_USER_COUNT_UPDATE";

function stationIndex(stations) {
	return {
		type: STATION_INDEX,
		stations,
	}
}

function stationCreate(station) {
	return {
		type: STATION_CREATE,
		station,
	}
}

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
	function updateStationById(stationId, cb) {
		function byType(type) {
			const index = state.getIn(["stations", type]).findIndex(function (station) {
				return station.get("stationId") === stationId;
			});
			if (index === -1) return null;
			state = state.updateIn(["stations", type], (list) => {
				cb(list, index);
			});
		}
		byType("official");
		byType("community");
	}

	const { stationId, stations, station } = action;

	switch (action.type) {
	case STATION_INDEX:
		state = Map({
			stations: Map({
				official: List([]),
				community: List([]),
			}),
		});
		stations.forEach((station) => {
			station.stationId = station._id;
			delete station._id;
			state = state.updateIn(["stations", station.type], (stations) => {
				return stations.push(fromJS(station));
			});
		});
		return state;
	case STATION_CREATE:
		state = state.updateIn(["stations", station.type], (list) => {
			return list.push(station);
		});
		return state;
	case STATION_REMOVE:
		updateStationById(stationId, (list, index) => {
			list.delete(index);
		});
		return state;
	case STATION_SONG_UPDATE:
		const { thumbnail } = action;
		updateStationById(stationId, (list, index) => {
			list.update(index, station => {
				return station.set("thumbnail", thumbnail);
			});
		});
		return state;
	case STATION_USER_COUNT_UPDATE:
		const { userCount } = action;
		updateStationById(stationId, (list, index) => {
			list.update(index, station => {
				return station.set("userCount", userCount);
			});
		});
		return state;
	}
	return state;
}

const actionCreators = {
	stationIndex,
	stationCreate,
	stationRemove,
	stationSongUpdate,
	stationUserCountUpdate,
};

const actionTypes = {
	STATION_REMOVE,
	STATION_SONG_UPDATE,
	STATION_USER_COUNT_UPDATE,
};

export {
	actionCreators,
	actionTypes,
};

export default reducer;