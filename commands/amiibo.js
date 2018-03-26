const iris = require('../iris.js');
const snekfetch = require('snekfetch');
const Discord = require('discord.js');
module.exports = {
    name: 'amiibo',
    description: 'Get Amiibo data from Amiibo API',
    args: true,
    usage: 'list or <name>',
    execute(message, args) {
        if (args[0] == 'list') {
            snekfetch.get('http://www.amiiboapi.com/api/amiibo/')
            .then((reply) => {
                const amiibos = reply.body.amiibo.map(a => a.name);
                const uniqueAmiibos = this.unique(amiibos).join(', ');
                message.author.send(`List of amiibo names: ${uniqueAmiibos}`, { split: { char: ',' } })
                    .then(() => {
                        if (message.channel.type !== 'dm') message.reply("I've sent you a list of all the amiibos!");
                    })
                    .catch((error) => {
                        message.reply("It seems I can't DM you!");
                        console.log(error);
                    });
            })
            .catch((error) => console.error(error));
            return;
        }
    	const name = args.join(' ');
        snekfetch.get('http://www.amiiboapi.com/api/amiibo/').query({ name: name })
            .then((reply) => {

                for (let key in reply.body.amiibo) {
                    let amiibo = reply.body.amiibo[key];
                    let embed = new Discord.RichEmbed()
                        .setColor('#e60012')
                        .setTitle(amiibo.name)
                        .setImage(amiibo.image)
                        .setThumbnail('https://vignette.wikia.nocookie.net/residentevil/images/d/d8/Amiibo_tag.png')
                        .addField('Character', amiibo.character)
                        .addField('Game Series', amiibo.gameSeries, true)
                        .addField('Amiibo Series', amiibo.amiiboSeries, true);

                    message.channel.send(embed);
                }
            })
            .catch((error) => {
                message.channel.send("404: Amiibo not found!");
            });
    },
    unique(array) {
        let seen = {};
        return array.filter((item) => {
            return seen.hasOwnProperty(item) ? false : (seen[item] = true);
        });
    }
};