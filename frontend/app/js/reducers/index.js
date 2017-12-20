import { combineReducers } from "redux";
//import user from "reducers/user";
//import volume from "reducers/volume";
//import songPlayer from "reducers/songPlayer";
//import station from "reducers/station";
import stationOverlay from "reducers/stationOverlay";
//import playlistQueue from "reducers/playlistQueue";
import homepage from "../ducks/homepage";
import session from "../ducks/session";
import volume from "../ducks/volume";
import stationCurrentSong from "../ducks/stationCurrentSong";
import stationInfo from "../ducks/stationInfo";
import stationPlaylists from "../ducks/stationPlaylists";

export default combineReducers({
	volume,
	homepage,
	session,
	//user,
	//songPlayer,
	//station,
	stationOverlay,
	//playlistQueue,
	station: combineReducers({
		info: stationInfo,
		currentSong: stationCurrentSong,
		playlists: stationPlaylists,
	}),
});
