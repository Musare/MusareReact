const fs = require("fs");
const config = require("config");
const request = require("request");
const async = require("async");

const localesFolder = __dirname.substr(0, __dirname.lastIndexOf("translation")) + "locales/";
const deleteFolderRecursive = (path) => {
	if (fs.existsSync(path)) {
		fs.readdirSync(path).forEach((file,index) => {
			const curPath = path + "/" + file;
			if (fs.lstatSync(curPath).isDirectory()) {
				deleteFolderRecursive(curPath);
			} else {
				fs.unlinkSync(curPath);
			}
		});
		fs.rmdirSync(path);
	}
};
deleteFolderRecursive(localesFolder);

async.waterfall([
	(next) => {
		fs.mkdirSync(localesFolder);
		next();
	},

	(next) => {
		request.post(`https://api.poeditor.com/v2/languages/list`, {form: {api_token: config.get("poeditor.api_token"), id: config.get("poeditor.project_id")}}, next);
	},

	(res, body, next) => {
		body = JSON.parse(body);
		if (body.response.status !== "success") return next(body.response.message);
		let languages = body.result.languages.map((language) => {
			return language.code;
		});
		next(null, languages);
	},

	(languages, next) => {
		async.each(
			languages,
			(language, next) => {
				async.waterfall([
					(next) => {
						fs.mkdirSync(`${localesFolder}${language}`);
						next();
					},

					(next) => {
						request.post(`https://api.poeditor.com/v2/projects/export`, {form: {api_token: config.get("poeditor.api_token"), id: config.get("poeditor.project_id"), language, type: "key_value_json", filters: "translated"}}, next);
					},

					(res, body, next) => {
						body = JSON.parse(body);
						if (body.response.status !== "success") return next(body.response.message);
						request(body.result.url, next);
					},

					(res, body, next) => {
						if (!body) body = "{}";
						body = JSON.parse(body);
						const files = [];
						Object.keys(body).forEach((namespace) => {
							files.push({
								namespace,
								content: body[namespace]
							});
						});
						next(null, files);
					},

					(files, next) => {
						async.each(
							files,
							(file, next) => {
								fs.writeFile(`${localesFolder}${language}/${file.namespace}.json`, JSON.stringify(file.content), function(err) {
									if(err) console.err(`Failed to write namespace ${file.namespace} for language ${language}.`);
									next();
								});
							},
							() => {
								next();
							}
						);
					}
				], () => {
					next();
				});
			},
			() => {
				next();
			}
		);
	}
], (err, res) => {
	console.log(err, res);
});