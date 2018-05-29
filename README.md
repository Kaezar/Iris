# Iris
<img src="./Files/Iris_Avatar_Square.png" width="256" height="256">

## Description
This project is a bot application for the [Discord](https://discordapp.com/) chat platform. The goal is to make an interactive bot which is both useful and enjoyable for users to interact with. Core functions of the bot include but are not limited to: scripted responses to certain messages, simulated dice rolling, saving user-defined dice rolls for ease of use, playing music in voice channels, translating phrases to English, and connecting to various web-based APIs to retrieve information, pictures, trivia, and the like.

Once added to a server, Iris recognizes predetermined chat command words, which must be prefixed by a certain symbol (by default: !). A list of all of the different command words, as well as the functions of the commands, can be accessed with the "help" command. Outside of commands, Iris is programmed to automatically respond to messages containing certain words or phrases, or in some cases, to messages mentioning Iris using Discord's mention feature that also contain certain words or phrases. These are all hard-coded message responses or emoji reactions that do not require any special computation or functions, and are meant to have a conversational feel to them (Ex: a user says hello to Iris and she says hello back).

## Project Structure
The main script is [iris.js](./iris.js), all of the chat commands are separated into their own files within the Commands directory. Additionally, there are a number of scripts used to integrate the database which stores user-defined dice rolls and the number of pats each user has given Iris. The only script besides the main one which should ever be run directly is [dbInit.js](./dbInit.js), which only needs to be run when setting up or migrating to a new system, or when changes are made to the database structure. There is also a script which exports a DiceRoll class, which is instantiated by the roll command whenever a dice roll is required.

## Configuration
In order to run your own version of Iris, several steps are necessary beyond cloning the repository and installing dependencies.

1. Create a new app at [the Discord developer page](https://discordapp.com/developers/applications/me).
2. Select "Create a bot user" in your new app's settings.
3. Retrieve the token from your app's page and record it but keep it secret.
4. Create a database using MySQL, record the database name as well as your username and password.
5. Run the dbInit.js script to set up the database models.
6. Enable developer mode in your Discord desktop app settings (Appearance/Advanced).
7. Create a config.json file using the provided [config.json.example](./config.json.example) as a template.
8. Enter the bot token, database name, username, and password that you recorded earlier (do not worry, the config.json file is set to be ignored by git in the .gitignore file).
9. Right-click your name in the side pane of the Discord desktop app and select "copy id", then paste the id where it says "YOUR_DISCORD_ID".
10. Enter the language code for your desired translation target language where it says "YOUR_LANGUAGE_CODE" (English is "en"), and the name of the language where it says "YOUR_LANGUAGE_NAME".
11. OPTIONAL: If you want translation to work (though I don't really recommend it), follow any of the various online tutorials for setting up a google cloud service account and place your service-account.json file in the project's main folder.
