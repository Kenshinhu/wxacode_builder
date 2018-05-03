const program = require('commander');
const co = require('co');
const lib = require('./lib');

program
	.version('0.0.1')
	.usage('appid app_secret', )
	.arguments('<appid> <appsecret> <app_path>')
	.option('--width','wxcode width')
	.action((appid, appsecret, app_path) => {
		// program.
		// console.log(process.cwd());
		const fn = co.wrap(function* () {
			yield lib.SaveWXACode({
				appid,
				appsecret,
				app_path,
				file_path:`${process.cwd()}/${(new Date()).getTime()}.jpg`,
				width: 512
			})
		});

		fn().then(()=>(console.log('finish')));
	})
	.parse(process.argv);