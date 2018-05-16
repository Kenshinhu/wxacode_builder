const program = require('commander');
const co = require('co');
const lib = require('./lib');
const fs = require('fs');
program
	.version('0.0.1')
	.usage('appid app_secret', )
	.arguments('<appid> <appsecret> <app_path>')
	.option('--width [value]', 'wxcode width ')
	.option('--json [value]', 'Batch file Path')

	.action((appid, appsecret, app_path, cmd) => {
		const fn = co.wrap(function* () {
			let paths = [];
			if (cmd.json) {
				const filedata = fs.readFileSync(cmd.json, 'utf8');
				const jsonfile = JSON.parse(filedata);
				paths = jsonfile.paths;
			}

			// if (app_path) {
			// 	paths.push(app_path);
			// }

			console.log(paths);

			let index = 0;
			yield paths.map(({
				path,
				filename
			}) => (
				lib.SaveWXACode({
					appid,
					appsecret,
					app_path: path,
					file_path: `${process.cwd()}/${filename}`,
					width: cmd.width || 1024
				})
			));





			// yield lib.SaveWXACode({
			// 	appid,
			// 	appsecret,
			// 	app_path,
			// 	file_path:`${process.cwd()}/${(new Date()).getTime()}.jpg`,
			// 	width: 1024
			// })
		});
		fn().then(() => (console.log('finish')));
	})
	.parse(process.argv);