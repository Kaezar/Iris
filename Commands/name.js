/**
* Name command
* @module Commands/name
*/
const iris = require('../iris.js');
const snekfetch = require('snekfetch');
module.exports = {
    name: 'name',
    description: 'Get a random name from the uinames API.',
    usage: '<male OR female> <region> (args optional)',
    /**
    * Send an HTTP GET request to {@link http://uinames.com/api/ the uinames api} using
    * {@link https://snekfetch.js.org/ snekfetch} and passing the first and second arguments
    * as the gender and region if specified.
    *
    * @param  {Message} message The {@link https://discord.js.org/#/docs/main/stable/class/Message message} containing the command
    * @param  {string[]} args    Array of words following the command
    */
    execute(message, args) {
        let query;
        if (args[0] === 'male' || args[0] === 'female') {
            let gender = args[0];
            query = {gender: gender};
            if (args[1]) {
                let regionArray = args;
                regionArray.shift();
                region = regionArray.join(" ");
                query = { gender: gender, region: region };
            }
        }
        snekfetch.get('http://uinames.com/api/').query(query)
        .then((name) => {
            if (name.body.error) {
                throw name.body.error;
                return message.reply(name.body.error);
            }
            let gender = ((name.body.gender === 'male') ? 'man' : 'woman');
            message.channel.send(`This ${gender} has a very normal name, and that name is ${name.body.name} ${name.body.surname}`);
        })
        .catch((error) => {
            console.error(error);
            message.reply("Something went wrong with the request!");
        });
    },
};
