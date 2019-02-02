

const fs = require('fs');

module.exports = {
    name: 'defserver',
    description: 'Sets the default pubg stat server',
    execute(message, args) {
        // If they enter a server, check that it is valid, and write it to JSON
		if (args.length>0){
			var fileName = 'reg.json';
			var file = fs.readFileSync(fileName);
			var accounts = JSON.parse(file);
			
			var servers=["krjp","jp","na","eu","ru","oc","kakao","sea","sa","as"]
			var index=servers.indexOf(args[0]);
			
			//If the server is in the list 
			if (index!=-1){
				accounts[message.author.id][1]=args[0];
				fs.writeFileSync(fileName,JSON.stringify(accounts,null,2), function (err){
					if (err) return console.log(err);
				});
				message.channel.send("Changed server to "+args[0]);
			}
			//If it isn't in the list, it's an invalid server
			else{message.channel.send("Invalid choice, choices are: krjp, jp, na, eu, ru, oc, kakao, sea, sa, as")}
		
		}
		//If they didn't define any arguments, tell them too. 
		else {message.channel.send("Pick a server, choices are: krjp, jp, na, eu, ru, oc, kakao, sea, sa, as")}
    },
};