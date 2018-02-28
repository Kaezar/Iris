var pat = module.exports = {
    name: 'pat',
    description: 'Gives a head pat. Additional pats after first increase count accordingly.',
    pats: 0,
    execute(message, args) {
        message.react("❤");
        pat.pats++;
        for (let i = 0; i < args.length; i++) {
			if (args[i] === "pat") pat.pats++;
		}
    },
};