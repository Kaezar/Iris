/**
* Play command
* @module Commands/play
*/
const iris = require('../iris.js');
const ytdl = require('ytdl-core');
const fs = require('fs');
module.exports = {
    name: 'play',
    description: 'Play youtube audio or audio file.',
    args: true,
    usage: '<url> or <filename>',
    guildOnly: true,
    /**
    * If the argument is a valid {@link https://www.youtube.com/ youtube} URL, call {@link playURL}.
    * Otherwise, check the Audio folder for a filename matching the argument(s). If found, call {@link playFile}.
    * @async
    * @param  {Message} message The {@link https://discord.js.org/#/docs/main/stable/class/Message message} containing the command
    * @param  {string[]} args    Array of words following the command
    */
    async execute(message, args) {
        if (ytdl.validateURL(args[0])) {
            const url = String(args[0]);
            this.playURL(message, url);
        } else {
            const fileName = args.join(' ');

            if (fileName.includes('../')) {
                const boi = message.client.emojis.find('name', 'boi')
                await message.react(boi);
                return message.reply("You can't enter the parent directory!");
            }

            if (fs.existsSync('./Files/Audio/' + String(args[0]))) {
                this.playFile(message, args[0]);
            } else message.reply("I'm sorry. I couldn't find a file with that name to play.");
        }
    },
    /**
    * Join the user's voice channel and play the audio file over the voice channel.
    * Leave the voice channel when done playing.
    * @param  {Message} message The {@link https://discord.js.org/#/docs/main/stable/class/Message message} containing the command
    * @param  {string} file    Name of the file to play
    */
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
    /**
    * Join the user's voice channel and use {@link https://www.npmjs.com/package/ytdl-core ytdl}
    * to play the audio from the video over the voice channel. Leave the voice channel when done playing.
    * @param  {Message} message The {@link https://discord.js.org/#/docs/main/stable/class/Message message} containing the command
    * @param  {string} url     URL of the {@link https://www.youtube.com/ youtube} video to play.
    */
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
