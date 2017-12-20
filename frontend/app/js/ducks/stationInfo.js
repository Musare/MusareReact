import { Map, List } from "immutable";

const JOIN = "STATION_INFO::JOIN";
const LEAVE = "STATION_INFO::LEAVE";
const USER_LIST_UPDATE = "STATION_INFO::USER_LIST_UPDATE";
const USER_COUNT_UPDATE = "STATION_INFO::USER_COUNT_UPDATE";
const NAME_UPDATE = "STATION_INFO::NAME_UPDATE";
const DISPLAY_NAME_UPDATE = "STATION_INFO::DISPLAY_NAME_UPDATE";
const DESCRIPTION_UPDATE = "STATION_INFO::DESCRIPTION_UPDATE";
const MODE_UPDATE = "STATION_INFO::MODE_UPDATE";
const QUEUE_INDEX = "STATION_INFO::QUEUE_INDEX";
const QUEUE_UPDATE = "STATION_INFO::QUEUE_UPDATE";
const PAUSE = "STATION_INFO::PAUSE";
const RESUME = "STATION_INFO::RESUME";

function joinStation(station) {
	return {
		type: JOIN,
		station,
	}
}

function leaveStation() {
	return {
		type: LEAVE,
	}
}

function userListUpdate(userList) {
	return {
		type: USER_LIST_UPDATE,
		userList,
	}
}

function userCountUpdate(userCount) {
	return {
		type: USER_COUNT_UPDATE,
		userCount,
	}
}

function nameUpdate(name) {
	return {
		type: NAME_UPDATE,
		name,
	}
}

function displayNameUpdate(displayName) {
	return {
		type: DISPLAY_NAME_UPDATE,
		displayName,
	}
}

function descriptionUpdate(description) {
	return {
		type: DESCRIPTION_UPDATE,
		description,
	}
}

function modeUpdate(mode) {
	return {
		type: MODE_UPDATE,
		mode,
	}
}

function queueIndex(songList) {
	return {
		type: QUEUE_INDEX,
		songList,
	}
}

function queueUpdate(songList) {
	return {
		type: QUEUE_UPDATE,
		songList,
	}
}

function pause() {
	return {
		type: PAUSE,
	}
}

function resume() {
	return {
		type: RESUME,
	}
}



const initialState = Map({
	"stationId": "",
	"name": "",
	"displayName": "",
	"description": "",
	"privacy": "private",
	"type": "community",
	"ownerId": "",
	"paused": true,
	"mode": "",
	"userList": List([]),
	"userCount": 0,
	"songList": List([]),
	"privatePlaylist": "",
});

function reducer(state = initialState, action) {
	let name, displayName, description, mode, userList, userCount, songList;

	function getModeTemp(partyEnabled, queueLocked) {
		// If party enabled
		// If queue locked
		// Mode is DJ
		// If queue not locked
		// Mode party
		// If party not enabled
		// Mode is normal

		if (partyEnabled) {
			if (queueLocked) return "dj";
			else return "party";
		} else return "normal";
	}

	switch (action.type) {
	case JOIN:
		const { stationId, privacy, type, ownerId, paused } = action.station;
		name = action.station.name;
		displayName = action.station.displayName;
		description = action.station.description;
		userCount = action.station.userCount;

		return state.merge({
			stationId,
			name: action.station.name,
			displayName,
			description,
			privacy,
			type,
			ownerId,
			paused,
			mode: (getModeTemp(action.station.partyMode, action.station.locked)),
			userList: List(action.station.userList),
			userCount,
			songList: List(action.station.songList),
			privatePlaylist: action.station.privatePlaylist,
		});
	case LEAVE:
		return initialState;
	case USER_LIST_UPDATE:
		return state.merge({
			userList: List(action.userList),
		});
	case USER_COUNT_UPDATE:
		return state.merge({
			userCount: action.userCount,
		});
	case NAME_UPDATE:
		return state.merge({
			name: action.name,
		});
	case DISPLAY_NAME_UPDATE:
		return state.merge({
			displayName: action.displayName,
		});
	case DESCRIPTION_UPDATE:
		return state.merge({
			description: action.description,
		});
	case MODE_UPDATE:
		return state.merge({
			mode: action.mode,
		});
	case QUEUE_INDEX:
		return state.merge({
			songList: List(action.songList),
		});
	case QUEUE_UPDATE:
		return state.merge({
			songList: List(action.songList),
		});
	case PAUSE:
		return state.merge({
			paused: true,
		});
	case RESUME:
		return state.merge({
			paused: false,
		});
	}
	return state;
}

const actionCreators = {
	joinStation,
	leaveStation,
	userListUpdate,
	userCountUpdate,
	nameUpdate,
	displayNameUpdate,
	descriptionUpdate,
	modeUpdate,
	queueIndex,
	queueUpdate,
	pause,
	resume,
};

const actionTypes = {
	JOIN_STATION: JOIN,
	LEAVE_STATION: LEAVE,
	USER_LIST_UPDATE,
	USER_COUNT_UPDATE,
	NAME_UPDATE,
	DISPLAY_NAME_UPDATE,
	DESCRIPTION_UPDATE,
	MODE_UPDATE,
	QUEUE_INDEX,
	QUEUE_UPDATE,
	PAUSE,
	RESUME,
};

export {
	actionCreators,
	actionTypes,
};

export default reducer;