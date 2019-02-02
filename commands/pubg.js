const fs = require('fs');
const request = require('request');
const {pubgkey,STAT_DECIMAL,STAT_PADDING,season } = require('../config.json');

module.exports = {
    name: 'pubg',
    description: 'Gets pubg stats',
    execute(message, args) {
        

		var server=''
		var name=''
		var pubgid=''
		var fileName = 'reg.json';
		var file = fs.readFileSync(fileName);
		var accounts = JSON.parse(file);
		var authid=message.author.id;		
		
		//If a single argument is provided
		if (args.length==1){
		
			var servers=["krjp","jp","na","eu","ru","oc","kakao","sea","sa","as"]
			var index=servers.indexOf(args[0]);
			//if it is a server
			if (index!=-1){
				server=servers[index];
				pubgid=accounts[authid][0];
				name=accounts[authid][2];
				display();
				
			}//else, it must be a username
			else {
				name=args[0];
				server="na";
				
				var options ={
					url: "https://api.pubg.com/shards/pc-oc/players?filter[playerNames]="+name,
					headers: {
						'Authorization': 'Bearer ' +pubgkey,
						'Accept': 'application/vnd.api+json'
					},
					json:true
				
				};
				
				request(options, function (error, response, body){
					if(error) console.log(error);
					else {
						if (response.statusCode==404){
							message.channel.send("Name doesn't exist");
							return;
						}
						else {
							console.log("test"+body.data[0].id)
							pubgid=body.data[0].id;
							display();
							
						}
					}
				});
			}
			
		}
			
		//if no arguments are provided
		else{
						
			if (!accounts.hasOwnProperty(authid)){
				message.channel.send("Use register with your pubg username so I can get your stats (case sensitive)");
				return;
			}
			
			server=accounts[authid][1];
			pubgid=accounts[authid][0];
			name=accounts[authid][2];
			display();
			
		}

	
	
		function display(){//get the data and display
			var options ={
				url: "https://api.pubg.com/shards/pc-"+server+"/players/"+pubgid+"/seasons/"+season,
				headers: {
					'Authorization': 'Bearer ' +pubgkey,
					'Accept': 'application/vnd.api+json'
				},
				json:true
				
			};
			request(options, function (error, response, body){
				if(error) console.log(error);
				else {
					if (response.statusCode==404){
						message.channel.send("something went wrong")
					}
					else if (response.statusCode==429){
						message.channel.send("API rate limit reached, try again in 60 seconds")
					}
					else {
						console.log('statusCode:', response && response.statusCode);
						//Initialise KD variables
						var sqkills=JSON.stringify(body.data.attributes.gameModeStats["squad-fpp"].kills);
						var sqlosses=JSON.stringify(body.data.attributes.gameModeStats["squad-fpp"].losses);
						var dkills=JSON.stringify(body.data.attributes.gameModeStats["duo-fpp"].kills);
						var dlosses=JSON.stringify(body.data.attributes.gameModeStats["duo-fpp"].losses);
						var skills=JSON.stringify(body.data.attributes.gameModeStats["solo-fpp"].kills);
						var slosses=JSON.stringify(body.data.attributes.gameModeStats["solo-fpp"].losses);						
						if (sqlosses==0){sqlosses=1}
						if (dlosses==0){dlosses=1}
						if (slosses==0){slosses=1}
						
						//Initialise rounds played variables
						var sqrounds=body.data.attributes.gameModeStats["squad-fpp"].roundsPlayed;
						var drounds=body.data.attributes.gameModeStats["duo-fpp"].roundsPlayed;
						var srounds=body.data.attributes.gameModeStats["solo-fpp"].roundsPlayed;																	
						var trounds=sqrounds+drounds+srounds;
						if (srounds==0){srounds=1}
						if (drounds==0){drounds=1}
						if (sqrounds==0){sqrounds=1}
						if (trounds==0){trounds=1}
						
						//Initialise damage variables
						var sqdamage=body.data.attributes.gameModeStats["squad-fpp"].damageDealt/sqrounds;
						var duodamage=body.data.attributes.gameModeStats["duo-fpp"].damageDealt/drounds;
						var sdamage=body.data.attributes.gameModeStats["solo-fpp"].damageDealt/srounds;						
						var tdamage = sqdamage+duodamage+sdamage;
						
						//Initialise wins
						var sqwins=body.data.attributes.gameModeStats["squad-fpp"].wins;
						var dwins=body.data.attributes.gameModeStats["duo-fpp"].wins;
						var swins=body.data.attributes.gameModeStats["solo-fpp"].wins;
						
						//Initialise top 10s
						var sqten=body.data.attributes.gameModeStats["squad-fpp"].top10s;
						var dten=body.data.attributes.gameModeStats["duo-fpp"].top10s;
						var sten=body.data.attributes.gameModeStats["solo-fpp"].top10s;							
						
						//process KD
						var skd=skills/slosses;
						var dkd=dkills/dlosses;
						var sqkd=sqkills/sqlosses;
						
						//process winrate %
						var sqwr=sqwins/sqrounds*100;
						var dwr=dwins/drounds*100;
						var swr=swins/srounds*100;
						
						//process top 10%
						var sqtr=sqten/sqrounds*100;
						var dtr=dten/drounds*100;
						var str=sten/srounds*100;
						
						//weighted averages
						var kdavg =sqrounds/trounds*sqkd + drounds/trounds*dkd + srounds/trounds*skd;
						var adr=sqrounds/trounds*sqdamage + drounds/trounds*duodamage + srounds/trounds*sdamage;
						var winavg=sqrounds/trounds*sqwins + drounds/trounds*dwins + srounds/trounds*swins;
						var tenavg=sqrounds/trounds*sqtr + drounds/trounds*dtr + srounds/trounds*str;
						
						//Collate all of ^^^^ into a message to send to the user				
						response= "```Stats for player "+name+" on "+server
						+"\nMode  \t\t{16:"+STAT_PADDING+"}\t\t{17:"+STAT_PADDING+"}\t\t{18:"+STAT_PADDING+"}\t\t{19:"+STAT_PADDING+"}\n"
						+"Squad \t\t{0:"+STAT_PADDING+"}\t\t{1:"+STAT_PADDING+"}\t\t{2:"+STAT_PADDING+"}\t\t{3:"+STAT_PADDING+"}\n"
						+"Duo   \t\t{4:"+STAT_PADDING+"}\t\t{5:"+STAT_PADDING+"}\t\t{6:"+STAT_PADDING+"}\t\t{7:"+STAT_PADDING+"}\n"
						+"Solo  \t\t{8:"+STAT_PADDING+"}\t\t{9:"+STAT_PADDING+"}\t\t{10:"+STAT_PADDING+"}\t\t{11:"+STAT_PADDING+"}\n"
						+"AVG   \t\t{12:"+STAT_PADDING+"}\t\t{13:"+STAT_PADDING+"}\t\t{14:"+STAT_PADDING+"}\t\t{15:"+STAT_PADDING+"}\n"						
						+"```";
						
						
						response = response.format(sqwr.toFixed(STAT_DECIMAL),sqtr.toFixed(STAT_DECIMAL),sqdamage.toFixed(STAT_DECIMAL),sqkd.toFixed(STAT_DECIMAL),
													dwr.toFixed(STAT_DECIMAL),dtr.toFixed(STAT_DECIMAL),duodamage.toFixed(STAT_DECIMAL),dkd.toFixed(STAT_DECIMAL),
													swr.toFixed(STAT_DECIMAL),str.toFixed(STAT_DECIMAL),sdamage.toFixed(STAT_DECIMAL),sdamage.toFixed(STAT_DECIMAL),
													winavg.toFixed(STAT_DECIMAL),tenavg.toFixed(STAT_DECIMAL),adr.toFixed(STAT_DECIMAL),kdavg.toFixed(STAT_DECIMAL),
													"WR","Top 10","ADR","KD"
													);
						
						message.channel.send(response)
						
					}
				}
			});
		}
    },
};