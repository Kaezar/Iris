/**
* Doge command
* @module Commands/doge
*/
const iris = require('../iris.js');
const snekfetch = require('snekfetch');
var Doge = module.exports = {
    name: 'doge',
    description: 'Get Dogecoin\'s current value in USD.',
    /**
    * Gets the current price of {@link http://dogecoin.com/ Dogecoin} from {@link https://min-api.cryptocompare.com/ Cyptocompare}.
    * @param  {Message} message The {@link https://discord.js.org/#/docs/main/stable/class/Message message} containing the command
    * @param  {string[]} args    Array of words following the command
    */
    execute(message) {
        snekfetch.get('https://min-api.cryptocompare.com/data/price').query({ fsym: 'DOGE', tsyms: ['BTC'] })
        .then((doge) => message.channel.send(`The current price of Dogecoin is ${doge.body.BTC} USD.`))
        .catch((error) => console.error(error));
    }
};
