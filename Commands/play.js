const iris = require('../iris.js');
const ytdl = require('ytdl-core');
const fs = require('fs');
module.exports = {
    name: 'play',
    description: 'Play youtube audio or audio file.',
    args: true,
    usage: '<url> or <filename>',
    guildOnly: true,
    async execute(message, args) {
		if (ytdl.validateURL(args[0])) {
			const url = String(args[0]);
			this.playURL(message, url);
		} else {
			const fileName = args.join(' ');

			if (fileName.includes('../')) { 
	    		const boi = message.client.emojis.find('name', 'boi')
	    		await message.react(boi);
	    		return message.reply("You can't enter the parent directory, asshole!");
    		}

			if (fs.existsSync('./Files/Audio/' + String(args[0]))) {
				this.playFile(message, args[0]);
			} else message.reply("I'm sorry. I couldn't find a file with that name to play.");
		}
    },
    playFile(message, file) {
	if (message.member.voiceChannel) {
		message.member.voiceChannel.join()
			.then(connection => {
			// connection is an instance of VoiceConnection

				// get filepath and create dispatcher
				const filepath = './Files/Audio/' + String(file);
				const dispatcher = connection.playFile(filepath);

				// catch errors
				dispatcher.on('error', e => console.log(e));

				// Leave voice channel when done playing
				dispatcher.on('end', () => message.member.voiceChannel.leave());
			})
			.catch(console.log);
		} else message.reply('You need to join a voice channel first!');
	},
	playURL(message, url) {
		if (message.member.voiceChannel) {
			message.member.voiceChannel.join()
				.then(connection => {
					const stream = ytdl(url, { filter: 'audioonly' });
					const dispatcher = connection.playStream(stream);

					stream.on('info', info => {
						title = info.title;
						message.channel.send(iris.wrap("Now playing: " + title));
					});

					dispatcher.on('error', e => console.log(e));
					
					dispatcher.on('end', () => message.member.voiceChannel.leave());

					dispatcher.on('debug', info => console.log(info));
				})
				.catch(console.log);
		} else message.reply("You need to join a voice channel first!");
	},

};