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
	if(message.author == bot.user) {
		return;
	}

	const author = message.author;

	const mess = message.content.toLowerCase();

	if (message.guild) {
		var isAdmin = message.channel.permissionsFor(message.member).has("ADMINISTRATOR");
	}

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
				const adv = args[1];
				parseRoll(message, dice, adv);
			} else {
				message.reply("You need to give a valid dice roll of the form: xdy+mod (+mod optional)!");
			}
			break;

			case "rocks":
			message.channel.send("Rocks fall. Everyone dies.");
			break;

			case "play":
			if (args[0] != null) {
				if (args[0].substring(0, 29) == "https://www.youtube.com/watch" || args[0].substring(0, 28) == "http://www.youtube.com/watch") {
					const url = String(args[0]);
					playURL(message, url);
				} else {
					playFile(message, args[0]);
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
			record(message);
			break;

			case "test":
			if (args[0] != null) {
				if (args[0].substring(0, 29) == "https://www.youtube.com/watch" || args[0].substring(0, 28) == "http://www.youtube.com/watch") {
					const url = String(args[0]);
					if (message.member.voiceChannel) {
		message.member.voiceChannel.join()
			.then(connection => {
				console.log(url);
				const stream = ytdl(url, { filter: 'audioonly' });
				const dispatcher = connection.playStream(stream);

				dispatcher.on('error', e => {
					// Catch any errors that may arise
					console.log(e);
					});
				
				dispatcher.on('end', () => {
					//console.log("leaving voice channel");
					message.member.voiceChannel.leave();
				});
				
				dispatcher.on('start', () => {
					console.log("starting stream");
				});

				dispatcher.on('debug', info => {
					console.log(info);
				});
			})
			.catch(console.log);
	} else {
		message.reply("You need to join a voice channel first!");
	}
				} else {
					playFile(message, args[0]);
				}
			} else {
				message.reply("You need to specify the url of a youtube video or the name of a file to play!");
			}
			break;

		}
	}
});

bot.login(token);

function parseRoll(message, dice, adv) {
	const preMod = dice[1].split("+");
		let checker = preMod[1];
		checker = parseInt(checker);
		if(!isNaN(checker)) {
			var mod = preMod[1];
			dice.pop();
			dice.push(preMod[0]);
		}
		if (!isNaN(dice[0]) && !isNaN(dice[1]) && dice.length == 2) {
			if(adv != null && adv.toLowerCase() == 'adv') {
				roll(message, dice, mod);
			}
			roll(message, dice, mod);
		} else {
			message.reply("You need to give a valid dice roll of the form: xdy+mod (+mod optional)!");
		}
}

function roll(message, dice, mod) {
	let result = rollDice(dice[0], dice[1]);
	const critCheck = result;

	if(!isNaN(mod)) {
		result = parseInt(result);
		mod = parseInt(mod);
		result = result + mod;
	}
	message.channel.send(result);
	if (dice[0] == 1 && dice[1] == 20 && critCheck == 20) {
		const nat20 = bot.emojis.find('name', 'nat20');
		message.channel.send(`Natural 20! ${nat20}`);
	}
}

function rollDice(count, sides) {
	var result = 0;
	for(var i = 0; i < count; i++) {
		result += Math.floor(Math.random() * sides) + 1;
	}
	return result;
}

function say(message, phrase) {
	if (message.member.voiceChannel) {
		message.member.voiceChannel.join()
				.then(connection => {
				// Connection is an instance of VoiceConnection
					const execSync = require('child_process').execSync;
					const command = 'say -o ./Audio/sayfile.mp4 ' + '"' + String(phrase) + '"';

					var child = execSync(command, (error, stdout, stderr) => {
						if(error) {
							console.error(stderr);
							return;
						}
					});
					const dispatcher = connection.playFile('./Audio/sayfile.mp4');

					dispatcher.on('error', e => {
						// Catch any errors that may arise
						console.log(e);
					});

					dispatcher.on('end', () => {
						message.member.voiceChannel.leave();
					});
				})
				.catch(console.log);
			} else {
				message.reply('You need to join a voice channel first!');
			}
}

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

						// leave voice channel when done speaking
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
				console.log(url);
				const stream = ytdl(url, { filter: 'audioonly' });
				const dispatcher = connection.playStream(stream);

				dispatcher.on('error', e => {
					// Catch any errors that may arise
					console.log(e);
					});
				
				dispatcher.on('end', () => {
					//console.log("leaving voice channel");
					message.member.voiceChannel.leave();
				});
				
				dispatcher.on('start', () => {
					console.log("starting stream");
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
			// speaking event is emitted when a user starts and stops speaking
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

// catch unhandled promise rejections
process.on('unhandledRejection', error => console.error(`Uncaught Promise Rejection:\n${error}`));
