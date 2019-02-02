const { prefix, token, pubgkey ,ADMIN_ID} = require('./config.json');
const request = require('request');
const fs = require('fs');

const Discord = require('discord.js');
const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    // set a new item in the Collection
    // with the key as the command name and the value as the exported module
    client.commands.set(command.name, command);
}

const stringformat = require('stringformat') //For easy formatting of strings
stringformat.extendString('format') //Allows the above top be used as methods



//Initialise the bot. 
client.on('ready', () => {
  console.log('Logged in');
});


//When a message is sent by a user in a server, do something
client.on('message', message => {
	
	//If someone DMs the bot, redirect it to the admin
	if (message.channel.type=='dm'&& !message.author.bot){
		client.users.get(ADMIN_ID).send(message.author+': '+message.content);
	}
		
	//Messages can be from users or other bots. They can be commands or just messages
	//If it is just a message or if it is a bot, we don't want to do anything. 
	if (!message.content.startsWith(prefix) || message.author.bot) return;
	
	//If it is a command, it will have the prefix followed by some arguments. 
	//We need to get the arguments. The  y are split by spaces by default. 
	//IE !command arg0 arg1
	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();
		
	//if the command does not exist, tells the user they can get help	
	if (!client.commands.has(command)) {
		message.channel.send("Use !help for a DM about commands");
		return
	}
	//try catch to attempt to execute the commmand
	try {
		client.commands.get(command).execute(message, args);
	}
	 
	catch (error) {
		console.error(error);
		message.reply('There was an error trying to execute that command');
	}
});

client.login(token);