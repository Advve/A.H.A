const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');
const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();
const clientId = process.env.CLIENT_ID,
	token = process.env.DISCORD_TOKEN;

const rest = new REST({ version: '10' }).setToken(token);

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', async () => {
	console.log(`Logged in as ${client.user.tag}`);
	const guilds = client.guilds.cache.map(guild => guild.id);

	// Remove guild-specific commands for every guild the bot is on
	for (const guildId of guilds) {
		try {
			await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] });
			console.log(`Successfully deleted all guild commands for guild: ${guildId}`);
		}
		catch (error) {
			console.error(`Error deleting commands for guild: ${guildId}`);
			console.error(error);
		}
	}

	// Remove global commands
	try {
		await rest.put(Routes.applicationCommands(clientId), { body: [] });
		console.log('Successfully deleted all global commands.');
	}
	catch (error) {
		console.error('Error deleting global commands.');
		console.error(error);
	}

	client.destroy();
});

client.login(token);