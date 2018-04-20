/**
* Roll command
* @module Commands/roll
*/
const iris = require('../iris.js');
const { Rolls } = require('../dbObjects.js');
const DiceRoll = require('../DiceRoll.js');
var roller = module.exports = {
	name: 'roll',
	description: 'Roll dice.',
	args: true,
	usage: '<x>d<y>+<mod> adv (+<mod> and adv optional) or <saved roll name> adv (adv optional)',
	/**
	* Check if args[0] (rollString) is a valid dice roll (formula xdy+m). If not, query
	* the database for a roll with a name matching rollString and the author's user ID. If a
	* roll is found, call {@link parseRoll} on the saved rollString. If no roll is found,
	* improper syntax has been used for the rollString or the user is trying to use a roll that
	* does not exist. Either way, send a message telling them what went wrong. If rollString
	* is a valid dice roll, call {@link parseRoll} on it. Either result of {@link parseRoll} is
	* then destructured and used to construct a new DiceRoll object. call DiceRoll's {@link module:DiceRoll.roll}
	* method and {@link sendResult} once, or twice if args[1] == 'adv' (not case sensitive).
	* @param  {Message} message The {@link https://discord.js.org/#/docs/main/stable/class/Message message} containing the command
	* @param  {string[]} args    args[0] should either be a name of a roll in the DB, or a roll calculation. args[1] is adv.
	*/
	async execute(message, args) {
		const [rollString, adv] = args;
		check = roller.diceCheck(rollString);
		let parsedRoll;
		if (!check) {
			let saved = await Rolls.findOne({ where: {
				name: rollString,
				user_id: message.author.id,
			}});
			if (saved) parsedRoll = roller.parseRoll(saved.get('roll'));
			else return message.reply('You need to give a valid dice roll of the form <x>d<y>+<mod> (+mod optional), or the name of a saved roll!');
		} else parsedRoll = roller.parseRoll(rollString);

		const { count, sides, mod } = parsedRoll;

		let diceRoll = new DiceRoll(count, sides, mod);

		// Roll an extra time if adv
		if(adv != null && adv.toLowerCase() === 'adv') {
			const advRollResult = diceRoll.roll();
			roller.sendResult(message, diceRoll, advRollResult);
		}
		const rollResult = diceRoll.roll();
		roller.sendResult(message, diceRoll, rollResult);
	},
	/**
	* Split the dice roll string up into the number of dice (count), number of sides
	* on each (sides), and the modifier to add at the end (if applicable, mod). Return
	* the three values in an object.
	* @param  {Message} message The {@link https://discord.js.org/#/docs/main/stable/class/Message message} containing the command
	* @param  {string} rollString The string of form <x>d<y>+<mod>, where <x>, <y>, and <mod> are numbers.
	* @return {object}         count, sides, and mod
	*
	*/
	parseRoll(rollString) {
		// in the roll formula, dice is an array that contains either x and y, or x and y+mod
		const dice = rollString.split("d");

		// In the roll formula, premod is an array that contains either y and mod, or y and undefined (because no mod)
		const preMod = dice[1].split("+");

		/* Determine if preMod[1] is a number (valid modifier).
		* If so, separates the mod from preMod and replaces y+mod in dice with y from preMod.
		* dice now contains x and y
		*/
		let mod;
		if(iris.numCheck(preMod[1])) {
			mod = preMod[1];
			mod = Number(mod);
			dice.pop();
			dice.push(preMod[0]);
		}
		numDice = dice.map(Number);

		const countSidesMod = {count: numDice[0], sides: numDice[1], mod: mod}

		return countSidesMod;
	},
	/**
	* Check if rollString is of the format <x>d<y>+<mod>, where <x>, <y>, and <mod> are numbers.
	* +<mod> is not required.
	* @param  {string[]} rollString    String to check
	* @return {boolean}        True if condition stated in description is true.
	*/
	diceCheck(rollString) {
		const dice = rollString.split('d');

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
		const [ count, sides ] = dice;
		return (iris.numCheck(count) && iris.numCheck(sides) && (count > 0) && (sides > 0) && dice.length === 2);
	},
	/**
	 * Check to see if the result of a certain {@link module:DiceRoll}
	 * is a critical hit. A critical hit must be 1d20 (count: 1, sides: 20)
	 * and have rolled the maximum possible value not counting mod (20).
	 * @param  {DiceRoll} diceRoll {@link module:DiceRoll}
	 * @param  {number} result   The result of {@link module:DiceRoll.roll}
	 * @return {boolean}         See function description
	 */
	critCheck(diceRoll, result) {
		return (diceRoll.count == 1 && diceRoll.sides == 20 && (result == (diceRoll.sides + diceRoll.mod)));
	},
	/**
	 * Send the result of {@link module:DiceRoll.roll} to the channel.
	 * Also call {@link critCheck}, and if it returns true, send a congratulatory
	 * message to the channel as well.
	 * @param  {Message} message The {@link https://discord.js.org/#/docs/main/stable/class/Message message} containing the command
	 * @param  {DiceRoll} diceRoll {@link module:DiceRoll}
	 * @param  {number} result   The result of {@link module:DiceRoll.roll}
	 */
	sendResult(message, diceRoll, result) {
		message.channel.send(iris.wrap(String(result)));
		if (roller.critCheck(diceRoll, result)) {
			const nat20 = message.client.emojis.find('name', 'nat20');
			message.channel.send(`Natural 20! ${nat20}`);
		}
	}
};
