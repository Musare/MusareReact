import { combineReducers } from "redux";
import user from "reducers/user";
import volume from "reducers/volume";
import songPlayer from "reducers/songPlayer";
import station from "reducers/station";
import stationOverlay from "reducers/stationOverlay";
import playlistQueue from "reducers/playlistQueue";

export default combineReducers({
	user,
	volume,
	songPlayer,
	station,
	stationOverlay,
	playlistQueue,
});
