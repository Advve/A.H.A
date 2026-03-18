const fs = require('fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
// initialization of settings
const Settings = require('./database/settings');
require('dotenv').config();

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildVoiceStates,
	],
});
const token = process.env.DISCORD_TOKEN;

client.settings = new Settings();
// event handler

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

// Map for loading multiple event files with the same name inside of their scripts
const events = new Map();

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);

	if (events.has(event.name)) {
		events.get(event.name).handlers.push(event.execute);
	}
	else {
		events.set(event.name, { once: event.once ?? false, handlers: [event.execute] });
	}
}

for (const [eventName, { once, handlers }] of events) {
	const method = once ? 'once' : 'on';
	client[method](eventName, (...args) => {
		for (const handler of handlers) {
			handler(...args);
		}
	});
}
// command handler
client.commands = new Collection();
const commandFoldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(commandFoldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(__dirname, 'commands', `${folder}`);
	const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection
		// With the key as the command name and the value as the exported module
		client.commands.set(command.data.name, command);
	}
}
client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	}
	catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while processing a command!', ephemeral: true });
	}
});

// Prevent DNS / network blips from crashing the process
client.on('error', (err) => {
	console.error('[Discord] Client error:', err.message);
});

process.on('unhandledRejection', (err) => {
	console.error('[Process] Unhandled rejection:', err);
});

client.login(token);
