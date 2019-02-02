module.exports = {
    name: 'help',
    description: 'Sends the user a help message via DM',
    execute(message, args) {
		message.author.send("Don't use commands in DM, use commands in a server running the bot\nSend me a DM and I'll forward it to the developer\n\n"
		+"!bigly makes it big\n"
		+"!smol makes it small\n"
		+"!register to register your pubg account. Default server is na. Put a server on the end to use a different default\n"
		+"!pubg to see pubg stats. Defaults to na server\n"
		+"!defserver <server> to change the default stats server\n"
		+"\nPubg server options are: krjp,jp,na,eu,ru,oc,kakao,sea,sa,as");
	
    },
};