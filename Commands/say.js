/**
* Say command
* @module Commands/say
*/
const iris = require('../iris.js');
module.exports = {
    name: 'say',
    description: 'Have Iris say something.',
    args: true,
    usage: '<phrase>',
    guildOnly: true,
    /**
    * Have bot join the user's voice channel if they are in one. If platform is macOS, execute tts "say"
    * as a child process to generate audio file of the phrase given in args. Once generated, play the
    * audio file over the voice connection.
    * @param  {Message} message The {@link https://discord.js.org/#/docs/main/stable/class/Message message} containing the command
    * @param  {string[]} args    Array of words following the command
    */
    execute(message, args) {
        if (process.platform !== 'darwin') return message.reply('Sorry, wrong platform!');
        if (!message.member.voiceChannel) return message.reply('You need to join a voice channel first!');

        const phrase = args.join(" ");

        message.member.voiceChannel.join()
        .then(connection => {
            // Connection is an instance of VoiceConnection
            // Synchronously execute a child process, which is macOS' say command. Pipes output to file.
            const execSync = require('child_process').execSync;
            const command = 'say -v samantha -o ./Files/Audio/sayfile.mp4 ' + '"' + String(phrase) + '"';
            var child = execSync(command, (error, stdout, stderr) => {if (error) return console.error(stderr)});
            // Stream file to voice channel
            const dispatcher = connection.playFile('./Files/Audio/sayfile.mp4');
            dispatcher.on('error', (error) => console.error(error));
            // Leave voice channel when done playing
            dispatcher.on('end', () => message.member.voiceChannel.leave());
        })
        .catch(console.log);
    },
};
