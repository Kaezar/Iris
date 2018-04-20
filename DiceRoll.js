class DiceRoll {
    constructor(count, sides, mod) {
        this.count = count;
        this.sides = sides;
        this.mod = mod || undefined;
    }
    roll() {
        let result = 0;
		for(let i = 0; i < this.count; i++) {
			result += Math.floor(Math.random() * this.sides) + 1;
		}
        if (this.mod) {
            result += mod;
        }
		return result;
    }
}
