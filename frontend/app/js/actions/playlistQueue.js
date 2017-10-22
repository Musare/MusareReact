export const SELECT_PLAYLIST = "SELECT_PLAYLIST";
export const DESELECT_PLAYLISTS = "DESELECT_PLAYLISTS";
export const ADD_SONG = "ADD_SONG";

export function selectPlaylist(playlistId) {
	return {
		type: SELECT_PLAYLIST,
		playlistId,
	};
}

export function deselectPlaylists() {
	return {
		type: DESELECT_PLAYLISTS,
	};
}

export function addSong(songId) {
	return {
		type: ADD_SONG,
		songId,
	};
}