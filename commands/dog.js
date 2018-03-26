const iris = require('../iris.js');
const snekfetch = require('snekfetch');
var Dog = module.exports = {
    name: 'dog',
    description: 'Get a dog from the dog API.',
    aliases: ['🐶'],
    cooldown: 10,
    usage: 'breeds or <breed name>',
    execute(message, args) {
    	let request = 'https://dog.ceo/api/breeds/image/random';
    	if (args[0] === 'breeds') request = 'https://dog.ceo/api/breeds/list/all';
    	else if (args[0] != null) {
    		const breedName = args[0];
    		request = `https://dog.ceo/api/breed/${breedName}/images/random`
    	}
        snekfetch.get(request)
            .then((response => {
            	if (response.body.status === "error") return message.reply(`Error: ${response.body.code} ${response.body.message}`);
            	if (args[0] === 'breeds') {
            		const breeds = Object.keys(response.body.message).join(', ');
            		message.author.send(`List of dog breeds: ${breeds}`)
            			.then(() => {
		        			if (message.channel.type !== 'dm') message.reply('I\'ve sent you a DM with the list of dog breeds!');
		    			})
		    			.catch(() => message.reply('it seems like I can\'t DM you!'));
            	} else message.channel.send(response.body.message)
            }))
            .catch((error) => console.error(error));
    },
};