// import dependencies
const Discord = require("discord.js");
const Sequelize = require("sequelize");
const fs = require('fs');

// instantiate the client, call getSource, and retrieve variables from config file
const bot = new Discord.Client();
const source = getSource();
exports.source = source;
const { prefix, token, kyleID } = require("./config.json");
exports.prefix = prefix;

// get commands
// Discord's Collection class is an extension of Javascript's Map.
bot.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./Commands');
for (const file of commandFiles) {
    const command = require(`./Commands/${file}`);

    // set a new item in the Collection
    // with the key as the command name and the value as the exported module
    bot.commands.set(command.name, command);
}

// create cooldowns Collection
// the Collection is an associative array, like a map, and it will
// hold associative arrays inside it.
const cooldowns = new Discord.Collection();

// ready message
bot.on('ready', () => {
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
    // do not respond to messages from self (infinite loops are bad)
    if(message.author === bot.user) return;
    const author = message.author;
    const member = message.member;

    responses(message);

    // commands
    if (message.content.startsWith(prefix)) {

        // args is every word in the message except the prefix, separated by whitespace
        const args = message.content.slice(prefix.length).split(/ +/);

        // commandName is the word immediately following the prefix
        const commandName = args.shift().toLowerCase();

        // find the command with matching name or alias
        const command = bot.commands.get(commandName)
        || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) return;

        if (command.guildOnly && !message.member) {
            return message.reply("I can't execute that command inside DMs!");
        }

        // check permissions
        if (command.adminOnly && !isAdmin(member)) {
            return message.reply("You don't have permission to use that command!");
        }
        if (command.kyleOnly && message.author.id !== kyleID) {
            return message.reply('Only Kyle has permission to use that command!');
        }

        // check for arguments if required
        if (command.args && !args.length) {
            let reply = 'You need to provide arguments for that command!';
            if (command.usage) {
                reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
            }
            return message.reply(reply);
        }

        // add command to cooldown collection if it isn't already in it
        if (!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Discord.Collection());
        }

        // get current timestamp and the collection of timestamps for the command
        const now = Date.now();
        const timestamps = cooldowns.get(command.name);
        // set cooldown to the one listed in the command, or 3 seconds
        const cooldownAmount = (command.cooldown || 3) * 1000;

        // if the author does not have this command on cooldown, add them to the collection
        if (!timestamps.has(author.id)) {
            timestamps.set(author.id, now);
            setTimeout(() => timestamps.delete(author.id), cooldownAmount);
        } else {
            // expiration time is how long the author has until they can use the command again
            const expirationTime = timestamps.get(author.id) + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return message.reply(`please wait ${timeLeft.toFixed(1)}
                more second(s) before reusing the \`${command.name}\` command.`);
            }
            // this shouldn't be reached if the app is functioning properly, but setTimeout can
            // be unreliable at times, so it's here just in case it doesn't delete the timestamp
            // when the cooldown expires.
            timestamps.set(message.author.id, now);
            setTimeout(() => timestamps.delete(author.id), cooldownAmount);
        }
        // execute command
        try {
            command.execute(message, args);
        }
        // catch any errors that occur
        catch(error) {
            console.error(error);
            message.reply('there was an error trying to execute that command!');
        }
    }
});

bot.login(token);

/**
* Get iris.js file contents as string.
* @return {string} output of "cat" console command.
*/
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

/**
* Check if guild member has admin permissions.
* @param  {GuildMember}  member {@link https://discord.js.org/#/docs/main/stable/class/GuildMember GuildMember}
* @return {boolean}        True if admin.
*/
function isAdmin(member) {
    return member.hasPermission("ADMINISTRATOR", { checkAdmin: true });
}

/**
* Check if suspect is a number, meant for use with strings, which could be empty.
* It would be overkill, otherwise, as !isNaN() would be sufficient.
* @param  {string} suspect Thing to check
* @return {boolean}         True if number, else false
*/
exports.numCheck = function numCheck(suspect) {
    const check1 = parseInt(suspect);
    const check2 = Number(suspect);
    return (!isNaN(check1) && !isNaN(check2));
}

/**
* Wrap text in a code block and get rid of undesirable characters.
* @param  {string} text Text to Wrap
* @return {string}      Wrapped text
*/
function wrap(text) {
    return '```\n' + text.replace(/`/g, '`' + String.fromCharCode(8203)) + '\n```';
}
exports.wrap = wrap;

/**
* Function to handle automatic message responses
* @param  {Message} message The {@link https://discord.js.org/#/docs/main/stable/class/Message message} to respond to
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
        if ((mess.includes('bot') || mess.includes('🤖')) && mess.includes('good')) {
            message.channel.send(`Thank you ${author}! I enjoy head pats as a sign of appreciation.`);
        }
        if (mess.includes('what big eye you have')) {
            message.channel.send(`All the better to watch you with ${author}.`);
        }
    }
}

// catch unhandled promise rejections
process.on('unhandledRejection', error => console.error(`Uncaught Promise Rejection:\n${error}`));
