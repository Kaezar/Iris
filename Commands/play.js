const iris = require('../iris.js');
module.exports = {
    name: 'play',
    description: 'Play youtube audio or audio file.',
    execute(message, args) {
        if (args[0] == null) return message.reply("You need to specify the url of a youtube video or the name of a file to play!");

		if (ytdl.validateURL(args[0])) {
			const url = String(args[0]);
			this.playURL(message, url);
		} else if (fs.existsSync('./Audio/' + String(args[0]))) {
			this.playFile(message, args[0]);
		} else {
			message.reply("I'm sorry. I couldn't find a file with that name to play.");
		}
    },
    playFile(message, file) {
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
	},
	playURL(message, url) {
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
	},

};