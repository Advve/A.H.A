const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Pings the bot.'),
	async execute(interaction) {
		const response = await interaction.reply({ content: 'Pinging...', withResponse: true });
		const reply = response.resource.message;
		interaction.editReply(`🏓Ping of client: ${reply.createdTimestamp - interaction.createdTimestamp}ms, API Delay: ${Math.round(interaction.client.ws.ping)}ms`);
	},
};