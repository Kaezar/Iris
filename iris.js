const Discord = require("discord.js");
const ytdl = require("ytdl-core");
const bot = new Discord.Client();
const auth = require("./auth.json");
const token = auth.token;
const fs = require('fs');
const help = getHelp();
const source = getSource();
// ready message
bot.on('ready', () => {
	console.log('I am ready!');
	bot.user.setActivity("you", { type: "WATCHING" });
});
// event handler for when bot is added to a guild.
bot.on('guildCreate', guild => {
	let defaultChannel = "";
	guild.channels.forEach((channel) => {
		if(channel.type == "text" && defaultChannel == "") {
			if(channel.permissionsFor(guild.me).has("SEND_MESSAGES")) {
				defaultChannel = channel;
			}
		}
	});
	defaultChannel.send("Hello, my name is Iris, and I'm a bot. Thank you so much for inviting me to your channel! For a list of my commands, type '!help'");
});
// message event handler
bot.on('message', message => {
	if(message.author == bot.user || !message.member) {
		return;
	}

	const author = message.author;

	const mess = message.content.toLowerCase();

	var isAdmin = message.member.hasPermission("ADMINISTRATOR", { checkAdmin: true });

	// politeness
	if(mess.includes('thanks, iris') || mess.includes('thanks iris') || mess.includes('thank you, iris') || mess.includes('thank you, iris')) {
		message.channel.send(`You're welcome, ${author}`);
	}

	// greeting
	if(mess.includes('hello, iris') || mess.includes('hello iris')) {
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
		message.reply(message.author.avatarURL);
	}

	if(mess.includes('what is your avatar iris') || mess.includes('what is your avatar, iris') || mess.includes('iris what is your avatar') || mess.includes('iris, what is your avatar')) {
		message.reply(bot.user.avatarURL);
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
	}

	// commands
	if (message.content.substring(0, 1) == "!") {
		// args are each word after !
		var args = message.content.substring(1).split(' ');
		// cmd is the word immediately following the !
		var cmd = args[0].toLowerCase();
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
				parseRoll(message, dice, adv);
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

			if (!isAdmin) {
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
			if (message.member.voiceChannel) {
				message.member.voiceChannel.join();
			} else {
				message.reply('You need to join a voice channel first!');
			}
			break;

			// leave voice channel
			case "leave":
			if (message.member.voiceChannel) {
				message.member.voiceChannel.leave();
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
			if (!isAdmin) return message.reply("You don't have permission to do that!");
			record(message);
			break;

			case "pause":
			pause(message);
			break;

			case "resume":
			resume(message);
			break;
		}
	}
});

bot.login(token);

// Split the command into the individual parts of the roll formula (xdy+mod) and call roll
function parseRoll(message, dice, adv) {
	// Premod is two numbers: the number of 
	const preMod = dice[1].split("+");
	// In the roll formula, premod is an array that contains either y and mod, or y and undefined (because no mod)
	let checker = preMod[1];
	// Checker is mod if there is a mod, else undefined
	checker = parseInt(checker);

	/* Determine if checker is a number (valid modifier).
	* If so, separates the mod from preMod and replaces y+mod in dice with y from preMod.
	* dice now contains x and y
	*/
	if(!isNaN(checker)) {
		var mod = preMod[1];
		dice.pop();
		dice.push(preMod[0]);
	}
	// Check if x and y are numbers
	if (!isNaN(dice[0]) && !isNaN(dice[1]) && dice.length == 2) {
		// Roll an extra time if adv
		if(adv != null && adv.toLowerCase() == 'adv') {
			roll(message, dice, mod);
		}
		roll(message, dice, mod);
	} else {
		message.reply("You need to give a valid dice roll of the form: xdy+mod (+mod optional)!");
	}
}

// Call rollDice to do the calculation, add mod if mod exists, check for crits, and send message with result.
function roll(message, dice, mod) {
	let result = rollDice(dice[0], dice[1]);
	const critCheck = result;

	// If there is a mod, make absolutely sure mod and result are integers, and then add them together
	if(mod) {
		result = parseInt(result);
		mod = parseInt(mod);
		result = result + mod;
	}
	message.channel.send(result);
	// If roll is 1d20 and result (sans mod) is 20, send congratulatory message
	if (dice[0] == 1 && dice[1] == 20 && critCheck == 20) {
		const nat20 = bot.emojis.find('name', 'nat20');
		message.channel.send(`Natural 20! ${nat20}`);
	}
}

// Roll x y-sided dice and total the outcomes. x is count and y is sides
function rollDice(count, sides) {
	var result = 0;
	for(var i = 0; i < count; i++) {
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
		if (chan != undefined) {
			if (chan.type == 'text') {
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
	const voiceConnection = bot.voiceConnections.find(val => val.channel.guild.id == message.guild.id);
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
	const voiceConnection = bot.voiceConnections.find(val => val.channel.guild.id == message.guild.id);
	if (voiceConnection === null) return message.reply("I have to be playing something to resume playing it, dummy!");
	const dispatcher = voiceConnection.dispatcher;
	if (dispatcher.paused) {
		dispatcher.resume();
		message.channel.send(wrap("Playback resumed."));
	} else {
		message.channel.send(wrap("Playback is not paused!"));
	}
}

// catch unhandled promise rejections
process.on('unhandledRejection', error => console.error(`Uncaught Promise Rejection:\n${error}`));
