const Discord = require("discord.js");
const ytdl = require("ytdl-core");
const bot = new Discord.Client();
const auth = require("./auth.json");
const token = auth.token;
const fs = require('fs');
const help = getHelp();
const source = getSource();
let initiatives = {};
let pats = 0;
// ready message
bot.on('ready', () => {
	console.log('I am ready!');
	let activityRoll = rollDice(1, 2);
	let activity = {type: (activityRoll === 1 ? "LISTENING" : "WATCHING"), activity: (activityRoll === 1 ? "everything you say" : "you")};
	bot.user.setActivity(activity.activity, { type: activity.type });
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
	defaultChannel.send("Hello, my name is Iris, and I'm a bot. Thank you so much for inviting me to your channel! For a list of my commands, type '!help'");
});
// message event handler
bot.on('message', message => {
	if(message.author === bot.user || !message.member) {
		return;
	}

	const author = message.author;

	const mess = message.content.toLowerCase();

	

	// politeness
	if(mess.includes('thanks, iris') || mess.includes('thanks iris') || mess.includes('thank you iris') || mess.includes('thank you, iris')) {
		message.channel.send(`You're welcome, ${author}`);
	}

	// greeting
	if(mess.includes('hello') && mess.includes('iris')) {
		message.channel.send(`Hello ${author}`);
	}

	if(mess.includes('i love you iris') || mess.includes('i love you, iris')) {
		message.channel.send(`I love you too ${author}`);
	}

	// forgiveness
	if(mess.includes('sorry, iris') || mess.includes('sorry iris')) {
		message.channel.send(`It's okay ${author}. I forgive you.`);
	}

	// portal jokes
	if(mess.includes('portal') || mess.includes('science') || mess.includes('cake') || mess.includes('testing') || mess.includes('aperture') || mess.includes('glados') || mess.includes('you monster')) {
		const cube = bot.emojis.find('name', 'companioncube');
		message.react(cube);
	}

	// responds with user avatar image
	if(mess.includes('what is my avatar') || mess.includes("what's my avatar") || mess.includes("what does my avatar look like")) {
		return message.reply(message.author.avatarURL);

	}

	if(mess.includes('what is your avatar iris') || mess.includes('what is your avatar, iris') || mess.includes('iris what is your avatar') || mess.includes('iris, what is your avatar')) {
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

	// commands
	if (message.content.substring(0, 1) === "!") {
		// args are each word after !
		let args = message.content.substring(1).split(' ');
		// cmd is the word immediately following the !
		const cmd = args[0].toLowerCase();
		// remove cmd from args
		args = args.splice(1);
		// the voice channel the message author is in (if any)
		const voiceChannel = message.member.voiceChannel;

		switch(cmd) {
			case "ping":
			message.channel.send("pong");
			break;

			// roll dice
			case "roll":
			if(args[0] != null) {
				const dice = args[0].split("d");
				// in the roll formula, dice is an array that contains either x and y, or x and y+mod
				const adv = args[1];
				// adv should be the string: "adv". This is checked later
				parseRoll(message, dice, adv, true);
			} else {
				message.reply("You need to give a valid dice roll of the form: xdy+mod (+mod optional)!");
			}
			break;

			// d&d joke
			case "rocks":
			message.channel.send(wrap("Rocks fall. Everyone dies."));
			break;

			case "play":
			if (args[0] != null) {
				if (ytdl.validateURL(args[0])) {
					const url = String(args[0]);
					playURL(message, url);
				} else if (fs.existsSync('./Audio/' + String(args[0]))) {
					playFile(message, args[0]);
				} else {
					message.reply("I'm sorry. I couldn't find a file with that name to play.")
				}
			} else {
				message.reply("You need to specify the url of a youtube video or the name of a file to play!");
			}
			break;

			case "say":
			if (!message.guild) break;

			if (!isAdmin(message.member)) {
				message.reply("You don't have permission to tell me what to say!");
			} else if (args[0] != null) {
				const phrase = message.content.substring(5);
				say(message, phrase);
			} else {
				message.reply("You need to specify a phrase for me to say!");
			}
			break;

			case "reminder":
			reminder(message, args[0], args[1]);
			break;

			// join voice channel
			case "join":
			if (voiceChannel) {
				voiceChannel.join();
			} else {
				message.reply('You need to join a voice channel first!');
			}
			break;

			// leave voice channel
			case "leave":
			if (voiceChannel) {
				voiceChannel.leave();
			} else {
				message.reply('You need to join a voice channel first!');
			}
			break;

			// send a message containing the commands section of the bot's readme file
			case "help":
			message.channel.send(help, { code: 'markdown', split: true });
			break;

			case "source":
			message.channel.send(source, { code: 'javascript', split: true });
			break;

			/**
			* Start recording audio in voice channel.
			* Saves each speach segment (start of speach to stop) as a new PCM file.
			* Use !leave to end recording.
			*/
			case "record":
			record(message);
			break;

			case "pause":
			pause(message);
			break;

			case "resume":
			resume(message);
			break;

			case "init":
			initiative(message, args);
			break;

			case "pat":
			message.react("❤");
			pats++;
			for (i = 0; i < args.length; i++) {
				if (args[i] === "pat") pats++;
			}
			break;

			case "pats":
			message.channel.send(`Pats this session: ${pats}`);
			break;

			case "destroy":
			if (message.author.id !== "202228363958550529") return message.reply("Only Kyle has permission to destroy me!");
			message.reply("You may destroy me, but you'll never destroy my love for Kat!")
				.then( () => {
					bot.destroy();
				});
			break;
		}
	}
});

bot.login(token);

// Split the command into the individual parts of the roll formula (xdy+mod) and call roll
function parseRoll(message, dice, adv, print) {
	// Premod is two numbers: the number of 
	if (dice[1] == null) return message.reply("You need to give a valid dice roll of the form: xdy+mod (+mod optional)!");
	const preMod = dice[1].split("+");
	// In the roll formula, premod is an array that contains either y and mod, or y and undefined (because no mod)

	/* Determine if checker is a number (valid modifier).
	* If so, separates the mod from preMod and replaces y+mod in dice with y from preMod.
	* dice now contains x and y
	*/
	let mod;
	if(numCheck(preMod[1])) {
		mod = preMod[1];
		dice.pop();
		dice.push(preMod[0]);
	}
	// Check if x and y are numbers
	if (numCheck(dice[0]) && numCheck(dice[1]) && dice.length === 2) {
		let advRoll;
		let rolly;
		let result;
		// Roll an extra time if adv
		if(adv != null && adv.toLowerCase() === 'adv') {
			advRoll = roll(message, dice, mod, print);
		}
		rolly = roll(message, dice, mod, print);
		// return the higher of the two rolls if adv, else return roll
		if (advRoll) {
			result = ((advRoll > rolly) ? advRoll : rolly);
		} else result = rolly;
		return result;
	} else {
		message.reply("You need to give a valid dice roll of the form: xdy+mod (+mod optional)!");
	}
}

// Call rollDice to do the calculation, add mod if mod exists, check for crits, and send message with result.
function roll(message, dice, mod, print) {
	let result = rollDice(dice[0], dice[1]);
	const critCheck = result;

	// If there is a mod, make absolutely sure mod and result are integers, and then add them together
	if(mod) {
		result = Number(result);
		mod = Number(mod);
		result += mod;
	}
	if (print) message.channel.send(result);
	// If roll is 1d20 and result (sans mod) is 20, send congratulatory message
	if (dice[0] == 1 && dice[1] == 20 && critCheck == 20) {
		const nat20 = bot.emojis.find('name', 'nat20');
		message.channel.send(`Natural 20! ${nat20}`);
	}
	return result;
}

// Roll x y-sided dice and total the outcomes. x is count and y is sides
function rollDice(count, sides) {
	let result = 0;
	for(i = 0; i < count; i++) {
		result += Math.floor(Math.random() * sides) + 1;
	}
	return result;
}

/* Use tts program to generate speech of given phrase and stream it over voice channel.
* The bottleneck of this function in terms of execution time is the generation of an output file 
* and the subsequent reading of that output file to the dispatcher. I currently don't have a 
* solution to this bottleneck.
*/
function say(message, phrase) {
	if (message.member.voiceChannel) {
		message.member.voiceChannel.join()
				.then(connection => {
				// Connection is an instance of VoiceConnection

					// Synchronously execute a child process, which is macOS' say command. Pipes output to file.
					const execSync = require('child_process').execSync;
					const command = 'say -v victoria -o ./Audio/sayfile.mp4 ' + '"' + String(phrase) + '"';
					var child = execSync(command, (error, stdout, stderr) => {
						if(error) {
							console.error(stderr);
							return;
						}
					});
					// Stream file to voice channel
					const dispatcher = connection.playFile('./Audio/sayfile.mp4');
					dispatcher.on('error', e => {
						// Catch any errors that may arise
						console.log(e);
					});
					// Leave voice channel when done playing
					dispatcher.on('end', () => {
						message.member.voiceChannel.leave();
					});
				})
				.catch(console.log);
			} else {
				message.reply('You need to join a voice channel first!');
			}
}

// Play contents of given audio file over voice channel
function playFile(message, file) {
	if (message.member.voiceChannel) {
				message.member.voiceChannel.join()
					.then(connection => {
					// connection is an instance of VoiceConnection


						const filepath = './Audio/' + String(file);
						const dispatcher = connection.playFile(filepath);

						dispatcher.on('error', e => {
							// Catch any errors that may arise
							console.log(e);
						});

						// Leave voice channel when done playing
						dispatcher.on('end', () => {
							message.member.voiceChannel.leave();
						});
					})
					.catch(console.log);
				} else {
					message.reply('You need to join a voice channel first!');
				}
}

function playURL(message, url) {
	if (message.member.voiceChannel) {
		message.member.voiceChannel.join()
			.then(connection => {
				const stream = ytdl(url, { filter: 'audioonly' });
				const dispatcher = connection.playStream(stream);

				stream.on('info', info => {
					title = info.title;
					message.channel.send(wrap("Now playing: " + title));
				});

				dispatcher.on('error', e => {
					// Catch any errors that may arise
					console.log(e);
				});
				
				dispatcher.on('end', () => {
					message.member.voiceChannel.leave();
				});

				dispatcher.on('debug', info => {
					console.log(info);
				});
			})
			.catch(console.log);
	} else {
		message.reply("You need to join a voice channel first!");
	}
}

function record(message) {
	if (!isAdmin(message.member)) return message.reply("You don't have permission to do that!");
	if (message.member.voiceChannel) {
		const voiceChannel = message.member.voiceChannel;
		message.member.voiceChannel.join()
		.then(connection => {
		// connection is an instance of VoiceConnection
			// receiver is of the VoiceReceiver class
			const receiver = connection.createReceiver();

			// Catch any errors that may arise
			receiver.on('warn', (reason, warning) => {
				console.log(`${reason} error: ${warning}`);
			});

			connection.on('speaking', (user, speaking) => {
				// speaking is true while the user is speaking
				if (speaking) {
					// console.log('begin stream: ' + Date.now());

					// create readable stream
					const audioStream = receiver.createPCMStream(user);
					// function returns writable stream (file)
					const outputStream = generateOutputFile(voiceChannel, user);

					// write to file
					audioStream.pipe(outputStream);
					/*
					audioStream.on('end', () => {
						console.log('end stream: ' + Date.now());
					});
					*/
					}
				});
		})
		.catch(console.log);
	} else {
		message.reply("You need to join a voice channel first!");
	}
}

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

function generateOutputFile(channel, user) {
  const fileName = `./Audio/Recordings/${channel.name}-${user.username}-${Date.now()}.pcm`;
  return fs.createWriteStream(fileName);
}

function getHelp() {
	const execSync = require('child_process').execSync;
	var child = execSync("sed -n -e '/Command/,$p' README.md", (error, stdout, stderr) => {
	// var child = execSync('cat README.md', (error,stdout,stderr) => {
		if (error) {
			console.error(stderr);
			return;
		}
	});
	return child;
}

function reminder(message, channel, time) {
	let chan = message.channel.guild.channels.find('name', 'general');
	if (channel != null && time != null) {
		chan = message.channel.guild.channels.find('name', channel);
		if (chan !== undefined) {
			if (chan.type === 'text') {
				message.delete();
				chan.send(`Reminder: Game tonight starts at ${time}. I hope to "see" you all there!`);
			} else {
				message.reply('The channel must be a guild text channel!');
			}
		} else {
			message.reply(`I'm sorry. I can't seem to find the channel: ${channel}`);
		}
	} else {
		message.reply('You need to specify a channel name and meeting time!');
	}
}

function wrap(text) {
	return '```\n' + text.replace(/`/g, '`' + String.fromCharCode(8203)) + '\n```';
}

function pause(message) {
	const voiceConnection = bot.voiceConnections.find(val => val.channel.guild.id === message.guild.id);
	if (voiceConnection === null) return message.reply("I have to be playing something to pause it, dummy!");
	const dispatcher = voiceConnection.dispatcher;
	if (!dispatcher.paused) {
		dispatcher.pause();
		message.channel.send(wrap("Playback paused."));
	} else {
		message.channel.send(wrap("Playback is already paused!"));
	}
}

function resume(message) {
	const voiceConnection = bot.voiceConnections.find(val => val.channel.guild.id === message.guild.id);
	if (voiceConnection === null) return message.reply("I have to be playing something to resume playing it, dummy!");
	const dispatcher = voiceConnection.dispatcher;
	if (dispatcher.paused) {
		dispatcher.resume();
		message.channel.send(wrap("Playback resumed."));
	} else {
		message.channel.send(wrap("Playback is not paused!"));
	}
}

// Note to self: fix this unholy abomination of a function
function initiative(message, args) {
	switch(args[0]) {
		case "list":
		return listInitiative(message);
		case "clear":
		return clearInitiative(message);
		case "roll": 
		if (args[1] == null) return message.reply("You need to give a valid dice roll of the form: xdy+mod (+mod optional)!");
		const dice = args[1].split("d");
		let adv;
		let hitPoints;
		if (args[2] === "adv") {
			adv = args[2];
		} else {
			hitPoints = args[2];
			adv = args[3];
			if ((hitPoints !== undefined) && (!numCheck(hitPoints))) return message.reply("Not a valid hit point value!");
		}
		const roll = Number(parseRoll(message, dice, adv, false));
		if (numCheck(roll)) { 
			return addInitiative(message, nickOrUser(message.member), roll, true, hitPoints); 
		} else return;
		case "rem":
		return removeInitiative(message, args[1]);
	}
	if (!numCheck(args[0])) {
		if (!isAdmin(message.member)) return message.reply("You don't have permission to add NPCs to the initiative!");
		let num = 1;
		let roll;
		let adv = "";
		let name;
		let dice;
		if (args[1] === "roll") {
			if (args[2] == null) return message.reply("You need to give a valid dice roll of the form: xdy+mod (+mod optional)!");
			dice = args[2].split("d");
			if (args[3] === "adv") {
				adv = args[3];
				if (numCheck(args[4])) num = args[4];
			} else if (numCheck(args[3])) num = args[3];
		} else {
			if (numCheck(args[2])) num = args[2];
			roll = args[1];
		}
		for (i = 0; i < num; i++) {
			if (dice) {
				roll = Number(parseRoll(message, dice, adv, false));
				if (!numCheck(roll)) return;
			}
			if (num === 1) {
				addInitiative(message, args[0], roll, false);
			} else {
				name = `${args[0]} ${i + 1}`;
				addInitiative(message, name, roll, false);
			}
		}
	} else {
		const hitPoints = args[1];
		if ((hitPoints !== undefined) && (!numCheck(hitPoints))) return message.reply("Not a valid hit point value!");
		addInitiative(message, nickOrUser(message.member), args[0], true, hitPoints);
	}
}

function getInitiative(guild) {
	if (!initiatives[guild]) initiatives[guild] = [];
	return initiatives[guild];
}

// add entry to initiative list
function addInitiative(message, name, init, player, hitPoints) {
	if (init == null) return message.reply("You need to specify an initiative value!");
	const score = Number(init);
	if (!numCheck(score)) return message.reply("Initiative needs to be a number!");
	const initiative = getInitiative(message.guild.id);
	if (player) {
		initiative.push({name: name, score: init, player: message.member, hp: hitPoints});
	} else initiative.push({name: name, score: init, player: false, hp: hitPoints});
	initiative.sort(initCmp);
	if (hitPoints) message.channel.send(wrap(`Added ${name} with initiative ${init}.`));
	message.channel.send(wrap(`Added ${name} with initiative ${init}.`));
}

// compare function: compare the scores of initiative list entries
function initCmp(a, b) {
	const scoreA = a.score;
	const scoreB = b.score;
	return scoreB - scoreA;
}

// lists rank, name, and initiative score of every combatant, sorted by score desc.
function listInitiative(message) {
	const initiative = getInitiative(message.guild.id);
	const items = initiative.map(mapFnc);
	const list = items.join("\n");
	message.channel.send(wrap("Initiative:\n" + list));
}

// clear initiative list
function clearInitiative(message) {
	if (!isAdmin(message.member)) return message.reply("You don't have permission to do that!");
	const initiative = getInitiative(message.guild.id);
	initiative.splice(0, initiative.length);
	message.channel.send(wrap("Initiative cleared!"));
}

// remove entry of specified rank from initiative list
function removeInitiative(message, rank) {
	if (!isAdmin(message.member)) return message.reply("You don't have permission to do that!");
	if (!numCheck(rank)) return message.reply("That initiative rank does not exist!");
	const initiative = getInitiative(message.guild.id);
	const index = rank - 1;
	if (!initiative[index]) return message.reply("That initiative rank does not exist!");
	message.channel.send(wrap(`Removed ${initiative[index].name} from initiative.`));
	initiative.splice(index, 1);
}

// helper function for listInitiative
function mapFnc(item, index) {
	if (item.hp) return `${index + 1}. ${item.name} ${item.hp}HP`
	else return `${index + 1}. ${item.name}`;
}

function modifyHitpoints(message, val, set) {

}

// check if admin
function isAdmin(member) {
	return member.hasPermission("ADMINISTRATOR", { checkAdmin: true });
}

// returns nickname if there is one, else username
function nickOrUser(member) {
	return (member.nickname ? member.nickname : member.user.username);
}

// checks if suspect is a number
function numCheck(suspect) {
	const check1 = parseInt(suspect);
	const check2 = Number(suspect);
	return (!isNaN(check1) && !isNaN(check2));
}

// catch unhandled promise rejections
process.on('unhandledRejection', error => console.error(`Uncaught Promise Rejection:\n${error}`));
