const iris = require('../iris.js');
const snekfetch = require('snekfetch');
var Cat = module.exports = {
    name: 'cat',
    description: 'Get a cat from the random cat API.',
    aliases: ['🐱', '<a:NoodleCat:420844621804077056>', '<:owocat:420857789108322315>'],
    cooldown: 10,
    execute(message) {
        snekfetch.get('https://aws.random.cat/meow')
            .then((cat) => message.channel.send(cat.body.file))
            .catch((error) => console.error(error));
    },
};