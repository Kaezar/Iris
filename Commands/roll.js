/**
* Roll command
* @module Commands/roll
*/
const iris = require('../iris.js');
const { Rolls } = require('../dbObjects.js');
var roller = module.exports = {
	name: 'roll',
	description: 'Roll dice.',
	args: true,
	usage: '<x>d<y>+<mod> adv (+<mod> and adv optional) or <saved roll name> adv (adv optional)',
	/**
	* If the roll provided in the first argument is a valid dice roll as checked by {@link diceCheck},
	* call {@link parseRoll} on the argument. Else, check the rolls table of the database for a
	* roll with a name matching the argument with the same user ID. If so, call {@link parseRoll}
	* on that record's dice roll. Pass the second argument to either call.
	* @param  {Message} message The {@link https://discord.js.org/#/docs/main/stable/class/Message message} containing the command
	* @param  {string[]} args    Array of words following the command
	*/
	execute(message, args) {
		check = roller.diceCheck(message, args);
		if (!check) {
			Rolls.findOne({ where: {
				name: args[0],
				user_id: message.author.id,
			}})
			.then((saved) => {
				if (saved) roller.parseRoll(message, saved.get('roll'), args[1]);
				else return message.reply('You need to give a valid dice roll of the form <x>d<y>+<mod> (+mod optional)!');
			})
			.catch((error) => console.error(error));
		} else roller.parseRoll(message, args[0], args[1]);
	},
	/**
	* Split the dice roll string up into the number of dice, number of sides
	* on each, and the modifier to add at the end (if applicable). Call
	* {@link roll} once, or twice if adv is "adv".
	* @param  {Message} message The {@link https://discord.js.org/#/docs/main/stable/class/Message message} containing the command
	* @param  {string} preRoll The string of form <x>d<y>+<mod>, where <x>, <y>, and <mod> are numbers.
	* @param  {string} adv     The second argument from "args" in {@link execute}.
	* @return {number}         The return value of {@link roll}, or the higher of both return values if adv is "adv"
	*
	*/
	parseRoll(message, preRoll, adv) {
		// in the roll formula, dice is an array that contains either x and y, or x and y+mod
		const dice = preRoll.split("d");

		// In the roll formula, premod is an array that contains either y and mod, or y and undefined (because no mod)
		const preMod = dice[1].split("+");

		/* Determine if preMod[1] is a number (valid modifier).
		* If so, separates the mod from preMod and replaces y+mod in dice with y from preMod.
		* dice now contains x and y
		*/
		let mod;
		if(iris.numCheck(preMod[1])) {
			mod = preMod[1];
			dice.pop();
			dice.push(preMod[0]);
		}

		let advRollReturn;
		let rollReturn;
		let result;
		// Roll an extra time if adv
		if(adv != null && adv.toLowerCase() === 'adv') advRollReturn = roller.roll(message, dice, mod);
		rollReturn = roller.roll(message, dice, mod);

		// return the higher of the two rolls if adv, else return roll
		if (advRollReturn) result = ((advRollReturn > rollReturn) ? advRollReturn : rollReturn);
		else result = rollReturn;

		return result;
	},
	/**
	* Call {@link rollDice} to get result, add modifier, send the result, and check
	* for a critical hit (roll of 20 on a single 20-sided die)
	* @param  {[type]} message [description]
	* @param  {string[]} dice    the number of dice and number of sides on the dice
	* @param  {string} mod     number to add to the result (or empty string)
	* @return {number}         return value from {@link rollDice} plus the modifier if applicable
	*/
	roll(message, dice, mod) {
		let result = roller.rollDice(dice[0], dice[1]);
		const critCheck = result;

		// If there is a mod, make absolutely sure mod and result are numbers, and then add them together
		if(mod) {
			result = Number(result);
			mod = Number(mod);
			result += mod;
		}

		message.channel.send(iris.wrap(String(result)));
		// If roll is 1d20 and result (sans mod) is 20, send congratulatory message
		if (dice[0] == 1 && dice[1] == 20 && critCheck == 20) {
			const nat20 = message.client.emojis.find('name', 'nat20');
			message.channel.send(`Natural 20! ${nat20}`);
		}
		return result;
	},
	/**
	* Simulate the rolling of a number of dice with a number of sides
	* @param  {number|string} count The number of dice to roll
	* @param  {number|string} sides The number of sides on the dice
	* @return {number}       The total result of all dice rolled
	*/
	rollDice(count, sides) {
		let result = 0;
		for(let i = 0; i < count; i++) {
			result += Math.floor(Math.random() * sides) + 1;
		}
		return result;
	},
	/**
	* Check if the string given in args is of the format <x>d<y>+<mod>, where <x>, <y>, and <mod> are numbers.
	* +<mod> is not necessary.
	* @param  {Message} message The {@link https://discord.js.org/#/docs/main/stable/class/Message message} containing the command
	* @param  {string[]} args    Array of words following the command
	* @return {boolean}        True if condition stated in description is true.
	*/
	diceCheck(message, args) {
		const dice = args[0].split('d');

		if (dice[1] == null) {
			return false;
		}
		const preMod = dice[1].split("+");
		let mod;
		if(iris.numCheck(preMod[1])) {
			mod = preMod[1];
			dice.pop();
			dice.push(preMod[0]);
		}
		return (iris.numCheck(dice[0]) && iris.numCheck(dice[1]) && (dice[0] > 0) && (dice[1] > 0) && dice.length === 2);
	}
};
