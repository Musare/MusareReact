'use strict';

const 	request = require('request'),
		config  = require('config'),
		async 	= require('async'),
		utils 	= require('../utils'),
		logger 	= require('../logger'),
		hooks 	= require('./hooks');

module.exports = {

	/**
	 * Fetches a list of songs from Youtubes API
	 *
	 * @param session
	 * @param query - the query we'll pass to youtubes api
	 * @param cb
	 * @return {{ status: String, data: Object }}
	 */
	searchYoutube: (session, query, cb) => {
		const params1 = [
			'part=snippet',
			`q=${encodeURIComponent(query)}`,
			`key=${config.get('apis.youtube.key')}`,
			'type=video',
			'maxResults=15'
		].join('&');

		let params2 = [
			'part=contentDetails',
			`key=${config.get('apis.youtube.key')}`,
			'fields=etag,items/contentDetails/duration'
		];

		async.waterfall([
			(next) => {
				request(`https://www.googleapis.com/youtube/v3/search?${params1}`, next);
			},

			(res, body, next) => {
				next(null, JSON.parse(body));
			},

			(body, next) => {
				let ids = [];
				body.items.forEach((item) => {
					ids.push(item.id.videoId);
				});
				ids = ids.join(',');
				params2.push(`id=${ids}`);
				params2 = params2.join('&');
				request(`https://www.googleapis.com/youtube/v3/videos?${params2}`, (err, res, body2) => {
					next(err, body2, body);
				});
			},

			(durationBody, body, next) => {
				durationBody = JSON.parse(durationBody);
				body.items = body.items.map((item, index) => {
					let dur = durationBody.items[index].contentDetails.duration;
					dur = dur.replace('PT', '');
					let duration = 0;
					dur = dur.replace(/([\d]*)H/, (v, v2) => {
						v2 = Number(v2);
						duration = (v2 * 60 * 60);
						return '';
					});
					dur = dur.replace(/([\d]*)M/, (v, v2) => {
						v2 = Number(v2);
						duration += (v2 * 60);
						return '';
					});
					dur = dur.replace(/([\d]*)S/, (v, v2) => {
						v2 = Number(v2);
						duration += v2;
						return '';
					});
					item.duration = duration;
					return item;
				});
				next(null, body);
			}
		], (err, data) => {
			if (err) {
				err = utils.getError(err);
				logger.error("APIS_SEARCH_YOUTUBE", `Searching youtube failed with query "${query}". "${err}"`);
				return cb({status: 'failure', message: err});
			}
			logger.success("APIS_SEARCH_YOUTUBE", `Searching YouTube successful with query "${query}".`);
			return cb({ status: 'success', data });
		});
	},

	/**
	 * Gets Spotify data
	 *
	 * @param session
	 * @param title - the title of the song
	 * @param artist - an artist for that song
	 * @param cb
	 */
	getSpotifySongs: hooks.adminRequired((session, title, artist, cb, userId) => {
		async.waterfall([
			(next) => {
				utils.getSongsFromSpotify(title, artist, next);
			}
		], (songs) => {
			logger.success('APIS_GET_SPOTIFY_SONGS', `User "${userId}" got Spotify songs for title "${title}" successfully.`);
			cb({status: 'success', songs: songs});
		});
	}),

	/**
	 * Joins a room
	 *
	 * @param session
	 * @param page - the room to join
	 * @param cb
	 */
	joinRoom: (session, page, cb) => {
		if (page === 'home') {
			utils.socketJoinRoom(session.socketId, page);
		}
		cb({});
	},

	/**
	 * Joins an admin room
	 *
	 * @param session
	 * @param page - the admin room to join
	 * @param cb
	 */
	joinAdminRoom: hooks.adminRequired((session, page, cb) => {
		if (page === 'queue' || page === 'songs' || page === 'stations' || page === 'reports' || page === 'news' || page === 'users' || page === 'statistics') {
			utils.socketJoinRoom(session.socketId, `admin.${page}`);
		}
		cb({});
	}),

	/**
	 * Returns current date
	 *
	 * @param session
	 * @param cb
	 */
	ping: (session, cb) => {
		cb({date: Date.now()});
	}

};
