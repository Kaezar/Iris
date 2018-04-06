const Discord = require("discord.js");
const Sequelize = require("sequelize");
const Translate = require('@google-cloud/translate');
const fs = require('fs');
const bot = new Discord.Client();
const source = getSource();
exports.source = source;
const { prefix, token, kyleID } = require("./config.json");
exports.prefix = prefix;

// initialize connection to google cloud translation API
const translate = new Translate({ keyFilename: './service-account.json' });
exports.translate = translate;

// get commands
bot.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./Commands');
for (const file of commandFiles) {
    const command = require(`./Commands/${file}`);

    // set a new item in the Collection
    // with the key as the command name and the value as the exported module
    bot.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();


// ready message
bot.on('ready', () => {
	/*
	let activityRoll = rollDice(1, 2);
	let activity = {
		type: (activityRoll === 1 ? "LISTENING" : "WATCHING"),
		activity: (activityRoll === 1 ? "everything you say" : "you")
	};
	*/
	bot.user.setActivity("you", { type: "WATCHING" });
	console.log('I am ready!');
});
// event handler for when bot is added to a guild.
bot.on('guildCreate', guild => {
	let defaultChannel = "";
	guild.channels.forEach((channel) => {
		if(channel.type === "text" && defaultChannel === "") {
			if(channel.permissionsFor(guild.me).has("SEND_MESSAGES")) {
				defaultChannel = channel;
			}
		}
	});
	defaultChannel.send(`
		Hello, my name is Iris, and I'm a bot.\n
		Thank you so much for inviting me to your channel!\n
		For a list of my commands, type '${prefix}help'`);
});
// message event handler
bot.on('message', message => {
	if(message.author === bot.user) return;
	const author = message.author;

	responses(message);

	// regular expression to test for prefix or @mention
	const prefixRegex = new RegExp(`^(<@!?${bot.user}>|\\${prefix})\\s*`);

	// commands
	if (prefixRegex.test(message.content)) {

		// gets the matched prefix or mention
    	const [, matchedPrefix] = message.content.match(prefixRegex);
    	// args is every word in the message except the prefix, separated by whitespace
    	const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);

		// commandName is the word immediately following the prefix
		const commandName = args.shift().toLowerCase();

		const command = bot.commands.get(commandName)
			|| bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

		if (!command) return;

		if (command.guildOnly && !message.member) {
    		return message.reply('I can\'t execute that command inside DMs!');
		}

		// check permissions
		if (command.adminOnly && !isAdmin(author)) {
			return message.reply('You don\'t have permission to use that command!');
		}
		if (command.kyleOnly && message.author.id !== kyleID) {
			return message.reply('Only Kyle has permission to use that command!');
		}

		if (command.args && !args.length) {
			let reply = 'You need to provide arguments for that command!';
			if (command.usage) {
				reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
			}
			return message.reply(reply);
		}

		if (!cooldowns.has(command.name)) {
		    cooldowns.set(command.name, new Discord.Collection());
		}

		const now = Date.now();
		const timestamps = cooldowns.get(command.name);
		const cooldownAmount = (command.cooldown || 3) * 1000;

		if (!timestamps.has(author.id)) {
			timestamps.set(author.id, now);
    		setTimeout(() => timestamps.delete(author.id), cooldownAmount);
		}
		else {
		    const expirationTime = timestamps.get(author.id) + cooldownAmount;

		    if (now < expirationTime) {
		        const timeLeft = (expirationTime - now) / 1000;
		        return message.reply(`please wait ${timeLeft.toFixed(1)}
		        more second(s) before reusing the \`${command.name}\` command.`);
		    }

		    timestamps.set(message.author.id, now);
		    setTimeout(() => timestamps.delete(author.id), cooldownAmount);
		}

		try {
    		command.execute(message, args);
		}
		catch (error) {
    		console.error(error);
    		message.reply('there was an error trying to execute that command!');
		}
	}
});

bot.login(token);

function getSource() {
	const execSync = require('child_process').execSync;
	var child = execSync('cat iris.js', (error, stdout, stderr) => {
		if(error) {
			console.error(stderr);
			return;
		}
	});
	return child;
}

function isAdmin(member) {
	return member.hasPermission("ADMINISTRATOR", { checkAdmin: true });
}
/**
 * Simulate the rolling of a number of dice with a number of sides
 * @param  {number} count The number of dice to roll
 * @param  {number} sides The number of sides on the dice
 * @return {number}       The total result of all dice rolled
 */
function rollDice(count, sides) {
	let result = 0;
	for(let i = 0; i < count; i++) {
		result += Math.floor(Math.random() * sides) + 1;
	}
	return result;
}
exports.rollDice = rollDice;

exports.numCheck = function numCheck(suspect) {
	const check1 = parseInt(suspect);
	const check2 = Number(suspect);
	return (!isNaN(check1) && !isNaN(check2));
}

function wrap(text) {
	return '```\n' + text.replace(/`/g, '`' + String.fromCharCode(8203)) + '\n```';
}
exports.wrap = wrap;
/**
 * Function to handle automatic message responses
 * @param  {message} message The message to respond to
 */
function responses(message) {
	const author = message.author;

	const mess = message.content.toLowerCase();

	// politeness
	if(mess.includes('thank') && mess.includes('iris'))
	{
		message.channel.send(`You're welcome, ${author}`);
	}
	// greeting
	if((mess.includes('hello') && mess.includes('iris')) || mess.includes('hi iris')) {
		message.channel.send(`Hello ${author}`);
	}
	// love
	if(mess.includes('i love you') && mess.includes('iris')) {
		message.channel.send(`I love you too ${author}`);
	}
	// forgiveness
	if(mess.includes('sorry') && mess.includes('iris')) {
		message.channel.send(`It's okay ${author}. I forgive you.`);
	}
	// portal jokes
	if(mess.includes('portal') ||
		mess.includes('science') ||
		mess.includes('cake') ||
		mess.includes('testing') ||
		mess.includes('aperture') ||
		mess.includes('still alive') ||
		mess.includes('glados') ||
		mess.includes('you monster'))
	{
		const cube = bot.emojis.find('name', 'companioncube');
		message.react(cube);
	}
	// bepis
	if(mess.includes('bepis')) {
		message.react('🇧')
		.then(() => message.react('🇪'))
		.then(() => message.react('🇵'))
		.then(() => message.react('🇮'))
		.then(() => message.react('🇸'))
		.catch((error) => console.error(error));
	}
	// khorney jokes
	if(mess.includes('blood for the blood god')) {
		message.channel.send('💀 **Skulls for the skull throne!** 💀');
	}
	// @mention responses
	if (message.mentions.users.find('username', 'Iris')) {
		if(mess.includes('thank')) {
			message.channel.send(`You're welcome, ${author}`);
		}
		if (mess.includes('hello')) {
			message.channel.send(`Hello ${author}`);
		}
		if (mess.includes('i love you')) {
			message.channel.send(`I love you too ${author}`);
		}
		if (mess.includes('sorry')) {
			message.channel.send(`It's okay ${author}. I forgive you.`);
		}
		if (mess.includes('your source')) {
			message.channel.send(source, { code: 'javascript', split: true });
		}
		if ((mess.includes('bot') || mess.includes('🤖')) && mess.includes('good')) {
			message.channel.send(`Thank you ${author}! I enjoy head pats as a sign of appreciation.`);
		}
	}
}

// catch unhandled promise rejections
process.on('unhandledRejection', error => console.error(`Uncaught Promise Rejection:\n${error}`));
