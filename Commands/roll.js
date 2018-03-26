const iris = require('../iris.js');
const { Rolls } = require('../dbObjects.js');
var roller = module.exports = {
	name: 'roll',
	description: 'Roll dice.',
    args: true,
    usage: '<x>d<y>+<mod> adv (+<mod> and adv optional) or <saved roll name> adv (adv optional)',
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
	// call iris' roll dice to get result, add modifier, send result, check for crit
	roll(message, dice, mod) {
		let result = iris.rollDice(dice[0], dice[1]);
		const critCheck = result;

		// If there is a mod, make absolutely sure mod and result are integers, and then add them together
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
	// check if roll given in arguments is valid dice roll
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