const iris = require('../iris.js');
var roller = module.exports = {
	name: 'roll',
	description: 'Roll dice.',
    args: true,
    usage: '<x>d<y>+<mod> adv (+<mod> and adv optional)',
	execute(message, args) {
		const dice = args[0].split("d");
		// in the roll formula, dice is an array that contains either x and y, or x and y+mod
		const adv = args[1];
		// adv should be the string: "adv". This is checked later

		// Premod is two numbers: the number of 
		if (dice[1] == null) return message.reply("You need to give a valid dice roll of the form: xdy+mod (+mod optional)!");
		const preMod = dice[1].split("+");
		// In the roll formula, premod is an array that contains either y and mod, or y and undefined (because no mod)

		/* Determine if checker is a number (valid modifier).
		* If so, separates the mod from preMod and replaces y+mod in dice with y from preMod.
		* dice now contains x and y
		*/
		let mod;
		if(iris.numCheck(preMod[1])) {
			mod = preMod[1];
			dice.pop();
			dice.push(preMod[0]);
		}
		// Check if x and y are numbers
		if (iris.numCheck(dice[0]) && iris.numCheck(dice[1]) && dice.length === 2) {
			let advRoll;
			let rolly;
			let result;
			// Roll an extra time if adv
			if(adv != null && adv.toLowerCase() === 'adv') {
				advRoll = roller.roll(message, dice, mod);
			}
			rolly = roller.roll(message, dice, mod);
			// return the higher of the two rolls if adv, else return roll
			if (advRoll) {
				result = ((advRoll > rolly) ? advRoll : rolly);
			} else result = rolly;
			return result;
		} else {
			message.reply("You need to give a valid dice roll of the form: xdy+mod (+mod optional)!");
		}
	},
	roll(message, dice, mod) {
		let result = iris.rollDice(dice[0], dice[1]);
		const critCheck = result;

		// If there is a mod, make absolutely sure mod and result are integers, and then add them together
		if(mod) {
			result = Number(result);
			mod = Number(mod);
			result += mod;
		}
		message.channel.send(result);
		// If roll is 1d20 and result (sans mod) is 20, send congratulatory message
		if (dice[0] == 1 && dice[1] == 20 && critCheck == 20) {
			const nat20 = bot.emojis.find('name', 'nat20');
			message.channel.send(`Natural 20! ${nat20}`);
		}
		return result;
	},
};