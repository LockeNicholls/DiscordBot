
const { MAX_MESSAGE_SIZE } = require('../config.json');
module.exports = {
    name: 'smol',
    description: 'swaps characters for small versions',
    execute(message, args) {
		var output='';
		var chars="abcdefghijklmnopqrstuvwxyz";
		var lil=["\\🇦","\\🇧","\\🇨","\\🇩","\\🇪","\\🇫","\\🇬","\\🇭","\\🇮","\\🇯","\\🇰","\\🇱","\\🇲","\\🇳","\\🇴","\\🇵","\\🇶","\\🇷","\\🇸","\\🇹","\\🇺","\\🇻","\\🇼","\\🇽","\\🇾","\\🇿"];
		
		message.delete()
		for (j=0;j<args.length;j++){
			for (i = 0; i<args[j].length; i++){

				var index = chars.indexOf(args[j].slice(i,i+1).toLowerCase())
				if (chars.indexOf(args[j].slice(i,i+1).toLowerCase())!=-1){
					output +=lil[index]
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