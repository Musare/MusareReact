import { combineReducers } from "redux";
import user from "reducers/user";
//import volume from "reducers/volume";
import songPlayer from "reducers/songPlayer";
import station from "reducers/station";
import stationOverlay from "reducers/stationOverlay";
import playlistQueue from "reducers/playlistQueue";
import volume from "../ducks/volume";

export default combineReducers({
	volume,
	user,
	songPlayer,
	station,
	stationOverlay,
	playlistQueue,
});
