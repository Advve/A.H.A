const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Pings the bot.'),
	async execute(interaction) {
		// Wysyła wiadomość "Pinging..." i oczekuje na odpowiedź
		const ping = await interaction.reply({ content: 'Pinging...', fetchReply: true });
		// Wylicza różnicę czasu pomiędzy wysłaniem komendy a otrzymaniem odpowiedzi (pingiem)
		// oraz opóźnienie API bota
		interaction.editReply(`🏓Ping of client: ${ping.createdTimestamp - interaction.createdTimestamp}ms, API Delay: ${Math.round(interaction.client.ws.ping)}ms`);
	},
};
