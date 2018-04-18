/**
* Dog command
* @module Commands/dog
*/
const iris = require('../iris.js');
const snekfetch = require('snekfetch');
var Dog = module.exports = {
    name: 'dog',
    description: 'Get a dog from the dog API.',
    aliases: ['🐶'],
    cooldown: 10,
    usage: 'breeds or <breed name>',
    /**
    * Retreive a random dog image from {@link https://dog.ceo/api the dog API} using {@link https://snekfetch.js.org/ snekfetch}.
    * If the user provides a valid breed name as an argument, the requested dog image will be of that breed. Providing "breeds"
    * as an argument returns the list of breeds.
    * @param  {Message} message The {@link https://discord.js.org/#/docs/main/stable/class/Message message} containing the command
    * @param  {string[]} args    Array of words following the command
    */
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
