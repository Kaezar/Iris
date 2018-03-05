const Discord = require("discord.js");
const Sequelize = require("sequelize");
const Translate = require('@google-cloud/translate');
const fs = require('fs');
const pmx = require('pmx');
const bot = new Discord.Client();
const source = getSource();
exports.source = source;
const { prefix, token, kyleID } = require("./config.json");
exports.prefix = prefix;

// initialize connection to google cloud translation API
const translate = new Translate();
exports.translate = translate;

// get commands
bot.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands');
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    // set a new item in the Collection
    // with the key as the command name and the value as the exported module
    bot.commands.set(command.name, command);
}
// ready message
bot.on('ready', () => {
	//process.send('ready');
	let activityRoll = rollDice(1, 2);
	let activity = {
		type: (activityRoll === 1 ? "LISTENING" : "WATCHING"), 
		activity: (activityRoll === 1 ? "everything you say" : "you")
	};
	bot.user.setActivity(activity.activity, { type: activity.type });
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

	const mess = message.content.toLowerCase();	

	// politeness
	if(mess.includes('thanks, iris') || 
		mess.includes('thanks iris') || 
		mess.includes('thank you iris') || 
		mess.includes('thank you, iris')) 
	{
		message.channel.send(`You're welcome, ${author}`);
	}
	// greeting
	if(mess.includes('hello') && mess.includes('iris')) {
		message.channel.send(`Hello ${author}`);
	}
	// love
	if(mess.includes('i love you iris') || mess.includes('i love you, iris')) {
		message.channel.send(`I love you too ${author}`);
	}
	// forgiveness
	if(mess.includes('sorry, iris') || mess.includes('sorry iris')) {
		message.channel.send(`It's okay ${author}. I forgive you.`);
	}
	// portal jokes
	if(mess.includes('portal') || 
		mess.includes('science') || 
		mess.includes('cake') || 
		mess.includes('testing') || 
		mess.includes('aperture') || 
		mess.includes('glados') || 
		mess.includes('you monster')) 
	{
		const cube = bot.emojis.find('name', 'companioncube');
		message.react(cube);
	}
	// responds with user avatar image
	if(mess.includes('what is my avatar') || 
		mess.includes("what's my avatar") || 
		mess.includes("what does my avatar look like")) 
	{
		return message.reply(message.author.avatarURL);

	}
	if(mess.includes('what is your avatar iris') || 
		mess.includes('what is your avatar, iris') || 
		mess.includes('iris what is your avatar') || 
		mess.includes('iris, what is your avatar')) 
	{
		return message.reply(bot.user.avatarURL);
	}
	if(mess.includes('bepis')) {
		const bepis = bot.emojis.find('name', 'BEPIS');
		message.react(bepis);
	}
	if(mess.includes('blood for the blood god')) {
		message.channel.send('Skulls for the skull throne!');
	}
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
		if (mess.includes('your avatar')) {
			message.reply(bot.user.avatarURL);
		}
		if (mess.includes('your source')) {
			message.channel.send(getSource(), { code: 'javascript', split: true });
		}
		if (mess.includes('my avatar')) {
			message.reply(message.author.avatarURL);
		}
		if (mess.includes('good') && mess.includes('bot')) {
			message.channel.send(`Thank you ${author}! I enjoy head pats as a sign of appreciation.`);
		}
	}
	// regular expression to test for prefix or @mention
	const prefixRegex = new RegExp(`^(<@!?${bot.user.id}>|\\${prefix})\\s*`);

	// commands
	if (prefixRegex.test(message.content)) {

		// gets the matched prefix or mention
    	const [, matchedPrefix] = message.content.match(prefixRegex);
    	// args is every word in the message except the prefix, separated by whitespace
    	const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
		
		// cmd is the word immediately following the prefix
		const cmd = args.shift().toLowerCase();

		if (!bot.commands.has(cmd)) return;

		const command = bot.commands.get(cmd);

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
/*
pmx.action('heartbeat', (reply) => {
	reply({ answer: bot.ping });
});
*/
// catch unhandled promise rejections
process.on('unhandledRejection', error => console.error(`Uncaught Promise Rejection:\n${error}`));