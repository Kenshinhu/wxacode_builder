const debug = require('debug');
const request = require('co-request');
const log = debug('wxacode_builder');
const httpRequest = require('request')
const fileSystem= require('fs');

// 处理字符串
const queryStringHandler = (object) => {
	const params = [];
	Object.keys(object).map((key) => {
		params.push(`${key}=${object[key]}`);
	});
	return params.join('&');
};




// 取得小程序的AccessToken
const GetWxAccessToken = function* ({
	appid,
	appsecret
}) {
	const params = {
		appid,
		secret: appsecret,
		grant_type: 'client_credential'
	};

	const uri = `https://api.weixin.qq.com/cgi-bin/token?${queryStringHandler(params)}`;
	log(`GetWxAccessToken : ${uri}`);
	const req = yield request({
		uri,
		method: 'GET'
	});
	const response = JSON.parse(req.body);
	log(`response : ${JSON.stringify(response)}`);
	return response;
};

// 保存小程序码
exports.SaveWXACode = function* ({
	appid,
	appsecret,
	app_path,
	file_path,
	width
}) {

	const {
		access_token
	} = yield GetWxAccessToken({
		appid,
		appsecret,
	});
	// log(wxAccess);
	const WXACodeUrl = `https://api.weixin.qq.com/wxa/getwxacode?access_token=${access_token}`;
	log(`wxa_code_url : ${WXACodeUrl}`);
	const data = {
		path: app_path,
		width
	};
	return new Promise((resolve, reject) => {
		httpRequest
			.post({
				url: WXACodeUrl,
				json: data,
				encoding: 'binary'
			})
			.pipe(fileSystem.createWriteStream(file_path))
			.on('close', resolve)
			.on('error', reject);
	});

}