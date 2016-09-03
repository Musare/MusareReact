
// custom modules
const utils = require('./utils');

function Station (id, data, dbConn) {

	var self = this;

	//TODO Add startedAt and timePaused
	var playlist = data.playlist;
	var currentSong = playlist[0];
	var currentSongIndex = data.currentSongIndex;
	var paused = data.paused;
	var locked = data.locked;
	var skipVotes = data.skipVotes;
	var users = data.users;
	var displayName = data.displayName;
	var description = data.description;
	var timer;
	var dbConnection = dbConn;

	this.skipSong = function() {
		if (playlist.length > 0) {
			if (timer !== undefined) {
				timer.pause();
			}
			if (currentSongIndex+1 < playlist.length) {
				currentSongIndex++;
			} else {
				currentSongIndex = 0;
			}
			skipVotes = 0;
			currentSong = playlist[currentSongIndex];
			timer = new utils.Timer(function() {
				console.log("Skip!");
				self.skipSong();
			}, currentSong.duration, paused);

			//io.emit("skipSong " + id, currentSong);
		}
	};
	this.toggleVoteSkip = function(userId) {
		if (skipVotes.indexOf(userId) === -1) {
			skipVotes.push(userId);
		} else {
			skipVotes = skipVotes.splice(skipVotes.indexOf(userId), 1);
		}
		//TODO Calculate if enough people voted to skip
		//TODO Emit
	};
	this.retrievePlaylist = function() {
		//TODO Use Rethink to get the Playlist for this room
	};
	this.pause = function() {
		if (!paused) {
			paused = true;
			timer.pause();
		}
		//TODO Emit
	};
	this.unpause = function() {
		if (paused) {
			paused = false;
			timer.resume();
		}
		//TODO Emit
	};
	this.isPaused = function() {
		return paused;
	};
	this.getCurrentSong = function() {
		return currentSong;
	};
	this.lock = function() {
		if (!locked) {
			locked = true;
		}
		//TODO Emit
	};
	this.unlock = function() {
		if (locked) {
			locked = false;
		}
		//TODO Emit
	};
	this.isLocked = function() {
		return locked;
	};
	this.updateDisplayName = function(newDisplayName) {
		//TODO Update RethinkDB
		displayName = newDisplayName;
	};
	this.updateDescription = function(newDescription) {
		//TODO Update RethinkDB
		description = newDescription;
	};
	this.getId = function() {
		return id;
	};
	this.getDisplayName = function() {
		return displayName;
	};
	this.getDescription = function() {
		return description;
	};
	this.addUser = function(user) {
		users.add(user);
	};
	this.removeUser = function(user) {
		users.splice(users.indexOf(user), 1);
	};
	this.getUsers = function() {
		return users;
	};
	this.skipSong();
}

module.exports = {

	stations: [],
	dbConnection: null,

	setup: function (dbConn) {
		this.dbConnection = dbConn;
	},

	initStation: function (id, data) {
		if (!this.getStation(id)) {
			var station = new Station(id, data, this.dbConnection);
			this.stations.push(station);
			return station;
		}
		else {
			return false;
		}
	},

	getStation: function (id) {
		var s = null;
		this.stations.forEach(function (station) {
			if (station.id == id) s = station;
		});
		return s;
	},

	// creates a brand new station
	createStation: function (data) {
		//TODO: add createStation functionality
		this.initStation(null, data);
	},

	// loads a station from the database
	loadStation: function (data) {
		//TODO: Get this from RethinkDB
		this.initStation({
			playlist: [
				{
					mid: "3498fd83",
					duration: 20000,
					title: "Test1"
				},
				{
					mid: "3498fd83434",
					duration: 10000,
					title: "Test2"
				}
			],
			currentSongIndex: 0,
			paused: false,
			locked: false,
			skipVotes: [],
			users: [],
			displayName: "",
			description: ""
		});
	}

};
