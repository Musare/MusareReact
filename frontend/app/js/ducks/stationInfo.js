import { Map, List } from "immutable";

const JOIN_STATION = "STATION_INFO::JOIN_STATION";
const LEAVE_STATION = "STATION_INFO::LEAVE_STATION";
const USER_LIST_UPDATE = "STATION_INFO::USER_LIST_UPDATE";
const USER_COUNT_UPDATE = "STATION_INFO::USER_COUNT_UPDATE";
const NAME_UPDATE = "STATION_INFO::NAME_UPDATE";
const DISPLAY_NAME_UPDATE = "STATION_INFO::DISPLAY_NAME_UPDATE";
const DESCRIPTION_UPDATE = "STATION_INFO::DESCRIPTION_UPDATE";
const MODE_UPDATE = "STATION_INFO::MODE_UPDATE";
const QUEUE_INDEX = "STATION_INFO::QUEUE_INDEX";
const QUEUE_UPDATE = "STATION_INFO::QUEUE_UPDATE";

function joinStation(station) {
	return {
		type: JOIN_STATION,
		station,
	}
}

function leaveStation() {
	return {
		type: LEAVE_STATION,
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
	case JOIN_STATION:
		const { stationId, privacy, type, ownerId, paused } = action.station;
		name = action.station.name;
		displayName = action.station.displayName;
		description = action.station.description;
		userCount = action.station.userCount;
		mode = (getModeTemp(action.station.partyMode, action.station.locked));

		userList = List([]);
		action.station.userList.forEach((user) => {
			userList.push(user);
		});

		songList = List([]);
		action.station.songList.forEach((song) => {
			songList.push(song);
		});

		return state.merge({
			stationId,
			name: action.station.name,
			displayName,
			description,
			privacy,
			type,
			ownerId,
			paused,
			mode,
			userList,
			userCount,
			songList,
		});
	case LEAVE_STATION:
		return initialState;
	case USER_LIST_UPDATE:
		userList = List([]);
		action.userList.forEach((user) => {
			userList.push(user);
		});

		state.set("userList", userList);
		return state;
	case USER_COUNT_UPDATE:
		userCount = action.userCount;

		state.set("userCount", userCount);
		return state;
	case NAME_UPDATE:
		name = action.name;

		state.set("name", name);
		return state;
	case DISPLAY_NAME_UPDATE:
		displayName = action.displayName;

		state.set("displayName", displayName);
		return state;
	case DESCRIPTION_UPDATE:
		description = action.description;

		state.set("description", description);
		return state;
	case MODE_UPDATE:
		mode = action.mode;

		state.set("mode", mode);
		return state;
	case QUEUE_INDEX:
		songList = List([]);
		action.songList.forEach((song) => {
			songList.push(song);
		});

		return state;
	case QUEUE_UPDATE:
		songList = List([]);
		action.songList.forEach((song) => {
			songList.push(song);
		});

		return state;
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
};

const actionTypes = {
	JOIN_STATION,
	LEAVE_STATION,
	USER_LIST_UPDATE,
	USER_COUNT_UPDATE,
	NAME_UPDATE,
	DISPLAY_NAME_UPDATE,
	DESCRIPTION_UPDATE,
	MODE_UPDATE,
	QUEUE_INDEX,
	QUEUE_UPDATE,
};

export {
	actionCreators,
	actionTypes,
};

export default reducer;