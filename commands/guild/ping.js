const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Pings the bot.'),
	async execute(interaction) {
		const ping = await interaction.reply({ content: 'Pinging...', fetchReply: true });
		interaction.editReply(`🏓Ping of client: ${ping.createdTimestamp - interaction.createdTimestamp}ms, API Delay: ${Math.round(interaction.client.ws.ping)}ms`);
	},
};