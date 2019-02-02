const { MAX_MESSAGE_SIZE } = require('../config.json');

module.exports = {
    name: 'bigly',
    description: 'Replaces text with a larger version',
    execute(message, args) {
		var output='';
		var chars="abcdefghijklmnopqrstuvwxyz";
		var nums="1234567890"
		var numouts=[":one:",":two:",":three:",":four:",":five:",":six:",":seven:",":eight:",":nine:",":zero:"]
		
		for (j=0;j<args.length;j++){
			for (i = 0; i<args[j].length; i++){
				var index = nums.indexOf(args[j].slice(i,i+1))
				if (chars.indexOf(args[j].slice(i,i+1).toLowerCase())!=-1){
					output +=':regional_indicator_'+(args[j].slice(i,i+1).toLowerCase())+':'
				}
				else if (index !=-1){
					output+=numouts[index]
				}
				
			}
		
		
		output+='  '
		}
			
		if (output.length<=MAX_MESSAGE_SIZE){
			message.channel.send(output);
		}
		else{
			message.channel.send("das a huuuuge message shuuutt uuuupp")
		}
	},
};