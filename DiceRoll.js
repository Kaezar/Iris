/**
 * DiceRoll class
 * @module DiceRoll
 */
module.exports = class DiceRoll {
    // count is the number of dice, and sides is the number of sides each die has.
    // mod is a number to add to the result after rolling all dice, or undefined if
    // no mod is given.
    constructor(count, sides, mod) {
        this.count = count;
        this.sides = sides;
        this.mod = mod || undefined;
    }
    /**
     * roll a number of dice equal to count, with a number of sides equal to sides
     * then if there is a mod, add it to the result.
     * @return {number} result of the roll
     */
    roll() {
        let result = 0;
		for(let i = 0; i < this.count; i++) {
			result += Math.floor(Math.random() * this.sides) + 1;
		}
        if (this.mod) {
            result += this.mod;
        }
		return result;
    }
}
