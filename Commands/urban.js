/**
* Urban command
* @module Commands/urban
*/
const iris = require('../iris.js');
const snekfetch = require('snekfetch');
const Discord = require('discord.js');
const trim = (str, max) => (str.length > max) ? `${str.slice(0, max - 3)}...` : str;
var Urban = module.exports = {
    name: 'urban',
    description: 'Find definition of term from Urban Dictionary.',
    args: true,
    usage: '<term>',
    aliases: ['define'],
    /**
    * Use {@link https://snekfetch.js.org/ snekfetch} to find a definition for the word or phrase
    * given in args from {@link https://api.urbandictionary.com}. Create a {@link https://discord.js.org/#/docs/main/stable/class/RichEmbed RichEmbed}
    * object containing the word being defined, its top definition, an example of usage, the rating
    * of the definition, any tags the definition has, and a link to the webpage containing the definition.
    * Send the embed.
    * @param  {Message} message The {@link https://discord.js.org/#/docs/main/stable/class/Message message} containing the command
    * @param  {string[]} args    Array of words following the command
    */
    execute(message, args) {
        const term = args.join(' ');
        snekfetch.get('https://api.urbandictionary.com/v0/define').query({ term: term })
        .then((urban) => {
            if (urban.body.results_type === 'no_results') return message.channel.send(`No results found for **${term}**`);

            // get the info
            const [answer] = urban.body.list;
            // create an embed object with the info
            const embed = new Discord.RichEmbed()
            .setColor('#4682B4')
            .setTitle(answer.word)
            .setURL(answer.permalink)
            .addField('Definition', trim(answer.definition, 1024))
            .addField('Example', trim(answer.example, 1024))
            .addField('Rating', `${answer.thumbs_up} thumbs up.\n${answer.thumbs_down} thumbs down.`)
            .setFooter(`Tags: ${urban.body.tags.join(', ')}`);

            message.channel.send(embed);
        })
        .catch((error) => console.error(error));
    }
};
