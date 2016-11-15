'use strict';

const mongoose = require('mongoose');

let lib = {

	connection: null,
	schemas: {},
	models: {},

	init: (url, cb) => {

		lib.connection = mongoose.connect(url).connection;

		lib.connection.on('error', err => console.log('Database error: ' + err.message));

		lib.connection.once('open', _ => {

			lib.schemas = {
				song: new mongoose.Schema(require(`./schemas/song`)),
				station: new mongoose.Schema(require(`./schemas/station`)),
				user: new mongoose.Schema(require(`./schemas/user`))
			};

			lib.models = {
				song: mongoose.model('song', lib.schemas.song),
				station: mongoose.model('station', lib.schemas.station),
				user: mongoose.model('user', lib.schemas.user)
			};

			cb();
		});
	}
};

module.exports = lib;