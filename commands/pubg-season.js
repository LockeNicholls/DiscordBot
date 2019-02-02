const request = require('request');
const { pubgkey } = require('../config.json');

module.exports = {
    name: 'pubg-season',
    description: 'outputss the current pubg season',
    execute(message, args) {
		var options ={
			url: "https://api.pubg.com/shards/pc-oc/seasons",
			headers: {
				'Authorization': 'Bearer ' +pubgkey,
				'Accept': 'application/vnd.api+json'
			}
		};
		
		
		request(options, function (error, response, body) {
			console.log('error:', error); 
			console.log('statusCode:', response && response.statusCode); 
		    var info = JSON.parse(body); 
			var currentSeasonId = info.data[info.data.length-1].id
			message.channel.send(currentSeasonId)
		});
	
    },
};