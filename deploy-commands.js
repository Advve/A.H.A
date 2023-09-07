const fs = require('node:fs');
const path = require('node:path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');
const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();
const clientId = process.env.CLIENT_ID,
	token = process.env.DISCORD_TOKEN;

const globalCommands = [];
const guildCommands = [];

const globalCommandsPath = path.join(__dirname, 'commands', 'global');
const guildCommandsPath = path.join(__dirname, 'commands', 'guild');

const globalCommandFiles = fs.readdirSync(globalCommandsPath).filter(file => file.endsWith('.js'));
const guildCommandFiles = fs.readdirSync(guildCommandsPath).filter(file => file.endsWith('.js'));

for (const file of globalCommandFiles) {
	const filePath = path.join(globalCommandsPath, file);
	const command = require(filePath);
	globalCommands.push(command.data.toJSON());
}

for (const file of guildCommandFiles) {
	const filePath = path.join(guildCommandsPath, file);
	const command = require(filePath);
	guildCommands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(token);
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', async () => {
	console.log(`Logged in as ${client.user.tag}`);
	const guilds = client.guilds.cache.map(guild => guild.id);

	// Deploy global commands
	try {
		console.log(`Started refreshing ${globalCommands.length} application (/) global commands.`);
		const data = await rest.put(
			Routes.applicationCommands(clientId),
			{ body: globalCommands },
		);
		console.log(`Successfully reloaded ${data.length} application (/) global commands.`);
	}
	catch (error) {
		console.error(error);
	}

	// Deploy guild-specific commands for each guild the bot is on
	for (const guildId of guilds) {
		try {
			console.log(`Started refreshing ${guildCommands.length} application (/) commands for guild: ${guildId}`);
			const data = await rest.put(
				Routes.applicationGuildCommands(clientId, guildId),
				{ body: guildCommands },
			);
			console.log(`Successfully reloaded ${data.length} application (/) commands for guild: ${guildId}`);
		}
		catch (error) {
			console.error(`Error deploying commands for guild: ${guildId}`);
			console.error(error);
		}
	}

	client.destroy();
});

client.login(token);
