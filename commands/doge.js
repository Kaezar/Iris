const iris = require('../iris.js');
const snekfetch = require('snekfetch');
var Doge = module.exports = {
    name: 'doge',
    description: 'Get Dogecoin\'s current value in USD.',
    execute(message) {
        snekfetch.get('https://min-api.cryptocompare.com/data/price').query({ fsym: 'DOGE', tsyms: ['BTC'] })
            .then((doge) => message.channel.send(`The current price of Dogecoin is ${doge.body.BTC} USD.`))
            .catch((error) => console.error(error));
    }
};