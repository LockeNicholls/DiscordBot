const fs = require('fs');
const request = require('request');
const { pubgkey } = require('../config.json');


module.exports = {
    name: 'register',
    description: 'Registers a discord account with a pubg user',
    execute(message, args) {
        // If they give us data to work with
		if (args.length>0){
			var fileName = 'reg.json';
			var file = fs.readFileSync(fileName);
			var accounts = JSON.parse(file);
			
			//define the request
			var options ={
				url: "https://api.pubg.com/shards/pc-oc/players?filter[playerNames]="+args[0],
				headers: {
					'Authorization': 'Bearer ' +pubgkey,
					'Accept': 'application/vnd.api+json'
				},
				json:true
				
			};
			//make the request
			request(options, function (error, response, body){
				if(error) console.log(error);
				else {
					if (response.statusCode==404){
						message.channel.send("The idiot can't even spell their own name")
					}
					else if (response.statusCode==429){
						message.channel.send("API rate limit reached, try again in 60 seconds")
					}
					
					else {
						//get their pubg unique account id from their pubg username. 
						console.log('statusCode:', response && response.statusCode);
						var id=body.data[0].id;
						var author =String( message.author.id);
						//if they don't provide a valid server, default to na
						var server="na"
						//if they have a second argument, check that it is a valid server and set it to their default if it is.
						if (args.length>1){
							var servers=["krjp","jp","na","eu","ru","oc","kakao","sea","sa","as"]
							var index=servers.indexOf(args[1]);
							if (index!=-1){
								server = servers[index];
							}
							else{message.channel.send("Invalid server choice, pick from krjp,jp,na,eu,ru,oc,kakao,sea,sa,as")}
						}
						//write to json
						accounts[author]=[id,server,args[0]];
						fs.writeFileSync(fileName,JSON.stringify(accounts,null,2), function (err){
							if (err) return console.log(err);
						});
						message.channel.send("registered "+args[0]+", default server is "+server);
					}
				}
			});
			
		}
		else {
			message.channel.send("register what name, idiot")
		}
    },
};