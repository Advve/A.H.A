const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');

require('dotenv').config();
const clientId = process.env.CLIENT_ID,
	guildId = process.env.GUILD_ID,
	token = process.env.DISCORD_TOKEN;

const rest = new REST({ version: '10' }).setToken(token);

// for guild-based commands
rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] })
	.then(() => console.log('Successfully deleted all guild commands.'))
	.catch(console.error);