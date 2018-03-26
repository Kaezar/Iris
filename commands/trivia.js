const iris = require('../iris.js');
const snekfetch = require('snekfetch');
const Discord = require('discord.js');
module.exports = {
    name: 'trivia',
    description: '',
    cooldown: 15,
    async execute(message, args) {
        let i = 0;
        var body;
        let item;
        while (i < 1) {
    	var { body } = await snekfetch.get('http://jservice.io/api/random')
        item = body[0];
        if (item.invalid_count) break;
        i++
        }
        let answer = item.answer;
        if (answer.includes('<i>')) {
            answer = answer.slice(3);
            answer = answer.slice(0, -4);
        }
        const filter = response => { 
            return (answer.toLowerCase() === response.content.toLowerCase());
        };
        const time = 30000;
        const seconds = time/1000;

        message.channel.send(`⏱${seconds} seconds on the clock!⏱\nCategory: ${item.category.title}\nQuestion: ${item.question}`).then(() => {
            message.channel.awaitMessages(filter, { maxMatches: 1, time: time, errors: ['time'] })
                .then(collected => {
                    message.channel.send(`${collected.first().author} That is correct!`);
                })
                .catch(collected => {
                    message.channel.send(`⏱Time's up!⏱\nThe answer was: ${answer}`);
                });
        });
    }
};