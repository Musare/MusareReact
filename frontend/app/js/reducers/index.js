import { combineReducers } from "redux";
import user from "reducers/user";
import volume from "reducers/volume";

export default combineReducers({
	user,
	volume,
});
