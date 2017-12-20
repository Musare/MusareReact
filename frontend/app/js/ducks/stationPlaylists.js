import { Map, List, fromJS } from "immutable";

const UPDATE = "STATION_PLAYLISTS::UPDATE";
const ADD_SONG = "STATION_PLAYLISTS::ADD_SONG";
const UPDATE_DISPLAY_NAME = "STATION_PLAYLISTS::UPDATE_DISPLAY_NAME";
const MOVE_SONG_TO_BOTTOM = "STATION_PLAYLISTS::MOVE_SONG_TO_BOTTOM";
const MOVE_SONG_TO_TOP = "STATION_PLAYLISTS::MOVE_SONG_TO_TOP";
const REMOVE_SONG = "STATION_PLAYLISTS::REMOVE_SONG";

function update(playlists) {
	return {
		type: UPDATE,
		playlists,
	}
}

function addSong(playlistId, song) {
	return {
		type: ADD_SONG,
		playlistId,
		song,
	}
}

function updateDisplayName(playlistId, displayName) {
	return {
		type: UPDATE_DISPLAY_NAME,
		playlistId,
		displayName,
	}
}

function moveSongToBottom(playlistId, songId) {
	return {
		type: MOVE_SONG_TO_BOTTOM,
		playlistId,
		songId,
	}
}

function moveSongToTop(playlistId, songId) {
	return {
		type: MOVE_SONG_TO_TOP,
		playlistId,
		songId,
	}
}

function removeSong(playlistId, songId) {
	return {
		type: REMOVE_SONG,
		playlistId,
		songId,
	}
}





const initialState = List([]);

function reducer(state = initialState, action) {
	let playlistId, songId;

	function updatePlaylist(playlistId, updater) {
		return state.update(
			state.findIndex(function(playlist) {
				console.log(55544, playlist);
				return playlist.get("playlistId") === playlistId;
			}),
			updater
		);
	}

	function updatePlaylistSongs(playlistId, updater) {
		return updatePlaylist(playlistId, function (playlist) {
			return playlist.update("songs", function (songs) {
				return songs.update(updater);
			});
		})
	}

	switch (action.type) {
	case UPDATE:
		let { playlists } = action;

		playlists = playlists.map((playlist) => {
			return {
				playlistId: playlist._id,
				createdAt: playlist.createdAt,
				createdBy: playlist.createdBy,
				displayName: playlist.displayName,
				songs: playlist.songs,
			};
		});

		return fromJS(playlists);
	case ADD_SONG:
		const { song } = action;
		playlistId = action.playlistId;

		return updatePlaylistSongs(playlistId, function (songs) {
			return songs.push(fromJS(song));
		});
	case UPDATE_DISPLAY_NAME:
		const { displayName } = action;
		playlistId = action.playlistId;

		return updatePlaylist(playlistId, function (playlist) {
			return playlist.set("displayName", displayName);
		});
	case MOVE_SONG_TO_BOTTOM:
		playlistId = action.playlistId;
		songId = action.songId;

		return updatePlaylistSongs(playlistId, function (songs) {
			let songIndex = songs.findIndex(function (song) {
				return song.get("songId") === songId;
			});
			let song = songs.get(songIndex);
			songs = songs.delete(songIndex);
			songs = songs.push(song);
			return songs;
		});
	case MOVE_SONG_TO_TOP:
		playlistId = action.playlistId;
		songId = action.songId;

		return updatePlaylistSongs(playlistId, function (songs) {
			let songIndex = songs.findIndex(function (song) {
				return song.get("songId") === songId;
			});
			let song = songs.get(songIndex);
			songs = songs.delete(songIndex);
			songs = songs.unshift(song);
			return songs;
		});
	case REMOVE_SONG:
		playlistId = action.playlistId;
		songId = action.songId;

		return updatePlaylistSongs(playlistId, function (songs) {
			let songIndex = songs.findIndex(function (song) {
				return song.get("songId") === songId;
			});
			return songs.delete(songIndex);
		});
	}
	return state;
}

const actionCreators = {
	update,
	addSong,
	updateDisplayName,
	moveSongToBottom,
	moveSongToTop,
	removeSong,
};

const actionTypes = {
	ADD_SONG,
	UPDATE_DISPLAY_NAME,
	MOVE_SONG_TO_BOTTOM,
	MOVE_SONG_TO_TOP,
	REMOVE_SONG,
};

export {
	actionCreators,
	actionTypes,
};

export default reducer;