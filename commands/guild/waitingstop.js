const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('waitingstop')
		.setDescription('Disconnects bot from the channel and stops playing elevator music.'),
	
	// Metoda execute jest wywoływana, gdy komenda jest uruchamiana
	async execute(interaction) {
		const response = new EmbedBuilder()
			.setColor('#ffff00');
		// Sprawdzanie uprawnień użytkownika
		if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
			response.setDescription('❌You do not have permission to manage channels and make the bot leave one!');
			interaction.reply({ embeds: [response] });
			return;
		}
		else {
			const guildId = interaction.guildId;
			const connection = getVoiceConnection(guildId);
			// Sprawdzanie czy bot jest podłączony do kanału głosowego
			if (connection) {
				// Zniszczenie połączenia
				connection.destroy();
				response.setDescription('✅Successfully destroyed the connection!');
				interaction.reply({ embeds: [response] });
			}
			else {
				response.setDescription('❌Bot not connected!');
				interaction.reply({ embeds: [response] });
			}
		}
	},
};
